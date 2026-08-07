import { cache } from 'react';
import type { Metadata } from 'next';
import { getDestinationByName } from '@/lib/destinations';
import DartboardIcon from '@/components/DartboardIcon';
import RedirectToResult from './RedirectToResult';

const getDest = cache(getDestinationByName);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const dest = await getDest(decodeURIComponent(name));

  if (!dest) {
    return { title: '다트 여행 | 랜덤 국내 여행지 추천' };
  }

  const title = `다트가 뽑은 오늘의 여행지: ${dest.name} ${dest.emoji}`;
  const description = dest.reason || `지도에 다트를 던져서 "${dest.name}"이(가) 나왔어요. 나도 다트 던져보러 가기 →`;
  const url = `https://dart-travel.vercel.app/d/${encodeURIComponent(dest.name)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: '다트 여행',
      url,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DestinationSharePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const dest = await getDest(decodeURIComponent(name));

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: 'var(--bg-deep)',
      }}
    >
      <RedirectToResult name={dest ? dest.name : null} />
      <DartboardIcon size={40} />
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '14px' }}>
        {dest ? `${dest.name}(으)로 이동 중...` : '이동 중...'}
      </p>
    </div>
  );
}
