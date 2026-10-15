**Github Page:** [Brasa Burguers](https://er1ckvictor.github.io/Brasa-Burguers/)

# Brasa Burger — site da hamburgueria

Site em **Next.js (App Router) + React + TypeScript + CSS**.

Principais recursos:
- **Entrada em parallax:** os ingredientes se montam conforme a rolagem e o hambúrguer desce até o main.
- **Cardápio com busca e filtros:** a busca encontra por nome, ingrediente, linha ou categoria, sem se importar com acentos, e se combina com os filtros por categoria.
- **Cardápio em lista no celular:** no celular, cada produto vira uma linha compacta (foto à esquerda, informações e botão à direita), e as categorias rolam para o lado.
- **Carrinho:** quantidades, entrega ou retirada, endereço, pagamento e observações.
- **Pedido pelo WhatsApp:** o cliente finaliza e a conversa abre com a mensagem do pedido organizada.

## Rodando localmente

Requisito: Node.js 20 ou superior.

```bash
npm install
cp .env.example .env.local   # depois edite os valores
npm run dev                  # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

## Configuração

| O quê | Onde |
| --- | --- |
| Número do WhatsApp que recebe os pedidos | `.env.local` → `NEXT_PUBLIC_WHATSAPP_NUMBER` (DDI + DDD + número, ex.: `5517999999999`) |
| Taxa de entrega | `.env.local` → `NEXT_PUBLIC_DELIVERY_FEE` (ex.: `6` ou `0` para grátis) |
| Telefone, Instagram, endereço, endereço de retirada | `lib/site.ts` |
| Horário de funcionamento por dia (turnos, folgas, depois da meia-noite) | `lib/hours.ts` |
| Produtos, preços, descrições, categorias | `data/menu.ts` |
| Cores e estilos | `app/globals.css` (variáveis no topo: `--red`, `--yellow`, `--black`) |

Depois de alterar o `.env.local`, reinicie o `npm run dev`. Em produção, cadastre as mesmas variáveis no painel da hospedagem.

## Estrutura

```
app/
  layout.tsx          metadados (SEO), fontes e HTML base
  page.tsx            monta a página
  globals.css         todo o visual e as animações
components/
  Scene.tsx           entrada parallax + header + hero (hambúrguer que viaja)
  burger/Layers.tsx   camadas do hambúrguer (pão, alface, tomate, queijo, carne)
  Header.tsx          menu fixo com botão do carrinho
  Menu.tsx            cardápio com filtros e botões de adicionar
  ProductArt.tsx      ilustrações dos produtos (troque por fotos se quiser)
  Sections.tsx        faixa animada, diferenciais, contato e rodapé
  cart/CartDrawer.tsx painel do carrinho + formulário
  cart/CartFab.tsx    botão flutuante do carrinho
context/CartContext.tsx  estado do carrinho (fica salvo no navegador)
lib/whatsapp.ts       monta a mensagem do pedido e o link do WhatsApp
lib/site.ts           dados da marca
data/menu.ts          cardápio
```

## Como funciona o pedido

1. O cliente adiciona produtos e abre o carrinho.
2. Escolhe entrega ou retirada, preenche nome e endereço, forma de pagamento e observações.
3. Ao tocar em **Finalizar pedido no WhatsApp**, o WhatsApp abre com a mensagem pronta. Exemplo:

```
*NOVO PEDIDO — BRASA BURGER*

*Itens*
2x Brasa Clássico — R$ 65,80
1x Fritas Rústicas — R$ 16,90

Subtotal: R$ 82,70
Taxa de entrega: R$ 6,00
*Total: R$ 88,70*

*Cliente*
Nome: Ana

*Entrega*
Rua das Flores, 120 — Centro

*Pagamento*
Pix
```

4. O cliente só aperta enviar.

Não há banco de dados nem sistema de pedidos: o carrinho fica salvo no navegador do cliente (localStorage).

## Usar fotos reais nos produtos

Coloque as imagens em `public/produtos/` e, em `components/Menu.tsx`, troque `<ProductArt product={product} />` por:

```tsx
<Image src={`/produtos/${product.id}.jpg`} alt={product.name} width={220} height={180} />
```

O import é `import Image from 'next/image'`.

## Publicar

O caminho mais simples é a **Vercel**:
1. Suba o projeto para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Cadastre as variáveis `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_DELIVERY_FEE`.

Também funciona em Netlify, Render ou qualquer servidor Node (`npm run build && npm start`).

## Acessibilidade e desempenho

- **Animações:** rodam em `requestAnimationFrame`, escrevendo direto no DOM, sem re-render do React na rolagem.
- **Movimento reduzido:** quem ativa "reduzir movimento" no sistema vê a página sem animações, com o hambúrguer já montado.
- **Navegação:** o botão "Pular intro" leva direto ao conteúdo, e o carrinho fecha com `Esc`.
