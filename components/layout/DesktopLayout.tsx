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

export default function DesktopLayout({
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
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
        gap: '40px',
        alignItems: 'start',
      }}
    >
      {/* Col 1: 헤더 + 지도 */}
      <div>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '35px', paddingBottom: '0.8rem' }}>🎯</span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(34px, 4.5vw, 40px)',
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

        <MapPanel
          landed={landed}
          revealing={revealing}
          isThrown={isThrown}
          handleLand={handleLand}
          handleReset={handleReset}
          setIsThrown={setIsThrown}
          padding="16px"
        />
      </div>

      {/* Col 2: InfoPanel or ResultSet */}
      <div style={{ paddingTop: '84px' }}>
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
              style={{ willChange: 'opacity, transform' }}
            >
              <ResultSet landed={landed} destDetail={destDetail} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
