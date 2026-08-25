import './globals.css';
import Link from 'next/link';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faLocationDot, faLock } from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

export const metadata = {
  title: 'ADN Kape — Agusan del Norte Coffee Map',
  description:
    'Mapping the coffee farms of Agusan del Norte: locations, varieties, soil, nurseries, seed traceability and the people behind every hectare.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-foam font-sans antialiased">
        <header className="sticky top-0 z-[1100] border-b border-crema/40 bg-milk/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brew text-milk">
                <FontAwesomeIcon icon={faMugHot} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-bold text-bean">ADN Kape</span>
                <span className="block text-[11px] uppercase tracking-widest text-brew">
                  Agusan del Norte
                </span>
              </span>
            </Link>

            <nav className="flex items-center gap-1 text-sm font-medium text-roast">
              <Link className="rounded-lg px-3 py-2 hover:bg-crema/25" href="/#map">
                <FontAwesomeIcon icon={faLocationDot} className="mr-1.5" />
                Map
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-crema/25" href="/farms">
                Farms
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-crema/25" href="/#about">
                About
              </Link>
              <Link className="btn-primary ml-2 !px-3 !py-2" href="/admin">
                <FontAwesomeIcon icon={faLock} />
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20 border-t border-crema/40 bg-bean text-foam/80">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-milk">
                <FontAwesomeIcon icon={faMugHot} /> ADN Kape
              </div>
              <p className="text-sm leading-relaxed">
                A coffee farm registry and map for Agusan del Norte — built to make
                farm data, nurseries and seed sources visible in one place.
              </p>
            </div>
            <div className="text-sm">
              <div className="mb-2 font-semibold text-milk">Explore</div>
              <ul className="space-y-1">
                <li><Link href="/#map" className="hover:text-crema">Interactive map</Link></li>
                <li><Link href="/farms" className="hover:text-crema">Farm directory</Link></li>
                <li><Link href="/#about" className="hover:text-crema">About the project</Link></li>
              </ul>
            </div>
            <div className="text-sm">
              <div className="mb-2 font-semibold text-milk">Data</div>
              <p className="leading-relaxed">
                Sample data shown for demonstration. Official figures to be provided by
                LGU agriculture offices and the Provincial Agriculture Office.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-foam/60">
            © {new Date().getFullYear()} ADN Kape · Agusan del Norte
          </div>
        </footer>
      </body>
    </html>
  );
}
