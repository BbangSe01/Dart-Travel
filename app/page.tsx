'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useHomeRegion } from '@/hooks/useHomeRegion';
import type { Destination } from '@/lib/destinations';
import { REGIONS } from '@/lib/regions';
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
  const [filter, setFilter] = useState<FilterState>({ seasons: [], themes: [], dayTripOnly: false });
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [homeRegion, setHomeRegion] = useHomeRegion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  const searchParams = useSearchParams();

  // ?dest= 링크로 들어와서 아직 착지 데이터를 못 받은 상태 — 이 동안은 인트로 패널을 보여주지 않음
  const isRestoringFromUrl = !!searchParams.get('dest') && !landed;

  // 지도 핀 등 필터와 무관하게 항상 필요한 전체 목록 — 마운트 시 한 번만 조회
  useEffect(() => {
    fetch('/api/destination/list')
      .then(res => res.json())
      .then(data => setAllDestinations(data))
      .catch(() => setAllDestinations([]))
      .finally(() => setDestinationsLoading(false));
  }, []);

  // 계절/테마 단일로는 OR 연산. 계절과 테마는 AND 연산 — 필터 바뀔 때마다 서버에서 다시 조회
  useEffect(() => {
    const params = new URLSearchParams();
    filter.seasons.forEach(s => params.append('season', s));
    filter.themes.forEach(t => params.append('theme', t));
    if (filter.dayTripOnly && homeRegion) {
      const region = REGIONS.find(r => r.code === homeRegion);
      if (region) {
        params.set('homeLat', String(region.lat));
        params.set('homeLng', String(region.lng));
      }
    }

    fetch(`/api/destination/list?${params.toString()}`)
      .then(res => res.json())
      .then(data => setFilteredDestinations(data))
      .catch(() => setFilteredDestinations([]));
  }, [filter, homeRegion]);

  useEffect(() => {
    const dest = searchParams.get('dest');
    if (!dest) return;

    // setState는 effect 본문에서 동기적으로 바로 호출하지 않고, 콜백 안에서 호출
    Promise.resolve()
      .then(() => {
        setIsThrown(true);
        setLoading(true);
        return fetch(`/api/destination?name=${encodeURIComponent(dest)}`);
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) return;
        setLanded(data);
        setDestDetail(data);
      })
      .catch(() => setDestDetail(null))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleLand = useCallback((dest: Destination) => {
    // 다트 착지 후 진동 애니메이션 0.5초 설정
    setTimeout(() => {
      setRevealing(true);

      setTimeout(() => {
        setRevealing(false);
        setLanded(dest);
        // dest는 이미 /api/destination/list에서 받아온 전체 필드를 담고 있어 재조회가 필요 없음
        setDestDetail(dest);
      }, 3000);
    }, 500);
  }, []);

  const handleReset = useCallback(() => {
    setIsThrown(false);
    setLanded(null);
    setLoading(false);
    setDestDetail(null);
    setRevealing(false);
    setFilter({ seasons: [], themes: [], dayTripOnly: false });
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
    allDestinations,
    destinationsLoading,
    isRestoringFromUrl,
    onFilterChange: setFilter,
    infoPanelKey: resetKey,
    homeRegion,
    onHomeRegionChange: setHomeRegion,
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
