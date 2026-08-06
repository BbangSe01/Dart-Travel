'use client';
import { motion } from 'framer-motion';
import KoreaMap from '@/components/panels/left/KoreaMap';
import type { Destination } from '@/lib/destinations';

interface Props {
  landed: Destination | null;
  revealing: boolean;
  isThrown: boolean;
  handleLand: (dest: Destination) => void;
  handleReset: () => void;
  setIsThrown: (v: boolean) => void;
  filteredDestinations: Destination[];
  allDestinations: Destination[];
  destinationsLoading: boolean;
  padding?: string;
}

export default function MapPanel({
  landed,
  revealing,
  isThrown,
  handleLand,
  handleReset,
  setIsThrown,
  filteredDestinations,
  allDestinations,
  destinationsLoading,
  padding = '16px',
}: Props) {
  const mapProps = {
    onLand: handleLand,
    isThrown,
    setIsThrown: (v: boolean) => {
      setIsThrown(v);
      if (!v) handleReset();
    },
    filteredDestinations,
    allDestinations,
  };

  return (
    <div>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding,
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        }}
      >
        {destinationsLoading ? (
          <div
            style={{
              aspectRatio: '500 / 600',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '3px solid rgba(232,93,38,0.15)',
                borderTopColor: 'var(--accent)',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              여행지 불러오는 중...
            </span>
          </div>
        ) : (
          <KoreaMap {...mapProps} />
        )}
      </div>
    </div>
  );
}
