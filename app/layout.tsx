import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

import './globals.css';
import { ContentProvider } from '@/components/content';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Mila Bee Studios',
  description: 'Luxury beauty studio focused on professionalism, consistency, and growth.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        <ContentProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ContentProvider>
      </body>
    </html>
  );
}
