'use client';

import { useCart } from '@/context/CartContext';
import { CartIcon, LogoMark } from './Icons';
import { StatusPill } from './OpeningHours';

export default function Header() {
  const { count, open } = useCart();
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#inicio" className="logo">
          <LogoMark />
          <span className="logo__text">BRASA<span>.</span></span>
        </a>
        <nav className="nav" aria-label="Principal">
          <a className="nav__link nav__status" href="#contato" aria-label="Ver horários de funcionamento"><StatusPill compact /></a>
          <a className="nav__link nav__link--text" href="#cardapio">Cardápio</a>
          <a className="nav__link nav__link--text" href="#sobre">A casa</a>
          <a className="nav__link nav__link--text" href="#contato">Contato</a>
          <button type="button" className="btn btn--red nav__cart" onClick={open}
            aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}>
            <CartIcon size={18} /> <span className="nav__cart-label">Carrinho</span> <span className="count-badge">{count}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
