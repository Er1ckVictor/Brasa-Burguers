import { CartProvider } from '@/context/CartContext';
import Scene from '@/components/Scene';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import { Contact, Features, Footer, Marquee } from '@/components/Sections';
import CartFab from '@/components/cart/CartFab';
import CartDrawer from '@/components/cart/CartDrawer';

export default function HomePage() {
  return (
    <CartProvider>
      <main>
        <Scene header={<Header />} />
        <Marquee />
        <Menu />
        <Features />
        <Contact />
      </main>
      <Footer />
      <CartFab />
      <CartDrawer />
    </CartProvider>
  );
}
