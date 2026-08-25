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
} from '@fortawesome/free-solid-svg-icons';
import { getFarms, summarize } from '@/lib/store';
import MapSection from '@/components/MapSection';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { icon: faMapLocationDot, title: 'Geotag', body: 'Exact coordinates and elevation for every farm, plotted on one provincial map.' },
  { icon: faMugHot, title: 'Variety', body: 'Arabica, Robusta, Excelsa and Liberica holdings recorded per site.' },
  { icon: faFlask, title: 'Soil type', body: 'Soil classification supporting fertilizer and amendment planning.' },
  { icon: faRulerCombined, title: 'Area', body: 'Hectarage per farm, rolled up by barangay, municipality and province.' },
  { icon: faUsers, title: 'Farmers', body: 'Headcount, associations and lead farmers behind each production area.' },
  { icon: faSeedling, title: 'Mother garden', body: 'Nurseries and greenhouses, with live counts of seedlings on hand.' },
  { icon: faBarcode, title: 'Seed traceability', body: 'Where the planting material came from, its batch and certification.' },
  { icon: faUserTie, title: 'Focal person', body: 'The city/municipal agriculture contact accountable for the site.' },
  { icon: faMountainSun, title: 'Topography', body: 'Terrain, slope, elevation band and climate type of the growing area.' },
  { icon: faLeaf, title: 'Planting materials', body: 'Fertilizers, amendments, pest management and field practices in use.' },
];

export default async function HomePage() {
  const farms = await getFarms();
  const stats = summarize(farms);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bean text-foam">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #6F4E37 0, transparent 45%), radial-gradient(circle at 80% 0%, #4F7942 0, transparent 40%), radial-gradient(circle at 60% 90%, #B23A2E 0, transparent 45%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="chip !bg-crema/20 !text-crema">
              <FontAwesomeIcon icon={faMapLocationDot} />
              Agusan del Norte · Coffee Registry
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-milk sm:text-5xl lg:text-6xl">
              Every coffee farm in the province,
              <span className="text-crema"> on one map.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foam/85">
              ADN Kape brings together the location, variety, soil, nursery stock, seed
              origin and people behind each coffee farm in Agusan del Norte — so planning,
              sourcing and support decisions rest on the same picture.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#map" className="btn-primary !bg-crema !text-bean hover:!bg-foam">
                <FontAwesomeIcon icon={faMapLocationDot} />
                Explore the map
              </Link>
              <Link href="/farms" className="btn-ghost !border-foam/30 !text-foam hover:!bg-white/10">
                Browse farm directory
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center sm:grid-cols-3 lg:grid-cols-2">
            <Stat icon={faMapLocationDot} value={stats.farms} label="Farms mapped" />
            <Stat icon={faRulerCombined} value={`${stats.hectares}`} label="Hectares" />
            <Stat icon={faUsers} value={stats.farmers} label="Farmers" />
            <Stat icon={faSeedling} value={stats.nurseryPlants.toLocaleString()} label="Nursery plants" />
            <Stat icon={faMugHot} value={stats.varieties} label="Varieties" />
            <Stat icon={faLeaf} value={stats.municipalities} label="Cities / municipalities" />
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Coffee farm map</h2>
            <p className="mt-2 max-w-2xl text-brew">
              Filter by municipality or variety, then click a pin for the farm profile —
              nursery stock, seed source, focal person and field practices.
            </p>
          </div>
          <Link href="/farms" className="btn-ghost">
            Directory view <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
        <MapSection farms={farms} />
      </section>

      {/* What we record */}
      <section id="about" className="scroll-mt-20 bg-milk py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="section-title">What we record for every farm</h2>
          <p className="mt-2 max-w-2xl text-brew">
            One consistent profile per site, so figures can be compared across barangays
            and rolled up to the provincial level without re-collecting data.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f) => (
              <div key={f.title} className="card transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brew/10 text-brew">
                  <FontAwesomeIcon icon={f.icon} />
                </span>
                <h3 className="font-display text-lg font-bold text-bean">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-roast/85">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-3xl bg-brew px-8 py-14 text-center text-milk shadow-soft">
          <FontAwesomeIcon icon={faMugHot} className="text-3xl text-crema" />
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Have farm data to add?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foam/85">
            City and municipal agriculture offices can register new farms, update nursery
            counts and record seed sources through the admin panel.
          </p>
          <Link href="/admin" className="btn-primary mt-7 !bg-crema !text-bean hover:!bg-foam">
            Go to admin panel <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <FontAwesomeIcon icon={icon} className="text-crema" />
      <div className="mt-2 font-display text-2xl font-bold text-milk">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-foam/60">{label}</div>
    </div>
  );
}
