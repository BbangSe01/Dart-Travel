import { ImageResponse } from 'next/og';
import { getDestinationByName } from '@/lib/destinations';

export const size = { width: 1200, height: 630 };

const RING = {
  bg: 'linear-gradient(135deg, #f97316, #e85d26)',
  cream: '#fdf6ee',
  dark: '#181818',
};

function BrandMark({ mark }: { mark: number }) {
  return (
    <div
      style={{
        width: mark,
        height: mark,
        borderRadius: mark * 0.28,
        background: RING.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: mark * 0.81,
          height: mark * 0.81,
          borderRadius: '50%',
          background: RING.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: mark * 0.59,
            height: mark * 0.59,
            borderRadius: '50%',
            background: RING.dark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: mark * 0.37,
              height: mark * 0.37,
              borderRadius: '50%',
              background: RING.cream,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: mark * 0.16,
                height: mark * 0.16,
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function renderDestinationImage(rawName: string) {
  const dest = await getDestinationByName(decodeURIComponent(rawName)).catch(() => null);
  const photo = dest?.images?.[0];

  if (!dest) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#f5f3ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <BrandMark mark={80} />
          <span style={{ fontSize: 64, fontWeight: 700, color: '#111111' }}>다트 여행</span>
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#111111' }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={size.width}
            height={size.height}
            style={{ position: 'absolute', inset: 0, objectFit: 'cover' }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.82) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '56px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <BrandMark mark={40} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff' }}>다트 여행</span>
          </div>
          <span style={{ fontSize: 24, color: '#fdf6ee', opacity: 0.85 }}>다트가 뽑은 오늘의 여행지</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px', marginTop: '10px' }}>
            <span style={{ fontSize: 76, fontWeight: 700, color: '#ffffff', letterSpacing: '-2px' }}>{dest.name}</span>
            <span style={{ fontSize: 44 }}>{dest.emoji}</span>
          </div>
          {dest.tag && (
            <span
              style={{
                marginTop: '20px',
                fontSize: 22,
                color: '#ffffff',
                background: 'rgba(232,93,38,0.9)',
                padding: '8px 20px',
                borderRadius: '20px',
                alignSelf: 'flex-start',
              }}
            >
              #{dest.tag}
            </span>
          )}
        </div>
      </div>
    ),
    size
  );
}
