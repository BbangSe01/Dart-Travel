import * as fs from 'fs';
import * as path from 'path';

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

const destPath = path.join(process.cwd(), 'data', 'destinations.json');
const newPath = path.join(process.cwd(), 'data', 'new-destinations.json');
const clientPath = path.join(process.cwd(), 'data', 'destinations-client.ts');

const isAll = process.argv.includes('--all');

// ─── Step 1. Merge ───────────────────────────────────────────
function merge() {
  console.log('\n📦 [1/4] 여행지 병합 시작');

  if (!fs.existsSync(newPath)) {
    console.log('  data/new-destinations.json 없음 → 스킵');
    return;
  }

  const existing: any[] = JSON.parse(fs.readFileSync(destPath, 'utf-8'));
  const newItems: any[] = JSON.parse(fs.readFileSync(newPath, 'utf-8'));

  if (newItems.length === 0) {
    console.log('  추가할 항목 없음 → 스킵');
    return;
  }

  const existingNames = new Set(existing.map((d: any) => d.name));
  let addedCount = 0;
  let skippedCount = 0;

  for (const item of newItems) {
    if (existingNames.has(item.name)) {
      console.warn(`  ⚠️  이미 존재: ${item.name}`);
      skippedCount++;
      continue;
    }

    const required = ['name', 'tag', 'emoji', 'lat', 'lng', 'season', 'theme'];
    const missing = required.filter(k => !(k in item));
    if (missing.length > 0) {
      console.warn(`  ⚠️  필수 필드 누락 스킵: ${item.name} (${missing.join(', ')})`);
      skippedCount++;
      continue;
    }

    item.images = item.images ?? [];
    item.blogs = item.blogs ?? [];
    existing.push(item);
    existingNames.add(item.name);
    addedCount++;
    console.log(`  ✅ 추가: ${item.name}`);
  }

  fs.writeFileSync(destPath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`  완료: 추가 ${addedCount}개 / 스킵 ${skippedCount}개 / 총 ${existing.length}개`);
}

// ─── Step 2. Fetch Images ────────────────────────────────────
async function fetchImages() {
  console.log(`\n🖼️  [2/4] 이미지 수집 시작 ${isAll ? '(전체)' : '(신규만)'}`);

  if (!SERVICE_KEY) {
    console.error('  ❌ TOUR_API_KEY 없음 → 스킵');
    return;
  }

  const destinations: any[] = JSON.parse(fs.readFileSync(destPath, 'utf-8'));
  const targets = isAll ? destinations : destinations.filter(d => !d.images || d.images.length === 0);

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
      dest.images = images;
      process.stdout.write(` ✓ (${images.length}장)\n`);
    } catch {
      process.stdout.write(` ✗ 실패\n`);
      dest.images = [];
    }
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(destPath, JSON.stringify(destinations, null, 2), 'utf-8');
  console.log('  이미지 수집 완료');
}

// ─── Step 3. Fetch Blogs ─────────────────────────────────────
async function fetchBlogs() {
  console.log(`\n📝 [3/4] 블로그 수집 시작 ${isAll ? '(전체)' : '(신규만)'}`);

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('  ❌ NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET 없음 → 스킵');
    return;
  }

  const destinations: any[] = JSON.parse(fs.readFileSync(destPath, 'utf-8'));
  const targets = isAll ? destinations : destinations.filter(d => !d.blogs || d.blogs.length === 0);

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
      dest.blogs = blogs;
      process.stdout.write(` ✓ (${blogs.length}개)\n`);
    } catch {
      process.stdout.write(` ✗ 실패\n`);
      dest.blogs = [];
    }
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(destPath, JSON.stringify(destinations, null, 2), 'utf-8');
  console.log('  블로그 수집 완료');
}

// ─── Step 4. Generate Client ─────────────────────────────────
function generateClient() {
  console.log('\n⚙️  [4/4] destinations-client.ts 생성');

  const data: any[] = JSON.parse(fs.readFileSync(destPath, 'utf-8'));
  const lines = data.map((d: any) => {
    const season = JSON.stringify(d.season ?? []);
    const theme = JSON.stringify(d.theme ?? []);
    return `  { name: '${d.name}', tag: '${d.tag}', emoji: '${d.emoji}', lat: ${d.lat}, lng: ${d.lng}, season: ${season}, theme: ${theme} },`;
  });

  const content = `export interface Destination {
  name: string;
  tag: string;
  emoji: string;
  lat: number;
  lng: number;
  season: string[];
  theme: string[];
}

export const DESTINATIONS: Destination[] = [
${lines.join('\n')}
];
`;

  fs.writeFileSync(clientPath, content, 'utf-8');
  console.log(`  ✅ destinations-client.ts 생성 완료 (${data.length}개)`);
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  console.log(`🚀 update-destinations 시작 ${isAll ? '(전체 업데이트)' : '(신규 항목만)'}`);
  merge();
  await fetchImages();
  await fetchBlogs();
  generateClient();
  console.log('\n🎉 모든 작업 완료!');
}

main().catch(console.error);
