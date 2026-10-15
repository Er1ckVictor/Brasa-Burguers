import { money } from './format';
import { SITE, whatsappLink } from './site';
import type { Product } from '@/data/menu';

export type DeliveryMode = 'entrega' | 'retirada';
export type PaymentMethod = 'Pix' | 'Cartão' | 'Dinheiro';

export interface OrderForm {
  mode: DeliveryMode;
  payment: PaymentMethod;
  name: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  complement: string;
  reference: string;
  change: string;
  notes: string;
}

export interface OrderLine {
  product: Product;
  qty: number;
  total: number;
}

export interface OrderTotals {
  subtotal: number;
  fee: number;
  total: number;
}

/** Campos obrigatórios que ainda estão vazios. */
export function missingFields(form: OrderForm): string[] {
  const missing: string[] = [];
  if (!form.name.trim()) missing.push('nome');
  if (form.mode === 'entrega') {
    if (!form.street.trim()) missing.push('rua');
    if (!form.number.trim()) missing.push('número');
    if (!form.district.trim()) missing.push('bairro');
  }
  return missing;
}

/** Monta a mensagem organizada que vai para o WhatsApp (negrito com *asteriscos*). */
export function buildOrderMessage(lines: OrderLine[], form: OrderForm, totals: OrderTotals): string {
  const t = (s: string) => s.trim();
  const out: string[] = [];

  out.push(`*NOVO PEDIDO — ${SITE.name.toUpperCase()}*`, '');
  out.push('*Itens*');
  lines.forEach((l) => out.push(`${l.qty}x ${l.product.name} — ${money(l.total)}`));
  out.push('');
  out.push(`Subtotal: ${money(totals.subtotal)}`);
  if (form.mode === 'entrega') out.push(`Taxa de entrega: ${totals.fee > 0 ? money(totals.fee) : 'Grátis'}`);
  out.push(`*Total: ${money(totals.total)}*`, '');

  out.push('*Cliente*');
  out.push(`Nome: ${t(form.name)}`);
  if (t(form.phone)) out.push(`Telefone: ${t(form.phone)}`);
  out.push('');

  if (form.mode === 'entrega') {
    out.push('*Entrega*');
    out.push(`${t(form.street)}, ${t(form.number)} — ${t(form.district)}`);
    if (t(form.complement)) out.push(`Complemento: ${t(form.complement)}`);
    if (t(form.reference)) out.push(`Referência: ${t(form.reference)}`);
  } else {
    out.push('*Retirada no balcão*');
  }
  out.push('');

  out.push('*Pagamento*');
  out.push(form.payment);
  if (form.payment === 'Dinheiro' && t(form.change)) out.push(`Troco para: R$ ${t(form.change)}`);

  if (t(form.notes)) {
    out.push('', '*Observações*', t(form.notes));
  }
  return out.join('\n');
}

export const orderWhatsappUrl = (lines: OrderLine[], form: OrderForm, totals: OrderTotals) =>
  whatsappLink(buildOrderMessage(lines, form, totals));
