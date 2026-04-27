'use client';
import { useState, useCallback } from 'react';
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
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

            {!loading && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={handleShare}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
                    background: copied ? 'var(--accent)' : '#ffffff',
                    color: copied ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => {
                    if (!copied) {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!copied) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  {copied ? '✓ 복사됨' : '🔗 링크 복사'}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '10px 20px',
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
