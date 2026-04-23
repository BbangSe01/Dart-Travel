'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KoreaMap, { type Destination } from '@/components/KoreaMap';
import CourseCard from '@/components/CourseCard';
import BlogPreview from '@/components/BlogPreview';
import InfoPanel from '@/components/InfoPanel';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Home 밖에 선언
function ResultSet({ landed, destDetail, loading }: { landed: Destination; destDetail: any; loading: boolean }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'clip',
        boxShadow: '...',
        maxHeight: '530px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 28px minmax(0, 0.75fr)',
          alignItems: 'stretch',
          flex: 1,
          minHeight: 0,
        }}
      >
        <CourseCard destination={landed} destDetail={destDetail} loading={loading} noBorder />

        {/* 스프링 고리 */}
        <div
          style={{
            background: '#e8e4de',
            borderLeft: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            padding: '16px 0',
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2px solid var(--border)',
                background: '#ffffff',
              }}
            />
          ))}
        </div>

        {!loading && destDetail?.blogs && destDetail.blogs.length > 0 ? (
          <BlogPreview blogs={destDetail.blogs} noBorder />
        ) : (
          <div style={{ background: '#ffffff' }} />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [isThrown, setIsThrown] = useState(false);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [destDetail, setDestDetail] = useState<any>(null);
  const [revealing, setRevealing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

  const handleLand = useCallback(async (dest: Destination) => {
    setRevealing(true);
    setTimeout(async () => {
      setRevealing(false);
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
    }, 3000);
  }, []);

  const handleReset = useCallback(() => {
    setIsThrown(false);
    setLanded(null);
    setLoading(false);
    setDestDetail(null);
    setRevealing(false);
  }, []);

  const mapProps = {
    onLand: handleLand,
    isThrown,
    setIsThrown: (v: boolean) => {
      setIsThrown(v);
      if (!v) handleReset();
    },
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* 공통: 전체 화면 오버레이 */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 4vw, 40px)',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                padding: '0 24px',
              }}
            >
              과연 그대의 목적지는..?
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: '10px' }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile ? (
        /* ── 모바일 레이아웃 ── */
        <div style={{ padding: '24px 16px' }}>
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
                전국 135개 여행지 랜덤 추천
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

          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '12px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
            }}
          >
            <KoreaMap {...mapProps} />
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
                  <CourseCard destination={landed} destDetail={destDetail} loading={loading} isMobile />

                  {/* 여행 맛보기 — CourseCard 아래 이어서 */}
                  {!loading && destDetail?.blogs && destDetail.blogs.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <BlogPreview blogs={destDetail.blogs} />
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    style={{
                      width: '100%',
                      marginTop: '12px',
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : isTablet ? (
        /* ── 태블릿 레이아웃 — 지도 위 / ResultSet 아래 ── */
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
          {/* 헤더 */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '28px', paddingBottom: '12px' }}>🎯</span>
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
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '12px',
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
                <ResultSet landed={landed!} destDetail={destDetail} loading={loading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ── PC 레이아웃 ── */
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
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '24px' }}
            >
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

            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '16px',
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
                >
                  <ResultSet landed={landed!} destDetail={destDetail} loading={loading} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </main>
  );
}
