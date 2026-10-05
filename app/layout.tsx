import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './public-theme.css';
import './admin-theme.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://euphoriaautohub.in'),
  title: {
    default: 'Euphoria Auto Hub | Premium Car Wash, PPF, Ceramic & Detailing in Pune',
    template: '%s | Euphoria Auto Hub',
  },
  description: "Euphoria Auto Hub — Your Car's Best Friend. Premium car wash, PPF, ceramic and graphene coatings, detailing, and wraps in Bavdhan, Pune.",
};

const themeBoot = `(function(){try{var t=localStorage.getItem('euphoria-theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">{themeBoot}</Script>
        {children}
      </body>
    </html>
  );
}
