import { useId } from 'react';

const SEEDS: [number, number, number][] = [
  [70, 34, -20], [122, 20, 10], [174, 28, -8], [224, 24, 25], [96, 62, 15],
  [152, 56, -30], [208, 64, 5], [258, 50, -12], [46, 66, 40], [128, 86, -6], [190, 92, 18],
];

export function BunTop() {
  return (
    <div className="bun-top">
      <span className="bun-top__shine" />
      {SEEDS.map(([l, t, r], i) => (
        <span key={i} className="seed" style={{ left: l, top: t, transform: `rotate(${r}deg)` }} />
      ))}
    </div>
  );
}

export function Lettuce() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="lettuce" width="362" height="36" viewBox="0 0 362 36" aria-hidden="true">
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BE36A" />
          <stop offset=".5" stopColor="#5DBB3F" />
          <stop offset="1" stopColor="#2F7D22" />
        </linearGradient>
      </defs>
      <path
        d="M0 8 Q 18 0 36 8 T 72 8 T 108 8 T 144 8 T 180 8 T 216 8 T 252 8 T 288 8 T 324 8 T 362 8 L 362 16 Q 344 36 326 22 T 290 26 T 254 22 T 218 28 T 182 22 T 146 28 T 110 22 T 74 28 T 38 22 T 0 26 Z"
        fill={`url(#lg-${id})`}
      />
      <path d="M20 14 Q 90 10 180 15 T 342 13" stroke="#C6F59E" strokeWidth="1.6" fill="none" opacity=".7" />
    </svg>
  );
}

export function Tomatoes() {
  return (
    <div className="tomatoes">
      <span className="tomato" />
      <span className="tomato" />
    </div>
  );
}

export function Cheese() {
  return (
    <div className="cheese-wrap">
      <div className="cheese" />
    </div>
  );
}

export function Patty() {
  return <div className="patty" />;
}

export function BunBottom() {
  return <div className="bun-bottom" />;
}
