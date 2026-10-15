
// Dados gerais do site
export const SITE = {
  name: 'Brasa Burger',
  description:
    'Hambúrguer artesanal na brasa: blend selado no fogo, pão brioche da casa e molhos autorais. Peça pelo WhatsApp.',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5500000000000').replace(/\D/g, ''),
  deliveryFee: Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 6) || 0,
  phone: '(00) 00000-0000',
  instagram: '@seu-instagram',
  instagramUrl: 'https://www.instagram.com/er1ck.v1ctor/',
  addressLine: 'Rua, Bairro - N°',
  cityLine: 'Cidade - UF',
  pickupAddress: 'Seu endereço, Cidade',
  // horários por dia da semana: lib/hours.ts
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
