export default function InfoPanel() {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(232,93,38,0.06) 0%, rgba(232,93,38,0.02) 100%)',
          borderBottom: '1px solid rgba(232,93,38,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '20px' }}>🎯</span>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '20px',
              color: 'var(--accent)',
              letterSpacing: '0.12em',
              margin: 0,
              paddingTop: '4px',
              fontWeight: 700,
            }}
          >
            TRAVEL OPTIONS
          </p>
        </div>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
          지도를 클릭하면 랜덤으로 국내 여행지를 추천해드려요.
        </p>
      </div>
      <div style={{ padding: '24px 28px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            color: 'var(--text-light)',
            letterSpacing: '0.12em',
            marginBottom: '24px',
            marginLeft: '5px',
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
              gap: '12px',
              alignItems: 'center',
              marginBottom: i < 2 ? '12px' : 0,
              padding: '10px 14px',
              background: 'rgba(232,93,38,0.03)',
              borderRadius: '10px',
            }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.emoji}</span>
            <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
