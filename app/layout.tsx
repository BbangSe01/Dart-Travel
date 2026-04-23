import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: '다트 여행 | 랜덤 국내 여행지 추천',
  description:
    '지도에 다트를 던져 오늘의 여행지를 결정하세요. 한국관광공사 공식 사진과 함께 국내 여행지를 랜덤으로 추천해드려요.',
  keywords: ['랜덤 여행', '국내 여행 추천', '여행지 추천', '다트 여행', '국내 여행'],
  authors: [{ name: '다트 뽑기' }],
  creator: '다트 뽑기',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dart-travel.vercel.app',
    siteName: '다트 뽑기',
    title: '다트 뽑기 | 랜덤 국내 여행지 추천',
    description: '지도에 다트를 던져 오늘의 여행지를 결정하세요. 국내 전국 여행지 랜덤 추천',
    images: [
      {
        url: 'https://dart-travel.vercel.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: '다트 뽑기 - 랜덤 국내 여행지 추천',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '다트 뽑기 | 랜덤 국내 여행지 추천',
    description: '지도에 다트를 던져 오늘의 여행지를 결정하세요.',
    images: ['https://dart-travel.vercel.app/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'hkMTTYkbUeH_Y9R4OVOuj4-nOnL9uMk-UvGja_Z5K9s',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
