import type { CSSProperties } from 'react';

export default function DartboardIcon({
  size = 32,
  style,
  className,
}: {
  size?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ flexShrink: 0, ...style }}
      className={className}
    >
      <defs>
        <linearGradient id="dartboard-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#e85d26" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#dartboard-bg)" />
      <circle cx="16" cy="16" r="13" fill="#fdf6ee" />
      <circle cx="16" cy="16" r="9.5" fill="#181818" />
      <circle cx="16" cy="16" r="6" fill="#fdf6ee" />
      <circle cx="16" cy="16" r="2.5" fill="#ef4444" />
    </svg>
  );
}
