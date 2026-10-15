'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PRODUCTS_BY_ID } from '@/data/menu';
import { SITE } from '@/lib/site';
import { missingFields, orderWhatsappUrl, type OrderForm, type OrderLine } from '@/lib/whatsapp';

const STORAGE_KEY = 'brasa-burger:v1';

export const EMPTY_FORM: OrderForm = {
  mode: 'entrega', payment: 'Pix', name: '', phone: '', street: '', number: '',
  district: '', complement: '', reference: '', change: '', notes: '',
};

interface CartValue {
  quantities: Record<string, number>;
  lines: OrderLine[];
  count: number;
  subtotal: number;
  fee: number;
  total: number;
  form: OrderForm;
  missing: string[];
  canSend: boolean;
  whatsappUrl: string;
  isOpen: boolean;
  bump: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  updateForm: (patch: Partial<OrderForm>) => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // restore the cart (and the customer's details) from this browser
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { quantities?: Record<string, number>; form?: Partial<OrderForm> };
        const valid = Object.fromEntries(
          Object.entries(saved.quantities ?? {}).filter(([id, q]) => PRODUCTS_BY_ID[id] && Number(q) > 0),
        );
        setQuantities(valid);
        setForm({ ...EMPTY_FORM, ...(saved.form ?? {}) });
      }
    } catch { /* storage unavailable — start empty */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ quantities, form }));
    } catch { /* ignore */ }
  }, [quantities, form, hydrated]);

  const add = useCallback((id: string) => {
    setQuantities((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 }));
    setBump((b) => b + 1);
  }, []);

  const remove = useCallback((id: string) => {
    setQuantities((q) => {
      const next = { ...q };
      next[id] = (next[id] ?? 0) - 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const updateForm = useCallback((patch: Partial<OrderForm>) => setForm((f) => ({ ...f, ...patch })), []);

  const value = useMemo<CartValue>(() => {
    const lines: OrderLine[] = Object.entries(quantities)
      .filter(([id, q]) => PRODUCTS_BY_ID[id] && q > 0)
      .map(([id, qty]) => ({ product: PRODUCTS_BY_ID[id], qty, total: PRODUCTS_BY_ID[id].price * qty }));
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    const fee = form.mode === 'entrega' && count > 0 ? SITE.deliveryFee : 0;
    const total = subtotal + fee;
    const missing = missingFields(form);
    const canSend = count > 0 && missing.length === 0;
    return {
      quantities, lines, count, subtotal, fee, total, form, missing, canSend,
      whatsappUrl: orderWhatsappUrl(lines, form, { subtotal, fee, total }),
      isOpen, bump, add, remove, clear, open, close, updateForm,
    };
  }, [quantities, form, isOpen, bump, add, remove, clear, open, close, updateForm]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}
