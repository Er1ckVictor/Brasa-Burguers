'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CartIcon, LogoMark } from './Icons';
import { StatusPill } from './OpeningHours';

const LINKS = [
  { href: '#cardapio', label: 'Cardápio', hint: 'Burgers, porções e bebidas' },
  { href: '#sobre', label: 'A casa', hint: 'Como a gente faz' },
  { href: '#contato', label: 'Contato', hint: 'Horários, endereço e WhatsApp' },
];

/**
 * Fixed header (not sticky): sticky inside <main>, right after the tall pinned intro,
 * is unreliable on mobile browsers and the bar ended up scrolled off the top of the screen.
 * It stays hidden during the intro and slides in once the intro is leaving the viewport.
 * A spacer in the normal flow keeps the hero from sliding under it.
 * On small screens the text links move into a drop-down opened by the burger button.
 */
export default function Header() {
  const { count, open } = useCart();
  const ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [height, setHeight] = useState(64);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    const bar = header.querySelector<HTMLElement>('.header__inner');
    /* height of the bar only (incl. notch padding), never the open drop-down */
    const measure = () => {
      const barH = bar ? bar.getBoundingClientRect().bottom - header.getBoundingClientRect().top : header.offsetHeight;
      setHeight(barH);
      document.documentElement.style.setProperty('--header-h', `${barH}px`);
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && bar) {
      ro = new ResizeObserver(measure);
      ro.observe(bar);
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const intro = document.querySelector<HTMLElement>('.intro');
      const show = !intro || intro.getBoundingClientRect().bottom <= window.innerHeight * 0.5;
      setVisible(show);
      if (!show) setMenuOpen(false);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick, { passive: true });

    return () => {
      ro?.disconnect();
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* close the drop-down on Escape, on a tap outside it, or when the screen grows to desktop */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const mq = window.matchMedia('(min-width: 641px)');
    const onMq = () => { if (mq.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    mq.addEventListener?.('change', onMq);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      mq.removeEventListener?.('change', onMq);
    };
  }, [menuOpen]);

  const tab = visible ? undefined : -1;
  const close = () => setMenuOpen(false);

  return (
    <>
      <div className="header-spacer" style={{ height }} aria-hidden="true" />
      <header ref={ref} className={`header${visible ? ' header--visible' : ''}${menuOpen ? ' header--menu' : ''}`}
        aria-hidden={!visible}>
        <div className="container header__inner">
          <a href="#inicio" className="logo" tabIndex={tab} onClick={close}>
            <LogoMark />
            <span className="logo__text">BRASA<span>.</span></span>
          </a>
          <nav className="nav" aria-label="Principal">
            <a className="nav__link nav__status" href="#contato" aria-label="Ver horários de funcionamento"
              tabIndex={tab} onClick={close}><StatusPill compact /></a>
            {LINKS.map((l) => (
              <a key={l.href} className="nav__link nav__link--text" href={l.href} tabIndex={tab}>{l.label}</a>
            ))}
            <button type="button" className="btn btn--red nav__cart" onClick={() => { close(); open(); }} tabIndex={tab}
              aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}>
              <CartIcon size={18} /> <span className="nav__cart-label">Carrinho</span> <span className="count-badge">{count}</span>
            </button>
            <button ref={toggleRef} type="button" className="nav__toggle" tabIndex={tab}
              aria-expanded={menuOpen} aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((v) => !v)}>
              <span className="nav__toggle-bar nav__toggle-bar--top" />
              <span className="nav__toggle-bar nav__toggle-bar--mid" />
              <span className="nav__toggle-bar nav__toggle-bar--bot" />
            </button>
          </nav>
        </div>

        <div id="mobile-nav" className="mnav" aria-hidden={!menuOpen}>
          <ul className="container mnav__list">
            {LINKS.map((l, i) => (
              <li key={l.href} style={{ transitionDelay: menuOpen ? `${0.06 + i * 0.05}s` : '0s' }}>
                <a className="mnav__link" href={l.href} onClick={close} tabIndex={menuOpen && visible ? undefined : -1}>
                  <span className="mnav__num">0{i + 1}</span>
                  <span className="mnav__text">
                    <span className="mnav__label">{l.label}</span>
                    <span className="mnav__hint">{l.hint}</span>
                  </span>
                  <span className="mnav__arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
            <li style={{ transitionDelay: menuOpen ? '.22s' : '0s' }}>
              <a className="btn btn--lg btn--red mnav__cta" href="#cardapio" onClick={close}
                tabIndex={menuOpen && visible ? undefined : -1}>
                <CartIcon /> Fazer pedido
              </a>
            </li>
          </ul>
        </div>
      </header>
      <div className={`mnav-backdrop${menuOpen ? ' mnav-backdrop--on' : ''}`} aria-hidden="true" />
    </>
  );
}
