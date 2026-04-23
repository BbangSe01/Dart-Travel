/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as path from 'path';

// .env 파일 파싱
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    process.env[key.trim()] = rest.join('=').trim();
  }
});

const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 없습니다.');
  process.exit(1);
}

interface Blog {
  title: string;
  link: string;
  description: string;
  bloggername: string;
}

interface Destination {
  name: string;
  blogs?: Blog[];
  [key: string]: any;
}

async function fetchBlogs(keyword: string): Promise<Blog[]> {
  const query = encodeURIComponent(`${keyword} 여행`);
  const url = `https://openapi.naver.com/v1/search/blog?query=${query}&display=5&sort=sim`;

  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': CLIENT_ID!,
      'X-Naver-Client-Secret': CLIENT_SECRET!,
    },
  });

  if (!res.ok) {
    console.error(`API 오류: ${res.status}`);
    return [];
  }

  const data = await res.json();
  const items = data.items ?? [];

  return items.map((item: any) => ({
    title: item.title.replace(/<[^>]+>/g, ''), // HTML 태그 제거
    link: item.link,
    description: item.description.replace(/<[^>]+>/g, '').slice(0, 80) + '...', // 80자 요약
    bloggername: item.bloggername,
  }));
}

async function main() {
  const destPath = path.join(process.cwd(), 'data', 'destinations.json');
  const destinations: Destination[] = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

  console.log(`총 ${destinations.length}개 여행지 블로그 수집 시작\n`);

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    process.stdout.write(`[${i + 1}/${destinations.length}] ${dest.name} ...`);

    try {
      const blogs = await fetchBlogs(dest.name);
      dest.blogs = blogs;
      process.stdout.write(` ✓ (${blogs.length}개)\n`);
    } catch (e) {
      process.stdout.write(` ✗ 실패: ${e}\n`);
      dest.blogs = [];
    }

    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(destPath, JSON.stringify(destinations, null, 2), 'utf-8');
  console.log('\n✅ destinations.json 업데이트 완료');
}

main();
