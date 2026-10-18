import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './public-theme.css';
import './admin-theme.css';
import './design-system.css';
import './sport.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['600', '700', '800', '900'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://euphoriaautohub.in'),
  title: {
    default: 'Euphoria Auto Hub | Premium Car Wash, PPF, Ceramic & Detailing in Pune',
    template: '%s | Euphoria Auto Hub',
  },
  description: "Euphoria Auto Hub — Your Car's Best Friend. Premium car wash, PPF, ceramic and graphene coatings, detailing, and wraps in Bavdhan, Pune.",
};

const themeBoot = `document.documentElement.setAttribute('data-theme','light');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${grotesk.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">{themeBoot}</Script>
        {process.env.NEXT_PUBLIC_GA_ID && /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}</Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
