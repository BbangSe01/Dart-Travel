'use client';
import KoreaMap from '@/components/panels/left/KoreaMap';
import type { Destination } from '@/components/panels/left/KoreaMap';
import { DESTINATIONS } from '@/data/destinations-client';

interface Props {
  landed: Destination | null;
  revealing: boolean;
  isThrown: boolean;
  handleLand: (dest: Destination) => void;
  handleReset: () => void;
  setIsThrown: (v: boolean) => void;
  filteredDestinations: Destination[];
  padding?: string;
}

export default function MapPanel({
  landed,
  revealing,
  isThrown,
  handleLand,
  handleReset,
  setIsThrown,
  filteredDestinations,
  padding = '16px',
}: Props) {
  const mapProps = {
    onLand: handleLand,
    isThrown,
    setIsThrown: (v: boolean) => {
      setIsThrown(v);
      if (!v) handleReset();
    },
    filteredDestinations: filteredDestinations ?? DESTINATIONS,
  };

  return (
    <div>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding,
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        }}
      >
        <KoreaMap {...mapProps} />
      </div>
    </div>
  );
}
