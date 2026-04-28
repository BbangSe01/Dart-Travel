'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DESTINATIONS } from '@/data/destinations-client';
import type { Destination } from '@/components/KoreaMap';
import RevealOverlay from '@/components/RevealOverlay';
import MobileLayout from '@/components/layout/MobileLayout';
import TabletLayout from '@/components/layout/TabletLayout';
import DesktopLayout from '@/components/layout/DesktopLayout';

function HomeContent() {
  const [isThrown, setIsThrown] = useState(false);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [destDetail, setDestDetail] = useState<any>(null);
  const [revealing, setRevealing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  const searchParams = useSearchParams();

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
    setRevealing(true);
    setTimeout(async () => {
      setRevealing(false);
      setLanded(dest);
      setLoading(true);
      try {
        const res = await fetch(`/api/destination?name=${encodeURIComponent(dest.name)}`);
        const data = await res.json();
        setDestDetail(data);
      } catch {
        setDestDetail(null);
      } finally {
        setLoading(false);
      }
    }, 3000);
  }, []);

  const handleReset = useCallback(() => {
    setIsThrown(false);
    setLanded(null);
    setLoading(false);
    setDestDetail(null);
    setRevealing(false);
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
