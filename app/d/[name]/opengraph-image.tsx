import { renderDestinationImage, size } from './shared-image';

export const runtime = 'edge';
export const alt = '다트 여행 - 오늘의 추천 여행지';
export const contentType = 'image/png';
export { size };

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return renderDestinationImage(name);
}
