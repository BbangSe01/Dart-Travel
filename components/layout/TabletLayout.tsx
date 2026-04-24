'use client';
import { motion, AnimatePresence } from 'framer-motion';
import MapPanel from '@/components/panels/MapPanel';
import ResultSet from '@/components/panels/ResultSet';
import InfoPanel from '@/components/InfoPanel';
import type { Destination } from '@/components/KoreaMap';

interface Props {
  landed: Destination | null;
  revealing: boolean;
  destDetail: any;
  loading: boolean;
  isThrown: boolean;
  handleLand: (dest: Destination) => void;
  handleReset: () => void;
  setIsThrown: (v: boolean) => void;
}

export default function TabletLayout({
  landed,
  revealing,
  destDetail,
  loading,
  isThrown,
  handleLand,
  handleReset,
  setIsThrown,
}: Props) {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '28px' }}>🎯</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            다트 여행, 오늘은 어디로?
          </h1>
        </div>
      </motion.div>

      {/* 지도 — 60% 너비, 중앙 정렬 */}
      <div style={{ maxWidth: '60%', margin: '0 auto 20px' }}>
        <MapPanel
          landed={landed}
          revealing={revealing}
          isThrown={isThrown}
          handleLand={handleLand}
          handleReset={handleReset}
          setIsThrown={setIsThrown}
          padding="12px"
        />
      </div>

      {/* ResultSet — 지도 아래 */}
      <AnimatePresence mode="wait">
        {!landed && !revealing && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <InfoPanel />
          </motion.div>
        )}
        {landed && (
          <motion.div
            key="landed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ResultSet landed={landed} destDetail={destDetail} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
