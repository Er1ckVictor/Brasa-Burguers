import type { Metadata, Viewport } from 'next';
import { SITE } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: `${SITE.name} — Hambúrguer artesanal na brasa`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
