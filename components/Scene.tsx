'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { BunBottom, BunTop, Cheese, Lettuce, Patty, Tomatoes } from './burger/Layers';
import { Flame } from './Flame';
import { FlameSmallIcon, CartIcon, PhoneIcon } from './Icons';

// Parallax

type El = HTMLElement | SVGElement | null;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f = (n: number) => n.toFixed(1);
const tr = (x: number, y: number) => `translate3d(${f(x)}px, ${f(y)}px, 0)`;

/** Intro ingredients: where each starts, where it lands on the stack, and when. */
const INTRO_LAYERS = [
  { key: 'bot', z: 1, o: { x: 260, y: -360, r: -18, s: 0.8, d: 50, b: 2 }, target: 92, a: 0.04, b: 0.2 },
  { key: 'pat', z: 2, o: { x: -560, y: 260, r: 22, s: 1.15, d: 90, b: 0 }, target: 40, a: 0.14, b: 0.3 },
  { key: 'ch', z: 3, o: { x: 560, y: 280, r: 26, s: 0.85, d: 70, b: 1 }, target: 14, a: 0.24, b: 0.4 },
  { key: 'tom', z: 4, o: { x: -600, y: -180, r: -40, s: 0.9, d: 40, b: 2.5 }, target: -6, a: 0.34, b: 0.5 },
  { key: 'let', z: 5, o: { x: 600, y: -280, r: 32, s: 0.8, d: 60, b: 1.5 }, target: -30, a: 0.44, b: 0.6 },
  { key: 'top', z: 6, o: { x: -220, y: -420, r: -28, s: 1.2, d: 110, b: 0 }, target: -98, a: 0.54, b: 0.72 },
] as const;

const LAYER_ART: Record<string, () => ReactNode> = {
  bot: () => <BunBottom />, pat: () => <Patty />, ch: () => <Cheese />,
  tom: () => <Tomatoes />, let: () => <Lettuce />, top: () => <BunTop />,
};

/** Hero stack: depth (translateZ) and how far each layer lifts when scrolling the hero. */
const HERO_LAYERS = [
  { key: 'top', z: 70, lift: -90 },
  { key: 'let', z: 50, lift: -58 },
  { key: 'tom', z: 32, lift: -34 },
  { key: 'ch', z: 16, lift: -14 },
  { key: 'pat', z: 0, lift: 8 },
  { key: 'bot', z: -24, lift: 34 },
] as const;

const CAPTIONS = [
  { num: '01', title: 'O pão', text: 'Brioche tostado na manteiga', at: 0.03 },
  { num: '02', title: 'A carne', text: 'Blend de 160 g selado na brasa', at: 0.14 },
  { num: '03', title: 'O queijo', text: 'Derretendo por cima, do jeito certo', at: 0.24 },
  { num: '04', title: 'O tomate', text: 'Fresco, fatiado na hora', at: 0.34 },
  { num: '05', title: 'A alface', text: 'Crocante e verdinha', at: 0.44 },
  { num: '06', title: 'Fechou.', text: 'Montado na hora, pra você', at: 0.55 },
];

const EMBERS: [number, number, number, number][] = [
  [6, 8, 0, 7], [14, 5, 2.2, 9], [22, 10, 4.1, 7], [31, 6, 1.3, 8], [40, 4, 5.5, 7], [48, 9, 3, 10],
  [57, 5, 0.6, 7], [65, 11, 4.8, 8.5], [73, 6, 2.7, 7], [81, 8, 6.2, 9.5], [89, 4, 1.8, 7], [95, 7, 3.6, 7.5],
];

export default function Scene({ header }: { header: ReactNode }) {
  const els = useRef<Record<string, El>>({});
  const reg = (k: string) => (el: El) => { els.current[k] = el; };

  useEffect(() => {
    const E = els.current;
    const css = (k: string) => (E[k] as HTMLElement | null)?.style;
    let reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* ignore */ }

    let tx = 0, ty = 0, mx = 0, my = 0, raf = 0, heroOn = false, landed: boolean | null = null;

    const frame = () => {
      raf = 0;
      mx += (tx - mx) * 0.12;
      my += (ty - my) * 0.12;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sy = Math.max(0, window.scrollY);
      const introPx = (E.intro as HTMLElement | null)?.offsetHeight ?? vh;
      const run = Math.max(1, introPx - vh);
      const p = reduced ? 0.74 : clamp(sy / run, 0, 1);
      const sm = (a: number, b: number) => { const t = clamp((p - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
      const zoom = sm(0.8, 1);
      const fit = Math.min(1, (vw - 32) / 380);

      /* ---------- intro backdrop ---------- */
      const glow = css('glow');
      if (glow) {
        glow.opacity = clamp(0.35 + sm(0.04, 0.7) * 0.6 - zoom * 0.9, 0, 1).toFixed(2);
        glow.transform = `${tr(mx * -20, my * -20)} scale(${(0.7 + p * 0.7).toFixed(2)})`;
      }
      const word = css('word');
      if (word) {
        word.transform = `${tr(mx * -30, my * -16 - p * 260)} scale(${(1 + p * 0.35).toFixed(3)})`;
        word.opacity = (1 - zoom).toFixed(2);
      }
      const embers = css('embers');
      if (embers) embers.transform = tr(mx * 24, -p * 320);
      const title = css('title');
      if (title) {
        title.transform = tr(mx * -14, my * -10 - p * 900);
        title.opacity = (1 - sm(0.02, 0.13)).toFixed(2);
      }
      const welcome = css('welcome');
      if (welcome) {
        welcome.opacity = (sm(0.74, 0.82) * (1 - sm(0.93, 1))).toFixed(2);
        welcome.transform = `scale(${lerp(0.85, 1.1, sm(0.74, 1)).toFixed(3)})`;
      }
      const hint = css('hint');
      if (hint) hint.opacity = (reduced ? 0 : 1 - sm(0, 0.06)).toFixed(2);
      const bar = css('bar');
      if (bar) bar.height = `${(p * 100).toFixed(1)}%`;

      CAPTIONS.forEach((c, i) => {
        const s = css(`cap${i}`);
        if (!s) return;
        const end = i === CAPTIONS.length - 1 ? 0.72 : c.at + 0.11;
        const o = sm(c.at, c.at + 0.04) * (1 - sm(end - 0.02, end + 0.02));
        s.opacity = o.toFixed(2);
        s.transform = `translateY(${f((1 - o) * 24)}px)`;
      });

      /* ---------- assembling ingredients ---------- */
      INTRO_LAYERS.forEach((l) => {
        const s = css(`ib-${l.key}`);
        if (!s) return;
        const t = sm(l.a, l.b);
        const { o } = l;
        const x = lerp(o.x + mx * o.d, 0, t);
        const y = lerp(o.y + my * o.d * 0.6 - p * o.d * 5, l.target, t);
        s.transform = `${tr(x, y)} rotate(${f(lerp(o.r, 0, t))}deg) scale(${lerp(o.s, 1, t).toFixed(3)})`;
        s.filter = `blur(${((1 - t) * o.b).toFixed(1)}px)`;
        s.opacity = lerp(0.85, 1, t).toFixed(2);
      });

      /* ---------- travel: intro centre -> hero stage ---------- */
      const heroEl = E.hero as HTMLElement | null;
      const anchor = E.anchor as HTMLElement | null;
      let ax = vw * 0.7, ay = vh * 1.2;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        ax = r.left + r.width / 2;
        ay = r.top + r.height / 2;
      }
      const startB = run * 0.76;
      const endB = introPx;
      const tt = reduced ? 1 : clamp((sy - startB) / (endB - startB), 0, 1);
      const te = tt * tt * (3 - 2 * tt);
      const isLanded = reduced || sy >= endB - 1;
      const arc = Math.sin(te * Math.PI);
      const cx = lerp(vw / 2, ax + mx * 22, te);
      const cy = lerp(vh / 2 + 20 * fit, ay + 20 * fit + my * 16, te);

      const group = css('group');
      if (group) {
        group.transform = `${tr(cx, cy)} scale(${(fit * (1 + arc * 0.12)).toFixed(3)})`;
      }
      const spin = css('spin');
      if (spin) {
        spin.transform = `perspective(1100px) rotateY(${f(mx * 22 * te + arc * -20)}deg) rotateX(${f(-my * 14 * te)}deg) rotate(${f(arc * -8)}deg)`;
      }
      if (landed !== isLanded) {
        landed = isLanded;
        if (group) group.visibility = isLanded ? 'hidden' : 'visible';
        const hb = css('heroBurger');
        if (hb) hb.opacity = isLanded ? '1' : '0';
      }

      /* ---------- hero parallax ---------- */
      const heroTop = heroEl ? heroEl.getBoundingClientRect().top + sy : introPx;
      const hs = Math.max(0, sy - heroTop);
      const sp = Math.min(hs, 420) / 420;
      if (!heroOn && heroEl && (reduced || sy >= introPx - 2)) {
        heroOn = true;
        heroEl.classList.remove('hero-wait');
        heroEl.classList.add('hero-go');
      }
      const set = (k: string, v: string) => { const s = css(k); if (s) s.transform = v; };
      set('hBgword', tr(mx * -24, my * -12 + hs * 0.55));
      set('hFar', tr(mx * -40, my * -28 + hs * 0.4));
      set('hDisc', tr(mx * -16, my * -12 + hs * 0.22));
      set('hRing', `${tr(mx * -28, my * -22 + hs * 0.12)} rotate(${f(hs * 0.08)}deg)`);
      set('hFlames', tr(mx * -8, my * -6 + hs * 0.05));
      set('hShadow', `${tr(mx * -18, hs * 0.05)} scale(${(1 - sp * 0.3).toFixed(2)})`);
      set('hNear', tr(mx * 60, my * 46 - hs * 0.45));
      set('hFront', tr(mx * 110, my * 80 - hs * 0.8));
      set('heroBurger',
        `${tr(mx * 22, my * 16 - hs * 0.12)} rotateY(${f(mx * 22)}deg) rotateX(${f(-my * 14 + sp * 22)}deg) scale(${fit.toFixed(3)})`);
      const text = css('hText');
      if (text) {
        text.transform = tr(mx * -10, hs * 0.32);
        text.opacity = Math.max(0, 1 - hs / 620).toFixed(2);
      }
      HERO_LAYERS.forEach((l) => set(`hb-${l.key}`, `translateZ(${l.z}px) translateY(${f(l.lift * sp)}px)`));

      if (Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001) raf = requestAnimationFrame(frame);
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };

    if (!reduced) window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick, { passive: true });
    frame();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ======================= INTRO ======================= */}
      <section ref={reg('intro')} className="intro" aria-label="Abertura">
        <div className="intro__stage">
          <div ref={reg('glow')} className="layer-abs" aria-hidden="true">
            <div className="intro__glow-disc" />
          </div>
          <div ref={reg('word')} className="layer-abs" aria-hidden="true">
            <div className="intro__word">BRASA</div>
          </div>
          <div ref={reg('embers')} className="embers" aria-hidden="true">
            {EMBERS.map(([left, size, delay, dur], i) => (
              <span key={i} className="ember"
                style={{ left: `${left}%`, width: size, height: size, animationDelay: `${delay}s`, animationDuration: `${dur}s` }} />
            ))}
          </div>

          {/* the one burger — fixed, so it can leave the stage and land on the hero */}
          <div ref={reg('group')} className="intro__group" role="img"
            aria-label="Ingredientes se juntando para formar um hambúrguer">
            <div ref={reg('spin')} className="intro__spin">
              {INTRO_LAYERS.map((l) => (
                <div key={l.key} ref={reg(`ib-${l.key}`)} className="ib-layer" style={{ zIndex: l.z }}>
                  <div className="ib-inner">{LAYER_ART[l.key]()}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={reg('title')} className="layer-abs intro__title">
            <div className="intro__kicker">Hambúrguer artesanal na brasa</div>
            <div className="intro__brand">BRASA<span>.</span></div>
            <div className="intro__sub">BURGER</div>
          </div>

          <div className="intro__caps" aria-live="polite">
            <div className="intro__caps-box">
              {CAPTIONS.map((c, i) => (
                <div key={c.num} ref={reg(`cap${i}`)} className="cap">
                  <div className="cap__num">{c.num}</div>
                  <div className="cap__title">{c.title}</div>
                  <div className="cap__text">{c.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={reg('welcome')} className="layer-abs intro__welcome">
            <div className="intro__welcome-text">BEM-VINDO À <span>BRASA</span></div>
          </div>

          <div ref={reg('hint')} className="intro__hint">
            <div className="intro__mouse"><span /></div>
            <div className="intro__hint-label">Role para montar</div>
          </div>

          <div className="intro__rail" aria-hidden="true"><div ref={reg('bar')} className="intro__bar" /></div>
          <a className="btn intro__skip" href="#inicio">Pular intro</a>
          <div className="intro__logo">BRASA<span>.</span></div>
        </div>
      </section>

      {header}

      {/* ======================= HERO ======================= */}
      <section id="inicio" ref={reg('hero')} className="hero hero-wait">
        <div ref={reg('hBgword')} className="hero__far" aria-hidden="true">
          <div className="hero__bgword">BURGER</div>
        </div>
        <div ref={reg('hFar')} className="hero__far" aria-hidden="true">
          <span className="seed" style={{ left: '6%', top: 120, transform: 'rotate(30deg)', filter: 'blur(2px)', opacity: 0.5 }} />
          <span className="seed" style={{ left: '44%', top: 70, transform: 'rotate(-20deg)', filter: 'blur(2px)', opacity: 0.45 }} />
          <span className="seed" style={{ left: '52%', top: 520, transform: 'rotate(60deg)', filter: 'blur(2px)', opacity: 0.4 }} />
          <span className="seed" style={{ left: '92%', top: 300, transform: 'rotate(10deg)', filter: 'blur(2px)', opacity: 0.5 }} />
        </div>

        <div className="container hero__inner">
          <div ref={reg('hText')} className="hero__text">
            <div className="hero__tag rise"><FlameSmallIcon /> Hambúrguer artesanal na brasa</div>
            <h1 className="hero__title">
              {'BRASA'.split('').map((ch, i) => (
                <span key={i} className="letter" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>{ch}</span>
              ))}
              <span className="letter hero__dot" style={{ animationDelay: '.5s' }}>.</span>
              <span className="hero__title-2">
                {'BURGER'.split('').map((ch, i) => (
                  <span key={i} className="letter" style={{ animationDelay: `${0.6 + i * 0.06}s` }}>{ch}</span>
                ))}
              </span>
            </h1>
            <p className="hero__lead rise" style={{ animationDelay: '.3s' }}>
              Blend bovino selado no fogo, pão brioche tostado na manteiga e molhos da casa. Hambúrguer de verdade,
              montado na hora — do jeito que tem que ser.
            </p>
            <div className="hero__ctas rise" style={{ animationDelay: '.45s' }}>
              <a className="btn btn--lg btn--red pulse" href="#cardapio"><CartIcon /> Fazer pedido</a>
              <a className="btn btn--lg btn--ghost" href="#cardapio">Ver cardápio</a>
              <a className="btn btn--lg btn--muted" href="#contato"><PhoneIcon /> Contato</a>
            </div>
            <div className="hero__facts rise" style={{ animationDelay: '.6s' }}>
              <div><span className="dot" />Pão brioche da casa</div>
              <div><span className="dot dot--red" />Blend 160 g na brasa</div>
              <div><span className="dot" />Molhos autorais</div>
            </div>
          </div>

          <div ref={reg('anchor')} className="hero__stage">
            <div ref={reg('hDisc')} className="layer-abs" aria-hidden="true">
              <div className="hero__disc-wrap">
                <div className="hero__halo glow" />
                <div className="hero__disc" />
              </div>
            </div>
            <div ref={reg('hRing')} className="layer-abs" aria-hidden="true">
              <div className="hero__ring-wrap">
                <div className="hero__ring" />
                <svg className="hero__seal spin" width="520" height="520" viewBox="0 0 520 520">
                  <defs><path id="seal-ring" d="M260 260 m-228 0 a228 228 0 1 1 456 0 a228 228 0 1 1 -456 0" /></defs>
                  <text fontFamily="Anton, sans-serif" fontSize="22" letterSpacing="6" fill="#FFC72C">
                    <textPath href="#seal-ring">FEITO NA BRASA • MONTADO NA HORA • SABOR DE VERDADE • FEITO NA BRASA • MONTADO NA HORA •</textPath>
                  </text>
                </svg>
              </div>
            </div>
            <div ref={reg('hFlames')} className="layer-abs" aria-hidden="true">
              <div className="hero__flames">
                <Flame style={{ left: 30, bottom: 90 }} />
                <Flame className="flame--2" width={90} height={130} style={{ right: 40, bottom: 100 }} />
              </div>
            </div>
            <div ref={reg('hShadow')} className="layer-abs" aria-hidden="true">
              <div className="hero__shadow" />
            </div>

            <div ref={reg('heroBurger')} className="hero-burger" role="img"
              aria-label="Hambúrguer artesanal com pão brioche, alface, tomate, queijo e carne">
              <div className="hero-burger__float floaty">
                {HERO_LAYERS.map((l) => (
                  <div key={l.key} ref={reg(`hb-${l.key}`)} className={`hb-layer hb-layer--${l.key}`}>
                    {LAYER_ART[l.key]()}
                  </div>
                ))}
              </div>
            </div>

            <div ref={reg('hNear')} className="layer-abs" style={{ zIndex: 4 }} aria-hidden="true">
              <div className="hero__near">
                <div className="pop" style={{ position: 'absolute', top: 40, right: 30, animationDelay: '.4s' }}>
                  <div className="ing-tomato tumble" />
                </div>
                <div className="pop" style={{ position: 'absolute', top: 120, left: 10, animationDelay: '.55s' }}>
                  <div className="tumble2"><div className="ing-cheese" /></div>
                </div>
                <div className="pop" style={{ position: 'absolute', bottom: 60, right: 10, animationDelay: '.7s' }}>
                  <div className="ing-badge floaty2">100%<small>ARTESANAL</small></div>
                </div>
              </div>
            </div>
            <div ref={reg('hFront')} className="layer-abs" style={{ zIndex: 5 }} aria-hidden="true">
              <div className="hero__front">
                <span className="seed" style={{ left: 40, top: 470, width: 34, height: 18, filter: 'blur(3px)', transform: 'rotate(30deg)' }} />
                <span className="seed" style={{ left: 520, top: 160, width: 28, height: 15, filter: 'blur(3px)', transform: 'rotate(-25deg)' }} />
                <span style={{ position: 'absolute', left: 480, top: 470, width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFE27A, #F0A812)', filter: 'blur(6px)', opacity: 0.7 }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
