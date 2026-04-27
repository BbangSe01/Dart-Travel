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
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06), 8px 12px 24px rgba(0,0,0,0.12), 12px 16px 32px rgba(0,0,0,0.08)',
        maxHeight: '550px',
        display: 'flex',
        overflow: 'hidden', // radius 클리핑만
      }}
    >
      {/* CourseCard */}
      <div style={{ flex: '1 1 0', minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <CourseCard destination={landed} destDetail={destDetail} loading={loading} noBorder />
      </div>

      {/* 스프링 고리 */}
      <div
        style={{
          width: '28px',
          flexShrink: 0,
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

      {/* BlogPreview */}
      <div
        style={{
          flex: '0 0 calc(0.75 / 1.75 * 100%)',
          minWidth: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        {!loading && destDetail?.blogs && destDetail.blogs.length > 0 && (
          <BlogPreview blogs={destDetail.blogs} noBorder />
        )}
      </div>
    </div>
  );
}
