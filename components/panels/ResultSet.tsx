'use client';
import CourseCard from '@/components/CourseCard';
import BlogPreview from '@/components/BlogPreview';
import type { Destination } from '@/components/KoreaMap';

interface Props {
  landed: Destination;
  destDetail: any;
  loading: boolean;
  isMobile?: boolean;
}

export default function ResultSet({ landed, destDetail, loading, isMobile = false }: Props) {
  if (isMobile) {
    return (
      <>
        <CourseCard destination={landed} destDetail={destDetail} loading={loading} isMobile />
        {!loading && destDetail?.blogs && destDetail.blogs.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <BlogPreview blogs={destDetail.blogs} />
          </div>
        )}
      </>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 28px minmax(0, 0.75fr)',
        alignItems: 'stretch',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden', // borderRadius 클리핑용
        boxShadow: '0 4px 12px rgba(0,0,0,0.06), 8px 12px 24px rgba(0,0,0,0.12), 12px 16px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* CourseCard — 고정 높이 */}
      <CourseCard destination={landed} destDetail={destDetail} loading={loading} noBorder />

      {/* 스프링 고리 — CourseCard 높이에 맞춤 */}
      <div
        style={{
          background: '#e8e4de',
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          alignSelf: 'stretch', // 스프링은 전체 높이
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

      {/* BlogPreview — 독립 스크롤, CourseCard 높이에 맞춘 maxHeight */}
      {!loading && destDetail?.blogs && destDetail.blogs.length > 0 ? (
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <BlogPreview blogs={destDetail.blogs} noBorder />
        </div>
      ) : (
        <div style={{ background: '#ffffff', alignSelf: 'stretch' }} />
      )}
    </div>
  );
}
