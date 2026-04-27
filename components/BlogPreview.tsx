'use client';

interface Blog {
  title: string;
  link: string;
  description: string;
  bloggername: string;
}

interface Props {
  blogs: Blog[];
  noBorder?: boolean;
}

export default function BlogPreview({ blogs, noBorder = false }: Props) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: noBorder ? 'none' : '1px solid var(--border)',
        borderLeft: noBorder ? '1px solid var(--border)' : undefined,
        borderRadius: noBorder ? '0' : '16px',
        overflow: 'hidden',
        boxShadow: noBorder ? 'none' : '0 4px 24px rgba(0,0,0,0.07)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}>🗺️</span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          여행 맛보기
        </h3>
      </div>

      {/* 블로그 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {blogs.map((blog, i) => (
          <a
            key={i}
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              className="blog-item"
              style={{
                padding: '16px 24px',
                borderBottom: i < blogs.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: '0 0 6px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {blog.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--accent)',
                    background: 'rgba(232,93,38,0.08)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(232,93,38,0.2)',
                    fontWeight: 500,
                  }}
                >
                  {blog.bloggername}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>→</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 출처 */}
      <div style={{ padding: '10px 24px', flexShrink: 0 }}>
        <p
          style={{
            fontSize: '10px',
            color: 'var(--text-light)',
            margin: 0,
            fontFamily: 'var(--font-mono)',
          }}
        >
          검색 출처: 네이버 블로그
        </p>
      </div>
    </div>
  );
}
