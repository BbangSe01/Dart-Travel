'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Destination } from './KoreaMap';

interface DestDetail {
  name: string;
  tag: string;
  emoji: string;
  reason: string;
  tip?: string;
  images: string[];
  blogs?: {
    title: string;
    link: string;
    description: string;
    bloggername: string;
  }[];
}

interface Props {
  destination: Destination;
  destDetail: DestDetail | null;
  loading: boolean;
  isMobile?: boolean;
  noBorder?: boolean;
}

export default function CourseCard({ destination, destDetail, loading, isMobile = false, noBorder = false }: Props) {
  const [current, setCurrent] = useState(0);
  const images = destDetail?.images ?? [];

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  return (
    <div
      style={{
        background: '#ffffff',
        border: noBorder ? 'none' : '1px solid var(--border)',
        borderRight: noBorder ? '1px solid var(--border)' : undefined,
        borderRadius: noBorder ? '0' : '16px',
        overflow: 'hidden',
        boxShadow: noBorder ? 'none' : '0 4px 24px rgba(0,0,0,0.07)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 이미지 캐러셀 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? '180px' : '220px',
          background: '#f0ede8',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #f0ede8 25%, #e8e4de 50%, #f0ede8 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          ) : images.length > 0 ? (
            <motion.img
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              src={images[current]}
              alt={destination.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <motion.div
              key="emoji"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
              }}
            >
              {destination.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 좌우 버튼 */}
        {!loading && images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              ‹
            </button>
            <button
              onClick={next}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              ›
            </button>
          </>
        )}

        {/* 인디케이터 */}
        {!loading && images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '32px', lineHeight: 1 }}>{destination.emoji}</span>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                margin: '0 0 6px',
                letterSpacing: '-0.02em',
              }}
            >
              {destination.name}
            </h2>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                color: 'var(--accent)',
                background: 'rgba(232,93,38,0.08)',
                padding: '3px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(232,93,38,0.2)',
                fontWeight: 500,
              }}
            >
              {destination.tag}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[100, 85, 70].map((w, i) => (
              <div
                key={i}
                style={{
                  height: '14px',
                  borderRadius: '4px',
                  background: '#f0ede8',
                  width: `${w}%`,
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {destDetail?.reason ?? '여행지 정보를 불러오는 중이에요.'}
            </p>

            {destDetail?.tip && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 16px',
                  background: 'rgba(232,93,38,0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(232,93,38,0.12)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: 1.6 }}>💡</span>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {destDetail.tip}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!loading && images.length > 0 && (
          <p
            style={{
              fontSize: '10px',
              color: 'var(--text-light)',
              margin: '12px 0 0',
              fontFamily: 'var(--font-mono)',
            }}
          >
            사진 출처: 한국관광공사
          </p>
        )}
      </div>
    </div>
  );
}
