import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot,
  faSeedling,
  faMapLocationDot,
  faUsers,
  faRulerCombined,
  faLeaf,
  faMountainSun,
  faFlask,
  faBarcode,
  faUserTie,
  faArrowRight,
  faCircleCheck,
  faWeightHanging,
} from '@fortawesome/free-solid-svg-icons';
import { getFarms, summarize } from '@/lib/store';
import MapSection from '@/components/MapSection';
import { Seal, CoffeeBean, BeanDivider } from '@/components/Brand';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { icon: faMapLocationDot, title: 'Geotag', body: 'Exact coordinates and elevation for every farm, plotted on one provincial map.' },
  { icon: faMugHot, title: 'Variety', body: 'Arabica, Robusta, Excelsa and Liberica holdings recorded per site.' },
  { icon: faFlask, title: 'Soil type', body: 'Soil classification supporting fertilizer and amendment planning.' },
  { icon: faRulerCombined, title: 'Area', body: 'Hectarage per farm, rolled up by barangay, municipality and province.' },
  { icon: faUsers, title: 'Farmers', body: 'Headcount, associations and lead farmers behind each production area.' },
  { icon: faSeedling, title: 'Mother garden', body: 'Nurseries and greenhouses, with live counts of seedlings on hand.' },
  { icon: faBarcode, title: 'Seed traceability', body: 'Where the planting material came from, its batch and certification.' },
  { icon: faUserTie, title: 'Focal person', body: 'The city or municipal agriculture contact accountable for the site.' },
  { icon: faMountainSun, title: 'Topography', body: 'Terrain, slope, elevation band and climate type of the growing area.' },
  { icon: faLeaf, title: 'Planting materials', body: 'Fertilizers, amendments, pest management and field practices in use.' },
  { icon: faCircleCheck, title: 'Production status', body: 'Whether a site is in full production, expanding, piloting or dormant.' },
  { icon: faWeightHanging, title: 'Yield estimate', body: 'Expected annual green bean volume, for supply and market planning.' },
];

export default async function HomePage() {
  const farms = await getFarms();
  const s = summarize(farms);

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-line bg-bean text-foam grain">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 70% at 12% 15%, rgba(111,78,55,.85) 0, transparent 60%), radial-gradient(ellipse 50% 60% at 88% 8%, rgba(79,121,66,.45) 0, transparent 62%), radial-gradient(ellipse 70% 60% at 70% 100%, rgba(178,58,46,.28) 0, transparent 60%)',
          }}
        />
        {/* seal watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block"
        >
          <Seal size={560} />
        </div>

        <div className="relative mx-auto grid max-w-content items-center gap-14 px-5 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Seal size={54} priority />
              <span className="text-[10px] font-semibold uppercase leading-relaxed tracking-official text-crema">
                Province of Agusan del Norte
                <span className="block text-foam/55">Coffee Farm Registry</span>
              </span>
            </div>

            <h1 className="font-display text-[2.6rem] font-bold leading-[1.08] text-milk sm:text-5xl lg:text-[3.5rem]">
              Every coffee farm in the province,
              <span className="text-crema"> on one map.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-foam/80">
              ADN Kape brings together the location, variety, soil, nursery stock, seed
              origin and people behind each coffee farm in Agusan del Norte — so planning,
              sourcing and support decisions rest on the same picture.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#map" className="btn-onDark">
                <FontAwesomeIcon icon={faMapLocationDot} className="text-[13px]" />
                Explore the map
              </Link>
              <Link href="/farms" className="btn-onDarkGhost">
                Browse farm directory
                <FontAwesomeIcon icon={faArrowRight} className="text-[12px]" />
              </Link>
            </div>
          </div>

          {/* Stat board */}
          <div className="rounded-xl border border-white/12 bg-white/[0.045] p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center gap-2">
              <CoffeeBean size={12} className="text-crema" />
              <span className="text-[10px] font-semibold uppercase tracking-official text-crema">
                At a glance
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7">
              <Stat value={s.farms} label="Farms mapped" />
              <Stat value={s.hectares} label="Hectares" />
              <Stat value={s.farmers} label="Farmers" />
              <Stat value={s.nurseryPlants.toLocaleString()} label="Nursery plants" />
              <Stat value={s.varieties} label="Varieties" />
              <Stat value={s.municipalities} label="Cities / municipalities" />
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Map */}
      <section id="map" className="mx-auto max-w-content scroll-mt-24 px-5 py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">Interactive map</p>
            <h2 className="section-title">Coffee farm map</h2>
            <p className="lede mt-3">
              Filter by municipality or variety, then select a pin for the full farm
              profile — nursery stock, seed source, focal person and field practices.
            </p>
          </div>
          <Link href="/farms" className="btn-ghost">
            Directory view <FontAwesomeIcon icon={faArrowRight} className="text-[12px]" />
          </Link>
        </div>
        <MapSection farms={farms} />
      </section>

      {/* ---------------------------------------------------------- Fields */}
      <section id="about" className="scroll-mt-24 border-y border-line bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-2">The record</p>
            <h2 className="section-title">What we record for every farm</h2>
            <p className="lede mt-3">
              One consistent profile per site, so figures can be compared across barangays
              and rolled up to the provincial level without re-collecting data.
            </p>
            <BeanDivider className="mx-auto mt-8 max-w-xs" />
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f) => (
              <div key={f.title} className="group bg-white p-6 transition hover:bg-foam/50">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-md border border-line bg-foam text-brew transition group-hover:border-crema group-hover:bg-brew group-hover:text-milk">
                  <FontAwesomeIcon icon={f.icon} className="text-[15px]" />
                </span>
                <h3 className="font-display text-[17px] font-bold text-bean">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-roast/80">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA */}
      <section className="mx-auto max-w-content px-5 py-20">
        <div className="relative overflow-hidden rounded-xl border border-line bg-bean px-8 py-14 text-center text-milk grain">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 50% 90% at 50% 0%, rgba(111,78,55,.9) 0, transparent 65%)',
            }}
          />
          <div className="relative">
            <div className="mb-5 flex justify-center gap-2">
              <CoffeeBean size={13} className="rotate-[-20deg] text-crema/70" />
              <CoffeeBean size={16} className="text-crema" />
              <CoffeeBean size={13} className="rotate-[20deg] text-crema/70" />
            </div>
            <h2 className="font-display text-3xl font-bold sm:text-[2.4rem]">
              Have farm data to add?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-foam/80">
              City and municipal agriculture offices can register new farms, update nursery
              counts and record seed sources through the admin panel.
            </p>
            <Link href="/admin" className="btn-onDark mt-8">
              Go to admin panel <FontAwesomeIcon icon={faArrowRight} className="text-[12px]" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-official text-foam/50">
        {label}
      </dt>
      <dd className="mt-1 font-display text-[1.9rem] font-bold leading-none text-milk">
        {value}
      </dd>
    </div>
  );
}
