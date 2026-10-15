'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import { SITE } from '@/lib/site';
import type { DeliveryMode, PaymentMethod } from '@/lib/whatsapp';
import { CartIcon, ChatIcon, CloseIcon } from '../Icons';
import { useStoreStatus } from '@/hooks/useStoreStatus';

const MODES: { id: DeliveryMode; label: string }[] = [
  { id: 'entrega', label: 'Entrega' },
  { id: 'retirada', label: 'Retirada' },
];
const PAYMENTS: PaymentMethod[] = ['Pix', 'Cartão', 'Dinheiro'];

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close, lines, count, form, updateForm } = cart;
  const [touched, setTouched] = useState(false);
  const status = useStoreStatus();
  const closeRef = useRef<HTMLButtonElement>(null);

  // lock page scroll, focus the dialog and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  useEffect(() => { if (!isOpen) setTouched(false); }, [isOpen]);

  if (!isOpen) return null;

  const isDelivery = form.mode === 'entrega';
  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateForm({ [key]: e.target.value }),
  });

  return (
    <div className="drawer-root">
      <button type="button" className="drawer-backdrop" onClick={close} aria-label="Fechar carrinho" tabIndex={-1} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer__head">
          <div>
            <h2 id="cart-title" className="drawer__title">SEU <span>PEDIDO</span></h2>
            <div className="drawer__count">{count === 1 ? '1 item' : `${count} itens`}</div>
          </div>
          <button ref={closeRef} type="button" className="icon-btn" onClick={close} aria-label="Fechar carrinho">
            <CloseIcon />
          </button>
        </div>

        <div className="drawer__body">
          {count === 0 ? (
            <div className="empty">
              <div className="empty__icon" style={{ color: 'var(--yellow)' }}><CartIcon size={40} /></div>
              <div className="empty__title">Carrinho vazio</div>
              <p>Escolha seus favoritos no cardápio e eles aparecem aqui.</p>
              <a className="btn btn--ghost" href="#cardapio" onClick={close}>Ver cardápio</a>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {lines.map(({ product, qty, total }) => (
                  <div key={product.id} className="cart-item">
                    <div className="cart-item__info">
                      <div className="cart-item__line">{product.line}</div>
                      <div className="cart-item__name">{product.name}</div>
                      <div className="cart-item__unit">{money(product.price)} cada</div>
                    </div>
                    <div className="cart-item__side">
                      <div className="cart-item__total">{money(total)}</div>
                      <div className="stepper stepper--sm" role="group" aria-label={`Quantidade de ${product.name}`}>
                        <button type="button" className="stepper__btn" onClick={() => cart.remove(product.id)}
                          aria-label={`Remover um ${product.name}`}>−</button>
                        <span className="stepper__qty" style={{ fontSize: 16 }}>{qty}</span>
                        <button type="button" className="stepper__btn stepper__btn--plus" onClick={() => cart.add(product.id)}
                          aria-label={`Adicionar mais um ${product.name}`}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="link-btn" onClick={cart.clear}>Esvaziar carrinho</button>
              </div>

              <fieldset className="fieldset">
                <legend>Como quer receber?</legend>
                <div className="options options--2">
                  {MODES.map((m) => (
                    <button key={m.id} type="button" className="option" aria-pressed={form.mode === m.id}
                      onClick={() => updateForm({ mode: m.id })}>{m.label}</button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend>Seus dados</legend>
                <label className="label">Nome *
                  <input className="field" type="text" autoComplete="name" placeholder="Como devemos te chamar?" {...field('name')} />
                </label>
                <label className="label">Telefone
                  <input className="field" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" {...field('phone')} />
                </label>
              </fieldset>

              {isDelivery ? (
                <fieldset className="fieldset">
                  <legend>Endereço de entrega</legend>
                  <div className="row-2">
                    <label className="label">Rua *
                      <input className="field" type="text" autoComplete="address-line1" placeholder="Nome da rua" {...field('street')} />
                    </label>
                    <label className="label">Nº *
                      <input className="field" type="text" inputMode="numeric" placeholder="123" {...field('number')} />
                    </label>
                  </div>
                  <label className="label">Bairro *
                    <input className="field" type="text" placeholder="Seu bairro" {...field('district')} />
                  </label>
                  <label className="label">Complemento
                    <input className="field" type="text" autoComplete="address-line2" placeholder="Apto, bloco, casa…" {...field('complement')} />
                  </label>
                  <label className="label">Ponto de referência
                    <input className="field" type="text" placeholder="Perto de…" {...field('reference')} />
                  </label>
                </fieldset>
              ) : (
                <div className="pickup-note">
                  Retire no balcão: <strong>{SITE.pickupAddress}</strong>. Avisamos pelo WhatsApp quando estiver pronto.
                </div>
              )}

              <fieldset className="fieldset">
                <legend>Pagamento</legend>
                <div className="options options--3">
                  {PAYMENTS.map((p) => (
                    <button key={p} type="button" className="option" aria-pressed={form.payment === p}
                      onClick={() => updateForm({ payment: p })}>{p}</button>
                  ))}
                </div>
                {form.payment === 'Dinheiro' && (
                  <label className="label">Troco para quanto?
                    <input className="field" type="text" inputMode="decimal" placeholder="Ex.: 100,00 (vazio se não precisar)" {...field('change')} />
                  </label>
                )}
              </fieldset>

              <label className="label">Observações
                <textarea className="field" rows={3} placeholder="Ex.: sem cebola, ponto da carne, molho à parte…" {...field('notes')} />
              </label>
            </>
          )}
        </div>

        {count > 0 && (
          <div className="drawer__foot">
            <div className="sum-row"><span>Subtotal</span><span>{money(cart.subtotal)}</span></div>
            {isDelivery && (
              <div className="sum-row"><span>Taxa de entrega</span><span>{cart.fee > 0 ? money(cart.fee) : 'Grátis'}</span></div>
            )}
            <div className="sum-total"><span>Total</span><strong>{money(cart.total)}</strong></div>
            {status && !status.isOpen && (
              <div className="closed-note" role="status">
                <strong>{status.label}.</strong> Você pode enviar o pedido agora — ele será atendido assim que abrirmos.
              </div>
            )}
            {touched && !cart.canSend && cart.missing.length > 0 && (
              <div className="alert" role="alert">Preencha: {cart.missing.join(', ')}</div>
            )}
            {cart.canSend ? (
              <a className="btn btn--lg btn--wa" href={cart.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <ChatIcon size={22} /> Finalizar pedido no WhatsApp
              </a>
            ) : (
              <button type="button" className="btn btn--lg btn--wa" onClick={() => setTouched(true)}>
                <ChatIcon size={22} /> Finalizar pedido no WhatsApp
              </button>
            )}
            <div className="foot-note">Você será levado ao WhatsApp com o pedido pronto — é só enviar.</div>
          </div>
        )}
      </aside>
    </div>
  );
}
