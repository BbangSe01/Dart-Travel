import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    process.env[key.trim()] = rest.join('=').trim();
  }
});

const SERVICE_KEY = process.env.TOUR_API_KEY;
if (!SERVICE_KEY) {
  console.error('TOUR_API_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const BASE_URL = 'https://apis.data.go.kr/B551011/PhotoGalleryService1';

interface Destination {
  name: string;
  tag: string;
  emoji: string;
  reason: string;
  x: number;
  y: number;
  images?: string[];
}

async function fetchImages(keyword: string): Promise<string[]> {
  // 검색어 후보 생성
  const candidates = getSearchCandidates(keyword);

  for (const candidate of candidates) {
    const url = `${BASE_URL}/gallerySearchList1?serviceKey=${SERVICE_KEY}&MobileOS=ETC&MobileApp=DartTravel&keyword=${encodeURIComponent(candidate)}&numOfRows=5&pageNo=1&_type=json`;

    const res = await fetch(url);
    const text = await res.text();

    if (text.startsWith('<')) continue; // XML 에러면 다음 후보로

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

      if (images.length > 0) return images; // 이미지 찾으면 즉시 반환
    } catch {
      continue;
    }
  }

  return [];
}

function getSearchCandidates(name: string): string[] {
  const candidates: string[] = [];

  // 1순위: 원본 이름 (특수문자 제거)
  const cleaned = name.replace(/[·\/\(\)]/g, ' ').trim();
  candidates.push(cleaned);

  // 2순위: 공백 기준으로 분리 후 마지막 단어
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length > 1) {
    candidates.push(parts[parts.length - 1]); // 마지막 단어 (장소명)
    candidates.push(parts.slice(1).join(' ')); // 지역명 제외한 나머지
  }

  // 3순위: 첫 번째 단어 (지역명)
  if (parts.length > 0) {
    candidates.push(parts[0]);
  }

  // 중복 제거
  return [...new Set(candidates)];
}

async function main() {
  const destPath = path.join(process.cwd(), 'data', 'destinations.json');
  const destinations: Destination[] = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

  console.log(`총 ${destinations.length}개 여행지 이미지 수집 시작\n`);

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    process.stdout.write(`[${i + 1}/${destinations.length}] ${dest.name} ...`);

    try {
      const images = await fetchImages(dest.name);
      dest.images = images;
      process.stdout.write(` ✓ (${images.length}장)\n`);
    } catch (e) {
      process.stdout.write(` ✗ 실패: ${e}\n`);
      dest.images = [];
    }

    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(destPath, JSON.stringify(destinations, null, 2), 'utf-8');
  console.log('\n✅ destinations.json 업데이트 완료');
}

main();
