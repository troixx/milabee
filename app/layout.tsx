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

const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
const maintenanceMessage =
  process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE ||
  'We are refreshing Mila Bee Studios. The booking flow stays open at GlossGenius while we finish updates.';
const maintenanceLink =
  process.env.NEXT_PUBLIC_MAINTENANCE_LINK || 'https://milabeestudios.glossgenius.com/';

export const metadata: Metadata = {
  title: 'Mila Bee Studios',
  description: 'Luxury beauty studio focused on professionalism, consistency, and growth.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        {maintenanceMode ? (
          <div className="maintenance-shell">
            <div className="maintenance-card">
              <p className="section-kicker">Maintenance Mode</p>
              <h1>We’ll be back shortly</h1>
              <p className="lead">{maintenanceMessage}</p>
              <a className="btn" href={maintenanceLink} target="_blank" rel="noopener noreferrer">
                Book at GlossGenius
              </a>
            </div>
          </div>
        ) : (
          <ContentProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </ContentProvider>
        )}
      </body>
    </html>
  );
}
