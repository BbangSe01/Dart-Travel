'use client';
import { motion, AnimatePresence } from 'framer-motion';
import MapPanel from '@/components/panels/MapPanel';
import ResultSet from '@/components/panels/ResultSet';
import type { Destination } from '@/components/KoreaMap';
import { useCallback, useState } from 'react';

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

export default function MobileLayout({
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
    <div style={{ padding: '24px 16px' }}>
      {/* 헤더 */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '28px' }}>🎯</span>
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

      {/* 안내 카드 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <div
          style={{
            flex: 1,
            borderRadius: '12px',
            padding: '12px 14px',
            background: 'linear-gradient(135deg, rgba(232,93,38,0.06) 0%, rgba(232,93,38,0.02) 100%)',
            border: '1px solid rgba(232,93,38,0.2)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--accent)',
              letterSpacing: '0.1em',
              margin: '0 0 4px',
              fontWeight: 700,
            }}
          >
            TRAVEL OPTIONS
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            전국 국내 여행지 랜덤 추천!
          </p>
        </div>
        <div
          style={{
            flex: 1,
            borderRadius: '12px',
            padding: '12px 14px',
            background: '#ffffff',
            border: '1px solid var(--border)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-light)',
              letterSpacing: '0.1em',
              margin: '0 0 4px',
              fontWeight: 700,
            }}
          >
            HOW TO USE
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            지도 클릭 → 다트 발사 → 여행지 공개
          </p>
        </div>
      </div>

      {/* 지도 */}
      <MapPanel
        landed={landed}
        revealing={revealing}
        isThrown={isThrown}
        handleLand={handleLand}
        handleReset={handleReset}
        setIsThrown={setIsThrown}
        padding="12px"
      />

      {/* 센터 모달 */}
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
                    {copied ? '✓ 복사됨' : '🔗 링크 복사'}
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
