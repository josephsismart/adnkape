import './globals.css';
import Link from 'next/link';
import { Lora, Inter } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faLock, faListUl } from '@fortawesome/free-solid-svg-icons';
import { Seal, Wordmark, CoffeeBean } from '@/components/Brand';

config.autoAddCss = false;

const display = Lora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE = 'https://adnkape.vercel.app';
const TITLE = 'ADN Kape — Agusan del Norte Coffee Farm Map';
const DESCRIPTION =
  'The coffee farms of Agusan del Norte on one map: geotag, variety, soil, area, farmers, nurseries, seed traceability, focal persons, topography and planting materials.';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: '%s — ADN Kape',
  },
  description: DESCRIPTION,
  applicationName: 'ADN Kape',
  keywords: [
    'Agusan del Norte',
    'coffee',
    'kape',
    'coffee farms',
    'Caraga',
    'Philippines',
    'Robusta',
    'Arabica',
    'Excelsa',
    'coffee map',
  ],
  authors: [{ name: 'Province of Agusan del Norte' }],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'ADN Kape',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE,
    locale: 'en_PH',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ADN Kape — Coffee Farm Registry & Interactive Map, Province of Agusan del Norte',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#2B1B12',
};

const NAV = [
  { href: '/#map', label: 'Map', icon: faLocationDot },
  { href: '/farms', label: 'Farm directory', icon: faListUl },
  { href: '/#about', label: 'About', icon: null },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-paper font-sans">
        {/* Official strip */}
        <div className="bg-bean text-center">
          <p className="mx-auto max-w-content px-5 py-1.5 text-[10px] font-semibold uppercase tracking-official text-crema">
            Province of Agusan del Norte · Region XIII — Caraga
          </p>
        </div>

        <header className="sticky top-0 z-[1100] border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3">
            <Wordmark />

            <nav className="flex items-center gap-0.5">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="hidden rounded-md px-3 py-2 text-[13px] font-medium text-roast transition hover:bg-foam hover:text-bean sm:block"
                >
                  {n.icon && (
                    <FontAwesomeIcon icon={n.icon} className="mr-1.5 text-[11px] text-brew" />
                  )}
                  {n.label}
                </Link>
              ))}
              <Link href="/admin" className="btn-primary ml-2 !px-3.5 !py-2 !text-[13px]">
                <FontAwesomeIcon icon={faLock} className="text-[11px]" />
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-line bg-bean text-foam/75 grain">
          <div className="mx-auto grid max-w-content gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Seal size={44} />
                <span className="leading-none">
                  <span className="block font-display text-lg font-bold text-milk">ADN Kape</span>
                  <span className="mt-1 block text-[9.5px] font-semibold uppercase tracking-official text-crema">
                    Coffee Farm Registry
                  </span>
                </span>
              </div>
              <p className="max-w-sm text-[13.5px] leading-relaxed">
                A registry and interactive map of the coffee farms of Agusan del Norte —
                built so farm data, nursery stock and seed sources are visible in one
                place.
              </p>
            </div>

            <div className="text-[13.5px]">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-official text-crema">
                Explore
              </div>
              <ul className="space-y-2">
                {[
                  ['/#map', 'Interactive map'],
                  ['/farms', 'Farm directory'],
                  ['/#about', 'What we record'],
                  ['/admin', 'Admin panel'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-crema">
                      <CoffeeBean size={8} className="mr-2 inline-block text-crema/70 align-middle" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[13.5px]">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-official text-crema">
                Data source
              </div>
              <p className="leading-relaxed">
                Sample records shown for demonstration. Official figures to be supplied by
                city and municipal agriculture offices and the Provincial Agriculture
                Office.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-5 py-4 text-[11px] text-foam/55 sm:flex-row">
              <span>© {new Date().getFullYear()} Province of Agusan del Norte</span>
              <span>Map data © OpenStreetMap contributors</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
