'use client';

import { useState } from 'react';

const SEASONS = ['봄', '여름', '가을', '겨울'] as const;
const THEMES = ['바다', '산', '역사', '자연', '맛집', '액티비티', '드라이브', '힐링', '도시'] as const;

const SEASON_EMOJI: Record<string, string> = {
  봄: '🌸',
  여름: '☀️',
  가을: '🍂',
  겨울: '❄️',
};
const THEME_EMOJI: Record<string, string> = {
  바다: '🏖️',
  산: '🏔️',
  역사: '🏛️',
  자연: '🌿',
  맛집: '🍽️',
  액티비티: '🎡',
  드라이브: '🚗',
  힐링: '💆',
  도시: '🏙️',
};

export interface FilterState {
  seasons: string[];
  themes: string[];
}

interface Props {
  onFilterChange: (filter: FilterState) => void;
}

type Tab = 'howto' | 'filter';

export default function InfoPanel({ onFilterChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('howto');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'howto') {
      setSelectedSeasons([]);
      setSelectedThemes([]);
      onFilterChange({ seasons: [], themes: [] });
    }
  };

  const toggle = (value: string, list: string[], setList: (v: string[]) => void, key: 'seasons' | 'themes') => {
    const next = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    setList(next);
    onFilterChange({
      seasons: key === 'seasons' ? next : selectedSeasons,
      themes: key === 'themes' ? next : selectedThemes,
    });
  };

  const chipStyle = (selected: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: selected ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
    background: selected ? 'rgba(232,93,38,0.08)' : 'transparent',
    color: selected ? 'var(--accent)' : 'var(--text-muted)',
    transition: 'all 0.15s ease',
    userSelect: 'none' as const,
  });

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
      {/* 헤더 */}
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

      {/* 탭 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {(['howto', 'filter'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              flex: 1,
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab === 'howto' ? 'HOW TO USE' : 'FILTER'}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ padding: '24px 28px' }}>
        {activeTab === 'howto' ? (
          <>
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
          </>
        ) : (
          <>
            {/* 계절 */}
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '2px' }}>계절</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {SEASONS.map(s => (
                <button
                  key={s}
                  onClick={() => toggle(s, selectedSeasons, setSelectedSeasons, 'seasons')}
                  style={chipStyle(selectedSeasons.includes(s))}
                >
                  <span>{SEASON_EMOJI[s]}</span>
                  {s}
                </button>
              ))}
            </div>

            {/* 테마 */}
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '2px' }}>테마</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {THEMES.map(t => (
                <button
                  key={t}
                  onClick={() => toggle(t, selectedThemes, setSelectedThemes, 'themes')}
                  style={chipStyle(selectedThemes.includes(t))}
                >
                  <span>{THEME_EMOJI[t]}</span>
                  {t}
                </button>
              ))}
            </div>

            {/* 선택 현황 + 초기화 */}
            {(selectedSeasons.length > 0 || selectedThemes.length > 0) && (
              <div
                style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>조건에 맞는 여행지만 추천돼요</p>
                <button
                  onClick={() => {
                    setSelectedSeasons([]);
                    setSelectedThemes([]);
                    onFilterChange({ seasons: [], themes: [] });
                  }}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  초기화
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
