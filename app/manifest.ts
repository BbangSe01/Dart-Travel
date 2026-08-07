import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '다트 여행 | 랜덤 국내 여행지 추천',
    short_name: '다트 여행',
    description: '지도에 다트를 던져 오늘의 여행지를 결정하세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f3ef',
    theme_color: '#e85d26',
    lang: 'ko',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
