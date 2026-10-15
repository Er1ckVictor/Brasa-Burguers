import type { CSSProperties } from 'react';
import type { Product } from '@/data/menu';

const SEEDS: [number, number, number][] = [[40, 18, -20], [72, 10, 10], [104, 16, -8], [60, 32, 25], [92, 30, -30], [124, 28, 5]];

/** Illustrated product images drawn with CSS — swap for real photos whenever you have them. */
export default function ProductArt({ product }: { product: Product }) {
  const a = product.art ?? {};
  const vars = {
    '--bun': a.bun ?? '#E8962F',
    '--patty': a.patty ?? '#5A2C17',
    '--cheese': a.cheeseColor ?? '#FFC72C',
    '--cup': a.cup ?? '#E3262E',
  } as CSSProperties;

  switch (product.kind) {
    case 'burger':
      return (
        <div className="art art-burger" style={vars} aria-hidden="true">
          <div className="ab-top">
            {SEEDS.map(([l, t, r], i) => (
              <span key={i} className="ab-seed" style={{ left: l, top: t, transform: `rotate(${r}deg)` }} />
            ))}
          </div>
          <div className="ab-lettuce" />
          {a.bacon && <div className="ab-bacon" />}
          {a.cheese && <div className="ab-cheese" />}
          <div className="ab-patty" />
          {a.double && (<><div className="ab-cheese ab-cheese--thin" /><div className="ab-patty ab-patty--2" /></>)}
          <div className="ab-bottom" />
        </div>
      );
    case 'fries':
      return (
        <div className="art art-fries" aria-hidden="true">
          <div className="fries__sticks">
            {[[80, -12], [96, -4], [88, 6], [100, -2], [78, 12]].map(([h, r], i) => (
              <span key={i} className="fry" style={{ height: h, transform: `rotate(${r}deg)` }} />
            ))}
          </div>
          <div className="fries__box">B.</div>
        </div>
      );
    case 'rings':
      return (
        <div className="art art-rings" aria-hidden="true">
          <span className="ring" style={{ left: 6, top: 40, width: 78, height: 78, borderWidth: 18, transform: 'rotate(10deg)' }} />
          <span className="ring ring--light" style={{ left: 62, top: 8, width: 84, height: 84, borderWidth: 20 }} />
          <span className="ring" style={{ left: 96, top: 58, width: 74, height: 74, borderWidth: 17 }} />
        </div>
      );
    case 'shake':
      return (
        <div className="art art-cup" style={vars} aria-hidden="true">
          <span className="shake__cherry" />
          <span className="shake__cream" />
          <span className="shake__cream shake__cream--wide" />
          <div className="cup__body shake__body" />
        </div>
      );
    case 'drink':
    default:
      return (
        <div className="art art-cup" style={vars} aria-hidden="true">
          <span className="cup__straw" />
          <span className="cup__lid" />
          <div className="cup__body"><span className="cup__logo">B.</span></div>
        </div>
      );
  }
}
