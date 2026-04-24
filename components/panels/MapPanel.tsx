'use client';
import { motion, AnimatePresence } from 'framer-motion';
import KoreaMap from '@/components/KoreaMap';
import type { Destination } from '@/components/KoreaMap';

interface Props {
  landed: Destination | null;
  revealing: boolean;
  isThrown: boolean;
  handleLand: (dest: Destination) => void;
  handleReset: () => void;
  setIsThrown: (v: boolean) => void;
  padding?: string;
}

export default function MapPanel({
  landed,
  revealing,
  isThrown,
  handleLand,
  handleReset,
  setIsThrown,
  padding = '16px',
}: Props) {
  const mapProps = {
    onLand: handleLand,
    isThrown,
    setIsThrown: (v: boolean) => {
      setIsThrown(v);
      if (!v) handleReset();
    },
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
        <KoreaMap {...mapProps} />
      </div>

      <AnimatePresence mode="wait">
        {(landed || revealing) && (
          <motion.div
            key="reset-btn"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ marginTop: '12px', textAlign: 'center' }}
          >
            <button
              onClick={handleReset}
              style={{
                padding: '10px 28px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: '#ffffff',
                color: 'var(--text-muted)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              🎯 다시 던지기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
