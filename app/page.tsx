'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KoreaMap, { type Destination } from '@/components/KoreaMap';
import CourseCard from '@/components/CourseCard';

export default function Home() {
  const [isThrown, setIsThrown] = useState(false);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [destDetail, setDestDetail] = useState<any>(null);

  const handleLand = useCallback(async (dest: Destination) => {
    setLanded(dest);
    setLoading(true);
    try {
      const res = await fetch(`/api/destination?name=${encodeURIComponent(dest.name)}`);
      const data = await res.json();
      setDestDetail(data);
    } catch {
      setDestDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsThrown(false);
    setLanded(null);
    setLoading(false);
    setDestDetail(null);
  }, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left: Map */}
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
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                margin: 0,
              }}
            >
              랜덤 국내 여행지 추천 — 지도를 클릭해보세요
            </p>
          </motion.div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '16px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
            }}
          >
            <KoreaMap
              onLand={handleLand}
              isThrown={isThrown}
              setIsThrown={v => {
                setIsThrown(v);
                if (!v) handleReset();
              }}
            />
          </div>

          <AnimatePresence>
            {landed && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
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

        {/* Right: Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '84px' }}>
          <AnimatePresence>
            {!landed && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,93,38,0.06) 0%, rgba(232,93,38,0.02) 100%)',
                    border: '1px solid rgba(232,93,38,0.2)',
                    borderRadius: '16px',
                    padding: '24px 28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>🎯</span>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--accent)',
                        letterSpacing: '0.12em',
                        margin: 0,
                        fontWeight: 700,
                      }}
                    >
                      TRAVEL OPTIONS
                    </p>
                  </div>
                  <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                    지도를 클릭하면 랜덤으로 국내 여행지를 추천해드려요.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!landed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-light)',
                      letterSpacing: '0.12em',
                      marginBottom: '20px',
                    }}
                  >
                    HOW TO USE
                  </p>
                  {[
                    { emoji: '🗺️', text: '지도 아무 곳이나 클릭' },
                    { emoji: '🎯', text: '다트가 날아가 여행지 결정' },
                    { emoji: '📸', text: '여행지 정보와 사진 제공' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        marginBottom: i < 2 ? '16px' : 0,
                        padding: '12px 16px',
                        background: 'rgba(232,93,38,0.03)',
                        borderRadius: '10px',
                      }}
                    >
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.emoji}</span>
                      <span
                        style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {landed && <CourseCard destination={landed} destDetail={destDetail} loading={loading} />}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
