'use client';

import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import { CartIcon } from '../Icons';

export default function CartFab() {
  const { count, total, isOpen, open, bump } = useCart();
  if (count === 0 || isOpen) return null;
  return (
    <button type="button" className="fab" onClick={open}
      aria-label={`Ver carrinho, ${count} ${count === 1 ? 'item' : 'itens'}, total ${money(total)}`}>
      {/* key forces the bump animation to replay on every add */}
      <span key={bump} className="fab__inner">
        <span className="fab__icon">
          <CartIcon size={24} />
          <span className="count-badge">{count}</span>
        </span>
        <span className="fab__text">
          <small>Ver carrinho</small>
          <strong>{money(total)}</strong>
        </span>
      </span>
    </button>
  );
}
