import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#e85d26',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://dart-travel.vercel.app'),
  title: '다트 여행 | 랜덤 국내 여행지 추천',
  description:
    '지도에 다트를 던져 오늘의 여행지를 결정하세요. 필터링을 통해 당신의 취향에 맞는 여행지를 찾을 확률을 높여보세요. 여행지 사진과 다양한 블로그 리뷰를 참고해 전국 국내 여행지를 랜덤으로 추천해드려요.',
  keywords: [
    '랜덤 여행',
    '국내 여행 추천',
    '여행지 추천',
    '다트 여행',
    '국내 여행',
    '지도 다트',
    '랜덤 여행지',
    '국내 여행지 추천',
    '여행 추천',
    '당일치기 여행',
    '국내 여행 어디갈까',
    '여행지 랜덤 뽑기',
  ],
  authors: [{ name: '다트 여행' }],
  creator: '다트 여행',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dart-travel.vercel.app',
    siteName: '다트 여행',
    title: '다트 여행 | 랜덤 국내 여행지 추천',
    description: '지도에 다트를 던져 오늘의 여행지를 결정하세요.',
    images: [
      {
        url: 'https://dart-travel.vercel.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: '다트 여행 - 랜덤 국내 여행지 추천',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '다트 여행 | 랜덤 국내 여행지 추천',
    description: '지도에 다트를 던져 오늘의 여행지를 결정하세요.',
    images: ['https://dart-travel.vercel.app/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  manifest: '/manifest.webmanifest',
  verification: { google: 'hkMTTYkbUeH_Y9R4OVOuj4-nOnL9uMk-UvGja_Z5K9s' },
  alternates: {
    canonical: 'https://dart-travel.vercel.app',
  },
  category: '여행',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
