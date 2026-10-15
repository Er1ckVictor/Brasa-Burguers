import { SITE, whatsappLink } from '@/lib/site';
import { ChatIcon, InstagramIcon } from './Icons';
import OpeningHours from './OpeningHours';

const WORDS = ['SMASH', 'CHEDDAR', 'BACON CROCANTE', 'PÃO BRIOCHE', 'NA BRASA', 'MOLHO DA CASA'];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((w, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span>{w}</span><span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="sobre" className="container features">
      <h2 className="sr-only">A casa</h2>
      <div className="features__grid">
        <div className="card feature feature--red">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 3-7 1 2 2 2 3-3z" /></svg>
          <h3>Selado no fogo</h3>
          <p>Carne grelhada na chapa bem quente para crosta caramelizada e suculência por dentro.</p>
        </div>
        <div className="card feature feature--yellow">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B3171E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 13a9 6 0 0 1 18 0z" /><path d="M3 17h18" /><path d="M4 20h16" /></svg>
          <h3>Pão da casa</h3>
          <p>Brioche macio, tostado na manteiga na hora de montar o seu lanche.</p>
        </div>
        <div className="card feature feature--dark">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <h3>Montado na hora</h3>
          <p>Nada fica esperando. Seu pedido começa quando você pede.</p>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contato" className="contact">
      <div className="container contact__inner">
        <div className="contact__text">
          <div className="eyebrow">Fome bateu?</div>
          <h2 className="section-title">FALE COM A <span className="accent">BRASA</span></h2>
          <p className="contact__lead">Faça seu pedido pelo WhatsApp ou venha nos visitar. Atendemos retirada e delivery.</p>
          <div className="contact__ctas">
            <a className="btn btn--lg btn--red" href={whatsappLink('Olá! Vim pelo site da Brasa Burger.')} target="_blank" rel="noopener noreferrer">
              <ChatIcon /> WhatsApp
            </a>
            <a className="btn btn--lg btn--ghost" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon /> Instagram
            </a>
          </div>
        </div>
        <div className="contact__cards">
          <div className="info"><div className="info__label">Telefone</div><div className="info__value">{SITE.phone}</div></div>
          <div className="info"><div className="info__label">Instagram</div><div className="info__value">{SITE.instagram}</div></div>
          <div className="info">
            <div className="info__label">Endereço</div>
            <div className="info__value">{SITE.addressLine}<br />{SITE.cityLine}</div>
          </div>
          <OpeningHours />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="logo__text" style={{ color: '#fff' }}>BRASA<span>.</span> BURGER</span>
        <span>© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}
