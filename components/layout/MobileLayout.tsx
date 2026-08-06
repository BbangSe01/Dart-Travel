'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapPanel from '@/components/panels/left/MapPanel';
import ResultSet from '@/components/panels/right/result/ResultSet';
import InfoPanel from '@/components/panels/right/info/InfoPanel';
import type { Destination } from '@/lib/destinations';

interface Props {
  landed: Destination | null;
  revealing: boolean;
  destDetail: any;
  loading: boolean;
  isThrown: boolean;
  handleLand: (dest: Destination) => void;
  handleReset: () => void;
  setIsThrown: (v: boolean) => void;
  filteredDestinations: Destination[];
  allDestinations: Destination[];
  destinationsLoading: boolean;
  onFilterChange: (filter: any) => void;
  infoPanelKey: number;
}

export default function MobileLayout({
  landed,
  revealing,
  destDetail,
  loading,
  isThrown,
  handleLand,
  handleReset,
  setIsThrown,
  filteredDestinations,
  allDestinations,
  destinationsLoading,
  onFilterChange,
  infoPanelKey,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://dart-travel.vercel.app';
    const url = `${base}?dest=${encodeURIComponent(landed!.name)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [landed]);

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px', paddingBottom: '0.6rem' }}>🎯</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 6vw, 32px)',
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

      {/* 지도 */}
      <MapPanel
        landed={landed}
        revealing={revealing}
        isThrown={isThrown}
        handleLand={handleLand}
        handleReset={handleReset}
        setIsThrown={setIsThrown}
        filteredDestinations={filteredDestinations}
        allDestinations={allDestinations}
        destinationsLoading={destinationsLoading}
        padding="12px"
      />

      {/* 지도 아래 InfoPanel */}
      <div style={{ marginTop: '16px' }}>
        <InfoPanel key={infoPanelKey} onFilterChange={onFilterChange} />
      </div>

      <AnimatePresence>
        {landed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={handleReset}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <ResultSet landed={landed} destDetail={destDetail} loading={loading} isMobile />
              {!loading && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleShare}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
                      background: copied ? 'var(--accent)' : 'rgba(255,255,255,0.95)',
                      color: copied ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                    }}
                  >
                    {copied ? '✓ 결과를 공유해보세요!' : '🔗 결과 URL 복사'}
                  </button>
                  <button
                    onClick={handleReset}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.95)',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                    }}
                  >
                    🎯 다시 던지기
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
