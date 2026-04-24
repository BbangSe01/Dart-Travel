'use client';
import { useState, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Destination } from '@/components/KoreaMap';
import RevealOverlay from '@/components/RevealOverlay';
import MobileLayout from '@/components/layout/MobileLayout';
import TabletLayout from '@/components/layout/TabletLayout';
import DesktopLayout from '@/components/layout/DesktopLayout';

export default function Home() {
  const [isThrown, setIsThrown] = useState(false);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [destDetail, setDestDetail] = useState<any>(null);
  const [revealing, setRevealing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');

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
