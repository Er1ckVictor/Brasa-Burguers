'use client';

import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { CATEGORIES, MENU, type Category, type Product } from '@/data/menu';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import ProductArt from './ProductArt';
import { PlusIcon } from './Icons';

/** lower-case, no accents: "Pão" -> "pao" */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

/** Pre-built search text for each product (name, description, line, size, badge, category). */
const INDEX = new Map(
  MENU.map((p) => [p.id, norm([p.name, p.description, p.line, p.size, p.badge ?? '', CATEGORY_LABEL[p.category] ?? ''].join(' '))]),
);

/** Every word typed must appear somewhere ("bacon chedar" won't match, "bacon picante" will). */
function matches(p: Product, query: string) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = INDEX.get(p.id) ?? '';
  return words.every((w) => text.includes(w));
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { quantities, add, remove } = useCart();
  const qty = quantities[product.id] ?? 0;
  const [reais, cents] = money(product.price).replace('R$', '').trim().split(',');

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 8) * 0.07}s` }}>
      <div className="card__media">
        <div className="card__disc" />
        {product.badge && <span className="card__badge">{product.badge}</span>}
        <ProductArt product={product} />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="card__line">{product.line}</span>
          <span className="card__size">{product.size}</span>
        </div>
        <h3 className="card__name">{product.name}</h3>
        <p className="card__desc">{product.description}</p>
        <div className="card__foot">
          <div className="price"><small>R$</small>{reais},{cents}</div>
          {qty === 0 ? (
            <button type="button" className="btn btn--red card__add" onClick={() => add(product.id)}
              aria-label={`Adicionar ${product.name} ao carrinho`}>
              <PlusIcon /> <span className="card__add-label">Adicionar</span>
            </button>
          ) : (
            <div className="stepper" role="group" aria-label={`Quantidade de ${product.name}`}>
              <button type="button" className="stepper__btn" onClick={() => remove(product.id)} aria-label="Diminuir">−</button>
              <span className="stepper__qty" aria-live="polite">{qty}</span>
              <button type="button" className="stepper__btn stepper__btn--plus" onClick={() => add(product.id)} aria-label="Aumentar">+</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const [cat, setCat] = useState<'todos' | Category>('todos');
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const found = useMemo(() => MENU.filter((p) => matches(p, deferred)), [deferred]);
  const items = found.filter((p) => cat === 'todos' || p.category === cat);
  const elsewhere = found.length - items.length; // matches hidden by the selected category
  const searching = deferred.trim().length > 0;

  function clear() {
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <section id="cardapio" className="container menu">
      <div className="menu__head">
        <div>
          <div className="eyebrow">Nosso cardápio</div>
          <h2 className="section-title">ESCOLHA O SEU <span className="accent">FAVORITO</span></h2>
        </div>
        <p className="menu__intro">
          Todos os burgers vão no pão brioche com blend de 160 g. Monte seu pedido e finalize pelo WhatsApp — retirada ou
          entrega.
        </p>
      </div>

      <div className="menu__tools">
        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); inputRef.current?.blur(); }}>
          <label htmlFor="menu-search" className="sr-only">Buscar no cardápio</label>
          <span className="search__icon"><SearchIcon /></span>
          <input
            ref={inputRef}
            id="menu-search"
            className="search__input"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscar no cardápio…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape' && query) { e.preventDefault(); clear(); } }}
          />
          {query && (
            <button type="button" className="search__clear" onClick={clear} aria-label="Limpar busca">×</button>
          )}
        </form>

        <div className="chips" role="group" aria-label="Categorias do cardápio">
          {CATEGORIES.map((c) => {
            const count = c.id === 'todos' ? found.length : found.filter((p) => p.category === c.id).length;
            return (
              <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}
                disabled={searching && count === 0 && cat !== c.id}>
                {c.label}{searching && <span className="chip__count">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <p className="menu__status" role="status" aria-live="polite">
        {searching
          ? items.length
            ? `${items.length} ${items.length === 1 ? 'item encontrado' : 'itens encontrados'} para “${deferred.trim()}”`
            : ''
          : ''}
      </p>

      {items.length > 0 ? (
        <div className="grid">
          {items.map((p, i) => (
            <ProductCard key={`${cat}-${p.id}`} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="menu__empty">
          <div className="menu__empty-title">Nada encontrado{searching ? ` para “${deferred.trim()}”` : ''}</div>
          {elsewhere > 0 ? (
            <>
              <p>Tem {elsewhere} {elsewhere === 1 ? 'resultado' : 'resultados'} em outras categorias.</p>
              <button type="button" className="btn btn--ghost" onClick={() => setCat('todos')}>Ver em todas as categorias</button>
            </>
          ) : (
            <>
              <p>Tente outro nome ou ingrediente, como “bacon”, “frango” ou “batata”.</p>
              <button type="button" className="btn btn--ghost" onClick={clear}>Limpar busca</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
