import type { CSSProperties } from 'react';

export function Flame({ className = '', style, width = 120, height = 170 }: {
  className?: string; style?: CSSProperties; width?: number; height?: number;
}) {
  return (
    <svg className={`flame ${className}`} width={width} height={height} viewBox="0 0 120 170" aria-hidden="true"
      style={{ position: 'absolute', filter: 'drop-shadow(0 0 18px rgba(255,170,0,.6))', ...style }}>
      <defs>
        <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF8A00" />
          <stop offset="1" stopColor="#FFE066" />
        </linearGradient>
      </defs>
      <path d="M60 0 C80 40 120 60 112 112 A52 52 0 0 1 8 112 C2 80 30 64 36 34 C46 60 56 56 60 0 Z" fill="url(#flame-grad)" />
      <path d="M60 60 C70 84 92 96 86 124 A26 26 0 0 1 34 124 C32 106 48 96 50 80 C55 92 58 90 60 60 Z" fill="#E3262E" />
    </svg>
  );
}
