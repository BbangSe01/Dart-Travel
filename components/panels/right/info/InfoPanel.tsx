'use client';

import { useState, useEffect, useRef } from 'react';
import { REGIONS } from '@/lib/regions';

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
  dayTripOnly: boolean;
}

interface Props {
  onFilterChange: (filter: FilterState) => void;
  homeRegion: string | null;
  onHomeRegionChange: (code: string) => void;
}

type Tab = 'howto' | 'filter';

export default function InfoPanel({ onFilterChange, homeRegion, onHomeRegionChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('howto');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [dayTripOnly, setDayTripOnly] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!regionOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [regionOpen]);

  const selectedRegionName = REGIONS.find(r => r.code === homeRegion)?.name;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'howto') {
      setSelectedSeasons([]);
      setSelectedThemes([]);
      setDayTripOnly(false);
      onFilterChange({ seasons: [], themes: [], dayTripOnly: false });
    }
  };

  const toggle = (value: string, list: string[], setList: (v: string[]) => void, key: 'seasons' | 'themes') => {
    const next = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    setList(next);
    onFilterChange({
      seasons: key === 'seasons' ? next : selectedSeasons,
      themes: key === 'themes' ? next : selectedThemes,
      dayTripOnly,
    });
  };

  const toggleDayTrip = () => {
    if (!homeRegion) return;
    const next = !dayTripOnly;
    setDayTripOnly(next);
    onFilterChange({ seasons: selectedSeasons, themes: selectedThemes, dayTripOnly: next });
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
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(232,93,38,0.06) 0%, rgba(232,93,38,0.02) 100%)',
          borderBottom: '1px solid rgba(232,93,38,0.12)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
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

            {/* 출발지 + 당일치기 */}
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '16px',
                marginBottom: '8px',
                marginLeft: '2px',
              }}
            >
              출발지
            </p>
            <div ref={regionRef} style={{ position: 'relative', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setRegionOpen(o => !o)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border)',
                  fontSize: '13px',
                  color: homeRegion ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{selectedRegionName ?? '지역을 선택해주세요'}</span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    transform: regionOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  ▼
                </span>
              </button>

              {regionOpen && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    maxHeight: '168px',
                    overflowY: 'auto',
                    background: '#ffffff',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.14)',
                    zIndex: 30,
                  }}
                >
                  {REGIONS.map(r => (
                    <div
                      key={r.code}
                      onClick={() => {
                        onHomeRegionChange(r.code);
                        setRegionOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: homeRegion === r.code ? 'var(--accent)' : 'var(--text-primary)',
                        background: homeRegion === r.code ? 'rgba(232,93,38,0.08)' : 'transparent',
                      }}
                    >
                      {r.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleDayTrip}
              disabled={!homeRegion}
              style={{
                ...chipStyle(dayTripOnly),
                opacity: homeRegion ? 1 : 0.45,
                cursor: homeRegion ? 'pointer' : 'not-allowed',
              }}
            >
              <span>🚗</span> 당일치기 가능한 곳만
            </button>
            {!homeRegion && (
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', marginLeft: '2px' }}>
                출발지를 선택하면 당일치기 필터를 쓸 수 있어요
              </p>
            )}

            {/* 선택 현황 + 초기화 */}
            {(selectedSeasons.length > 0 || selectedThemes.length > 0 || dayTripOnly) && (
              <div
                style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>조건에 맞는 여행지만 추천돼요</p>
                <button
                  onClick={() => {
                    setSelectedSeasons([]);
                    setSelectedThemes([]);
                    setDayTripOnly(false);
                    onFilterChange({ seasons: [], themes: [], dayTripOnly: false });
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
