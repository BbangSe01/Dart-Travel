'use client';
import CourseCard from './CourseCard';
import BlogPreview from './BlogPreview';
import type { Destination } from '@/lib/destinations';

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
          width: '30px',
          flexShrink: 0,
          position: 'relative',
          background: 'linear-gradient(90deg, #d9d3c7 0%, #efece5 22%, #efece5 78%, #d9d3c7 100%)',
          boxShadow: 'inset 3px 0 6px -3px rgba(0,0,0,0.18), inset -3px 0 6px -3px rgba(0,0,0,0.18)',
        }}
      >
        {/* 고리를 관통하는 와이어 */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            bottom: '18px',
            left: '50%',
            width: '2px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.16), rgba(0,0,0,0.05))',
            borderRadius: '2px',
          }}
        />

        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            padding: '18px 0',
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '20px',
                height: '13px',
                borderRadius: '50%',
                border: '3px solid transparent',
                backgroundImage:
                  'linear-gradient(#ffffff, #ffffff), linear-gradient(155deg, #f5f3ed 0%, #d3cdc0 45%, #948e80 75%, #58544c 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 1px 2px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.8)',
              }}
            />
          ))}
        </div>
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
