export type Category = 'burgers' | 'combos' | 'acomp' | 'bebidas';
export type ArtKind = 'burger' | 'fries' | 'rings' | 'drink' | 'shake';

export interface BurgerArt {
  bun?: string;
  patty?: string;
  cheese?: boolean;
  cheeseColor?: string;
  bacon?: boolean;
  double?: boolean;
  cup?: string;
}

export interface Product {
  id: string;
  category: Category;
  kind: ArtKind;
  name: string;
  line: string;
  size: string;
  price: number;
  description: string;
  badge?: string;
  art?: BurgerArt;
}

export const CATEGORIES: { id: 'todos' | Category; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'combos', label: 'Combos' },
  { id: 'acomp', label: 'Acompanhamentos' },
  { id: 'bebidas', label: 'Bebidas' },
];

/** Cardápio — os preços são exemplos; edite à vontade. */
export const MENU: Product[] = [
  {
    id: 'brasa-classico', category: 'burgers', kind: 'burger', name: 'Brasa Clássico', line: 'Linha Assinatura',
    size: '160 g', badge: 'Mais pedido', price: 32.9,
    description: 'Blend na brasa, queijo prato, alface, tomate, cebola roxa e molho Brasa no brioche.',
    art: { cheese: true, cheeseColor: '#FFC72C', patty: '#5A2C17' },
  },
  {
    id: 'duplo-smash', category: 'burgers', kind: 'burger', name: 'Duplo Smash', line: 'Linha Smash',
    size: '2 × 90 g', price: 38.9,
    description: 'Dois smash crocantes, cheddar derretido em dobro, picles e cebola na chapa.',
    art: { cheese: true, double: true, cheeseColor: '#F5A623', patty: '#4A2414' },
  },
  {
    id: 'bacon-inferno', category: 'burgers', kind: 'burger', name: 'Bacon Inferno', line: 'Linha Picante',
    size: '160 g', badge: 'Picante', price: 41.9,
    description: 'Bacon crocante, pepper jack, jalapeño e maionese de pimenta defumada.',
    art: { cheese: true, bacon: true, cheeseColor: '#FFD55C', bun: '#D9822A' },
  },
  {
    id: 'cheddar-melt', category: 'burgers', kind: 'burger', name: 'Cheddar Melt', line: 'Linha Assinatura',
    size: '160 g', price: 36.9,
    description: 'Banhado em cheddar cremoso, cebola caramelizada e farofa de bacon.',
    art: { cheese: true, cheeseColor: '#F59A0B' },
  },
  {
    id: 'chicken-crispy', category: 'burgers', kind: 'burger', name: 'Chicken Crispy', line: 'Linha Frango',
    size: '150 g', badge: 'Novo', price: 34.9,
    description: 'Sobrecoxa empanada crocante, coleslaw da casa e maionese de limão.',
    art: { cheese: false, patty: '#D08A2E' },
  },
  {
    id: 'veggie-brasa', category: 'burgers', kind: 'burger', name: 'Veggie Brasa', line: 'Linha Verde',
    size: '140 g', price: 33.9,
    description: 'Hambúrguer de grão-de-bico e cogumelos, queijo, rúcula e tomate confit.',
    art: { cheese: true, cheeseColor: '#FFE08A', patty: '#7A5A2A' },
  },
  {
    id: 'combo-brasa', category: 'combos', kind: 'burger', name: 'Combo Brasa', line: 'Combo',
    size: 'Burger + fritas + bebida', badge: 'Economize', price: 46.9,
    description: 'Brasa Clássico, fritas rústicas e uma bebida de sua escolha.',
    art: { cheese: true, bacon: true, cheeseColor: '#FFC72C' },
  },
  {
    id: 'fritas-rusticas', category: 'acomp', kind: 'fries', name: 'Fritas Rústicas', line: 'Acompanhamento',
    size: '300 g', price: 16.9,
    description: 'Batatas com casca, alecrim e sal grosso. Acompanha molho da casa.',
  },
  {
    id: 'onion-rings', category: 'acomp', kind: 'rings', name: 'Onion Rings', line: 'Acompanhamento',
    size: '10 unid.', price: 18.9,
    description: 'Anéis de cebola empanados na cerveja, crocantes e dourados.',
  },
  {
    id: 'milkshake', category: 'bebidas', kind: 'shake', name: 'Milkshake', line: 'Bebidas',
    size: '400 ml', price: 21.9,
    description: 'Sorvete batido cremoso nos sabores chocolate, morango ou baunilha.',
    art: { cup: '#F28B9A' },
  },
  {
    id: 'limonada', category: 'bebidas', kind: 'drink', name: 'Limonada da Casa', line: 'Bebidas',
    size: '500 ml', price: 11.9,
    description: 'Limão espremido na hora com hortelã e um toque de gengibre.',
    art: { cup: '#9BD15A' },
  },
  {
    id: 'refrigerante', category: 'bebidas', kind: 'drink', name: 'Refrigerante', line: 'Bebidas',
    size: 'Lata 350 ml', price: 7.9,
    description: 'Consulte os sabores disponíveis no momento do pedido.',
    art: { cup: '#E3262E' },
  },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(MENU.map((p) => [p.id, p]));
