import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { SkipLink } from '@/components/accessibility/SkipLink';
import { CursorAffordance } from '@/components/motion/CursorAffordance';
import { ThemeProvider, themeInitScript } from '@/components/layout/ThemeProvider';
import { Footer } from '@/components/navigation/Footer';
import { Header } from '@/components/navigation/Header';
import { organizationSchema, websiteSchema } from '@/lib/seo';
import { site } from '@/lib/site';
import '@/styles/globals.css';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s · ${site.name}`,
  },
  description:
    'Axlo Digital designs and builds connected digital products, operational platforms, and intelligent systems for modern businesses.',
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en',
    url: site.url,
    title: site.seoTitle,
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: site.seoTitle },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#0B1220',
  width: 'device-width',
  initialScale: 1,
  // Text must be resizable to 200% — no maximum-scale lock.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${sora.variable} ${inter.variable}`}>
      <head>
        {/* Applies the stored motion preference before first paint. The theme
            is fixed dark on <html> above — there is nothing to resolve. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SkipLink />
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CursorAffordance />
        </ThemeProvider>
      </body>
    </html>
  );
}
