import * as fs from 'fs';
import * as path from 'path';
import { supabaseAdmin } from './supabase-admin';

// .env 파싱
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
});

const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const SERVICE_KEY = process.env.TOUR_API_KEY;

const newPath = path.join(process.cwd(), 'data', 'new-destinations.json');

const isAll = process.argv.includes('--all');

interface DestinationRow {
  id: string;
  name: string;
  images: string[];
  blogs: any[];
  [key: string]: any;
}

// ─── Step 1. Merge ───────────────────────────────────────────
async function merge() {
  console.log('\n📦 [1/3] 여행지 병합 시작');

  if (!fs.existsSync(newPath)) {
    console.log('  data/new-destinations.json 없음 → 스킵');
    return;
  }

  const newItems: any[] = JSON.parse(fs.readFileSync(newPath, 'utf-8'));

  if (newItems.length === 0) {
    console.log('  추가할 항목 없음 → 스킵');
    return;
  }

  const { data: existing, error: fetchError } = await supabaseAdmin.from('destinations').select('name');
  if (fetchError) {
    console.error('  ❌ 기존 목록 조회 실패:', fetchError.message);
    return;
  }

  const existingNames = new Set((existing ?? []).map((d: any) => d.name));
  const required = ['name', 'tag', 'emoji', 'lat', 'lng', 'season', 'theme'];
  const toInsert: any[] = [];
  let skippedCount = 0;

  for (const item of newItems) {
    if (existingNames.has(item.name)) {
      console.warn(`  ⚠️  이미 존재: ${item.name}`);
      skippedCount++;
      continue;
    }

    const missing = required.filter(k => !(k in item));
    if (missing.length > 0) {
      console.warn(`  ⚠️  필수 필드 누락 스킵: ${item.name} (${missing.join(', ')})`);
      skippedCount++;
      continue;
    }

    toInsert.push({ ...item, images: item.images ?? [], blogs: item.blogs ?? [] });
    existingNames.add(item.name);
  }

  if (toInsert.length === 0) {
    console.log(`  완료: 추가 0개 / 스킵 ${skippedCount}개`);
    return;
  }

  const { error: insertError } = await supabaseAdmin.from('destinations').insert(toInsert);
  if (insertError) {
    console.error('  ❌ insert 실패:', insertError.message);
    return;
  }

  toInsert.forEach(item => console.log(`  ✅ 추가: ${item.name}`));
  console.log(`  완료: 추가 ${toInsert.length}개 / 스킵 ${skippedCount}개`);
}

// ─── Step 2. Fetch Images ────────────────────────────────────
async function fetchImages() {
  console.log(`\n🖼️  [2/3] 이미지 수집 시작 ${isAll ? '(전체)' : '(신규만)'}`);

  if (!SERVICE_KEY) {
    console.error('  ❌ TOUR_API_KEY 없음 → 스킵');
    return;
  }

  const { data, error } = await supabaseAdmin.from('destinations').select('*');
  if (error) {
    console.error('  ❌ 목록 조회 실패:', error.message);
    return;
  }

  const targets: DestinationRow[] = isAll ? (data ?? []) : (data ?? []).filter((d: DestinationRow) => !d.images || d.images.length === 0);

  if (targets.length === 0) {
    console.log('  수집할 항목 없음 → 스킵');
    return;
  }

  console.log(`  대상 ${targets.length}개\n`);

  const BASE_URL = 'https://apis.data.go.kr/B551011/PhotoGalleryService1';

  function getSearchCandidates(name: string): string[] {
    const cleaned = name.replace(/[·\/\(\)]/g, ' ').trim();
    const parts = cleaned.split(' ').filter(Boolean);
    const candidates = [cleaned];
    if (parts.length > 1) {
      candidates.push(parts[parts.length - 1]);
      candidates.push(parts.slice(1).join(' '));
    }
    if (parts.length > 0) candidates.push(parts[0]);
    return [...new Set(candidates)];
  }

  async function fetchImagesForDest(keyword: string): Promise<string[]> {
    for (const candidate of getSearchCandidates(keyword)) {
      const url = `${BASE_URL}/gallerySearchList1?serviceKey=${SERVICE_KEY}&MobileOS=ETC&MobileApp=DartTravel&keyword=${encodeURIComponent(candidate)}&numOfRows=5&pageNo=1&_type=json`;
      const res = await fetch(url);
      const text = await res.text();
      if (text.startsWith('<')) continue;
      try {
        const data = JSON.parse(text);
        const items = data?.response?.body?.items?.item;
        if (!items) continue;
        const list = Array.isArray(items) ? items : [items];
        const images = list
          .map((item: any) => item.galWebImageUrl)
          .filter(Boolean)
          .map((url: string) => url.replace('http://', 'https://'))
          .slice(0, 3);
        if (images.length > 0) return images;
      } catch {
        continue;
      }
    }
    return [];
  }

  for (let i = 0; i < targets.length; i++) {
    const dest = targets[i];
    process.stdout.write(`  [${i + 1}/${targets.length}] ${dest.name} ...`);
    try {
      const images = await fetchImagesForDest(dest.name);
      const { error: updateError } = await supabaseAdmin.from('destinations').update({ images }).eq('id', dest.id);
      if (updateError) throw updateError;
      process.stdout.write(` ✓ (${images.length}장)\n`);
    } catch {
      process.stdout.write(` ✗ 실패\n`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('  이미지 수집 완료');
}

// ─── Step 3. Fetch Blogs ─────────────────────────────────────
async function fetchBlogs() {
  console.log(`\n📝 [3/3] 블로그 수집 시작 ${isAll ? '(전체)' : '(신규만)'}`);

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('  ❌ NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET 없음 → 스킵');
    return;
  }

  const { data, error } = await supabaseAdmin.from('destinations').select('*');
  if (error) {
    console.error('  ❌ 목록 조회 실패:', error.message);
    return;
  }

  const targets: DestinationRow[] = isAll ? (data ?? []) : (data ?? []).filter((d: DestinationRow) => !d.blogs || d.blogs.length === 0);

  if (targets.length === 0) {
    console.log('  수집할 항목 없음 → 스킵');
    return;
  }

  console.log(`  대상 ${targets.length}개\n`);

  async function fetchBlogsForDest(keyword: string) {
    const query = encodeURIComponent(`${keyword} 여행`);
    const url = `https://openapi.naver.com/v1/search/blog?query=${query}&display=5&sort=sim`;
    const res = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': CLIENT_ID!,
        'X-Naver-Client-Secret': CLIENT_SECRET!,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      title: item.title.replace(/<[^>]+>/g, ''),
      link: item.link,
      description: item.description.replace(/<[^>]+>/g, '').slice(0, 80) + '...',
      bloggername: item.bloggername,
    }));
  }

  for (let i = 0; i < targets.length; i++) {
    const dest = targets[i];
    process.stdout.write(`  [${i + 1}/${targets.length}] ${dest.name} ...`);
    try {
      const blogs = await fetchBlogsForDest(dest.name);
      const { error: updateError } = await supabaseAdmin.from('destinations').update({ blogs }).eq('id', dest.id);
      if (updateError) throw updateError;
      process.stdout.write(` ✓ (${blogs.length}개)\n`);
    } catch {
      process.stdout.write(` ✗ 실패\n`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('  블로그 수집 완료');
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  console.log(`🚀 update-destinations 시작 ${isAll ? '(전체 업데이트)' : '(신규 항목만)'}`);
  await merge();
  await fetchImages();
  await fetchBlogs();
  console.log('\n🎉 모든 작업 완료!');
}

main().catch(console.error);
