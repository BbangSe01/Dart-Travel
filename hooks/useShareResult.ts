import { useCallback, useState } from 'react';
import type { Destination } from '@/lib/destinations';

// 결과 공유 URL — /d/[name]이 여행지별 OG 이미지를 물고 있다가 실제 결과 화면(/?dest=)으로 리다이렉트
export function useShareResult(landed: Destination | null) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (!landed) return;

    const base = typeof window !== 'undefined' ? window.location.origin : 'https://dart-travel.vercel.app';
    const url = `${base}/d/${encodeURIComponent(landed.name)}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: '다트 여행',
          text: `다트를 던져서 "${landed.name}"이(가) 나왔어요!`,
          url,
        });
        return;
      } catch {
        // 사용자가 공유 시트를 취소한 경우 — 클립보드 폴백으로 넘어가지 않고 그냥 종료
        return;
      }
    }

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [landed]);

  return { handleShare, copied };
}
