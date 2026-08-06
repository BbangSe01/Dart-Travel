import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dart-travel-home-region';

export function useHomeRegion() {
  const [homeRegion, setHomeRegionState] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHomeRegionState(saved);
  }, []);

  const setHomeRegion = (code: string) => {
    setHomeRegionState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  return [homeRegion, setHomeRegion] as const;
}
