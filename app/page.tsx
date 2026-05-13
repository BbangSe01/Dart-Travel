'use client';
import { useState, useCallback, useEffect, Suspense, useMemo } from 'react'; // useMemo 추가
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DESTINATIONS } from '@/data/destinations-client';
import type { Destination } from '@/components/panels/left/KoreaMap';
import RevealOverlay from '@/components/RevealOverlay';
import MobileLayout from '@/components/layout/MobileLayout';
import TabletLayout from '@/components/layout/TabletLayout';
import DesktopLayout from '@/components/layout/DesktopLayout';
import { type FilterState } from '@/components/panels/right/info/InfoPanel';

function HomeContent() {
  const [isThrown, setIsThrown] = useState(false);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [destDetail, setDestDetail] = useState<any>(null);
  const [revealing, setRevealing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [filter, setFilter] = useState<FilterState>({ seasons: [], themes: [] });
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  const searchParams = useSearchParams();

  const filteredDestinations = useMemo(() => {
    // 계절/테마 단일로는 OR 연산. 계절과 테마는 AND 연산
    const { seasons, themes } = filter;
    if (seasons.length === 0 && themes.length === 0) return DESTINATIONS;
    return DESTINATIONS.filter(d => {
      const seasonMatch = seasons.length === 0 || seasons.some(s => d.season.includes(s));
      const themeMatch = themes.length === 0 || themes.some(t => d.theme.includes(t));
      return seasonMatch && themeMatch;
    });
  }, [filter]);

  useEffect(() => {
    const dest = searchParams.get('dest');
    if (!dest) return;

    const found = DESTINATIONS.find(d => d.name === dest);
    if (!found) return;

    const load = async () => {
      setLanded(found);
      setIsThrown(true);
      setLoading(true);
      try {
        const res = await fetch(`/api/destination?name=${encodeURIComponent(dest)}`);
        const data = await res.json();
        if (data.error) return;
        setDestDetail(data);
      } catch {
        setDestDetail(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  const handleLand = useCallback(async (dest: Destination) => {
    const fetchPromise = fetch(`/api/destination?name=${encodeURIComponent(dest.name)}`)
      .then(res => res.json())
      .catch(() => null);

    // 다트 착지 후 진동 애니메이션 0.5초 설정
    setTimeout(() => {
      setRevealing(true);

      setTimeout(async () => {
        setRevealing(false);
        setLanded(dest);
        setLoading(true);
        try {
          const data = await fetchPromise;
          setDestDetail(data);
        } finally {
          setLoading(false);
        }
      }, 3000);
    }, 500);
  }, []);

  const handleReset = useCallback(() => {
    setIsThrown(false);
    setLanded(null);
    setLoading(false);
    setDestDetail(null);
    setRevealing(false);
    setFilter({ seasons: [], themes: [] });
    setResetKey(prev => prev + 1);
    window.history.replaceState({}, '', '/');
  }, []);

  const layoutProps = {
    landed,
    revealing,
    destDetail,
    loading,
    isThrown,
    handleLand,
    handleReset,
    setIsThrown,
    filteredDestinations,
    onFilterChange: setFilter,
    infoPanelKey: resetKey,
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <RevealOverlay revealing={revealing} />
      {isMobile ? (
        <MobileLayout {...layoutProps} />
      ) : isTablet ? (
        <TabletLayout {...layoutProps} />
      ) : (
        <DesktopLayout {...layoutProps} />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
