const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata um número como moeda brasileira (R$ 32,90). */
export const money = (value: number) => brl.format(value).replace(/ /g, ' ');
