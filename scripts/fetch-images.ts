import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) {
    process.env[key.trim()] = rest.join("=").trim();
  }
});

const SERVICE_KEY = process.env.TOUR_API_KEY;
if (!SERVICE_KEY) {
  console.error("TOUR_API_KEY 환경변수가 없습니다.");
  process.exit(1);
}

const BASE_URL = "https://apis.data.go.kr/B551011/PhotoGalleryService1";

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
  const url = `${BASE_URL}/gallerySearchList1?serviceKey=${SERVICE_KEY}&MobileOS=ETC&MobileApp=DartTravel&keyword=${encodeURIComponent(keyword)}&numOfRows=3&pageNo=1&_type=json`;

  const res = await fetch(url);
  const text = await res.text();

  // XML 에러 응답 체크
  if (text.startsWith("<")) {
    console.warn(`  ⚠️  XML 에러 응답: ${text.substring(0, 100)}`);
    return [];
  }

  const data = JSON.parse(text);
  const items = data?.response?.body?.items?.item;

  if (!items) return [];

  const list = Array.isArray(items) ? items : [items];
  return list
    .map((item: any) => item.galWebImageUrl)
    .filter(Boolean)
    .slice(0, 3);
}

async function main() {
  const destPath = path.join(process.cwd(), "data", "destinations.json");
  const destinations: Destination[] = JSON.parse(fs.readFileSync(destPath, "utf-8"));

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

    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(destPath, JSON.stringify(destinations, null, 2), "utf-8");
  console.log("\n✅ destinations.json 업데이트 완료");
}

main();
