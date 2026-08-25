import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot,
  faUsers,
  faRulerCombined,
  faSeedling,
  faLocationDot,
  faMountainSun,
  faFlask,
  faBarcode,
  faUserTie,
  faLeaf,
  faArrowLeft,
  faCrosshairs,
  faCertificate,
} from '@fortawesome/free-solid-svg-icons';
import { getFarmBySlug, getFarms } from '@/lib/store';
import MapSection from '@/components/MapSection';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const farm = await getFarmBySlug(params.slug);
  if (!farm) return { title: 'Farm not found' };

  const description = `${farm.name} — Brgy. ${farm.barangay}, ${farm.municipality}, Agusan del Norte. ${
    (farm.varieties || []).join(', ')
  } on ${farm.areaHectares} ha, ${farm.farmers?.count} farmers.`;

  return {
    title: farm.name,
    description,
    alternates: { canonical: `/farms/${farm.slug}` },
    openGraph: {
      type: 'article',
      title: `${farm.name} — ADN Kape`,
      description,
      url: `/farms/${farm.slug}`,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${farm.name} — ADN Kape`,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function FarmPage({ params }) {
  const farm = await getFarmBySlug(params.slug);
  if (!farm) notFound();

  const others = (await getFarms()).filter(
    (f) => f.municipality === farm.municipality && f.id !== farm.id
  );

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Link href="/farms" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brew hover:underline">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to directory
      </Link>

      <header className="relative overflow-hidden rounded-xl border border-line bg-bean px-8 py-10 text-foam shadow-soft grain">
        <span className="chip !bg-white/10 !text-crema capitalize">{farm.status}</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-milk sm:text-4xl">
          {farm.name}
        </h1>
        <p className="mt-1 text-foam/80">
          <FontAwesomeIcon icon={faLocationDot} className="mr-1.5 text-crema" />
          Brgy. {farm.barangay}, {farm.municipality}, Agusan del Norte
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeadStat icon={faRulerCombined} label="Area" value={`${farm.areaHectares} ha`} />
          <HeadStat icon={faUsers} label="Farmers" value={farm.farmers?.count} />
          <HeadStat
            icon={faSeedling}
            label="Nursery plants"
            value={Number(farm.motherGarden?.nurseryPlants || 0).toLocaleString()}
          />
          <HeadStat
            icon={faMountainSun}
            label="Elevation"
            value={`${farm.geotag?.elevationMasl} masl`}
          />
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Panel icon={faMugHot} title="Variety & soil">
          <Row label="Varieties" value={(farm.varieties || []).join(', ')} />
          <Row label="Soil type" value={farm.soilType} />
          <Row
            label="Est. annual yield"
            value={
              farm.yieldEstimateKgPerYear
                ? `${Number(farm.yieldEstimateKgPerYear).toLocaleString()} kg green beans`
                : '—'
            }
          />
        </Panel>

        <Panel icon={faCrosshairs} title="Geotag">
          <Row label="Latitude" value={farm.geotag?.lat} />
          <Row label="Longitude" value={farm.geotag?.lng} />
          <Row label="Elevation" value={`${farm.geotag?.elevationMasl} masl`} />
          <a
            className="mt-2 inline-block text-sm font-semibold text-brew hover:underline"
            href={`https://www.google.com/maps?q=${farm.geotag?.lat},${farm.geotag?.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps →
          </a>
        </Panel>

        <Panel icon={faUsers} title="Farmers">
          <Row label="Number of farmers" value={farm.farmers?.count} />
          <Row label="Association" value={farm.farmers?.association} />
          <Row label="Lead farmer" value={farm.farmers?.leadFarmer} />
          {farm.farmers?.notes && <Row label="Notes" value={farm.farmers.notes} />}
        </Panel>

        <Panel icon={faSeedling} title="Mother garden / nursery">
          {farm.motherGarden?.exists ? (
            <>
              <Row label="Facility" value={farm.motherGarden.name} />
              <Row label="Type" value={farm.motherGarden.type} />
              <Row
                label="Plants on hand"
                value={Number(farm.motherGarden.nurseryPlants).toLocaleString()}
              />
              <Row label="Established" value={farm.motherGarden.establishedYear} />
            </>
          ) : (
            <p className="text-sm text-roast/80">
              No mother garden or nursery on this site — planting material is sourced
              externally (see seed traceability).
            </p>
          )}
        </Panel>

        <Panel icon={faBarcode} title="Seed traceability">
          <Row label="Immediate source" value={farm.seedTraceability?.source} />
          <Row label="Origin" value={farm.seedTraceability?.origin} />
          <Row label="Batch" value={farm.seedTraceability?.batch} />
          <Row label="Year acquired" value={farm.seedTraceability?.yearAcquired} />
          <p className="mt-2 inline-flex items-start gap-2 rounded-lg bg-leaf/10 p-2 text-xs text-leaf">
            <FontAwesomeIcon icon={faCertificate} className="mt-0.5" />
            {farm.seedTraceability?.certification}
          </p>
        </Panel>

        <Panel icon={faUserTie} title="Focal person">
          <Row label="Name" value={farm.focalPerson?.name} />
          <Row label="Position" value={farm.focalPerson?.position} />
          <Row label="Office" value={farm.focalPerson?.office} />
          <Row label="Contact" value={farm.focalPerson?.contact} />
        </Panel>

        <Panel icon={faMountainSun} title="Topography">
          <Row label="Terrain" value={farm.topography?.terrain} />
          <Row label="Slope" value={farm.topography?.slopePercent} />
          <Row label="Elevation range" value={`${farm.topography?.elevationRangeMasl} masl`} />
          <Row label="Climate" value={farm.topography?.climate} />
        </Panel>

        <Panel icon={faLeaf} title="Planting materials" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <TagList icon={faFlask} title="Fertilizers" items={farm.plantingMaterials?.fertilizers} />
            <TagList icon={faFlask} title="Soil amendments" items={farm.plantingMaterials?.soilAmendments} />
            <TagList icon={faLeaf} title="Pest management" items={farm.plantingMaterials?.pestManagement} />
            <TagList icon={faSeedling} title="Field practices" items={farm.plantingMaterials?.practices} />
          </div>
        </Panel>
      </div>

      {farm.notes && (
        <p className="mt-5 rounded-lg border border-line bg-white p-5 text-sm text-roast">
          <strong className="text-bean">Notes: </strong>
          {farm.notes}
        </p>
      )}

      <p className="mt-4 text-xs text-brew">
        Record ID {farm.id} · created {farm.createdAt} · last updated {farm.updatedAt}
      </p>

      <section className="mt-12">
        <h2 className="section-title !text-2xl">Location</h2>
        <div className="mt-4">
          <MapSection farms={[farm, ...others]} height="440px" />
        </div>
      </section>
    </div>
  );
}

function HeadStat({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/[0.06] p-4">
      <FontAwesomeIcon icon={icon} className="text-crema" />
      <div className="mt-1.5 font-display text-xl font-bold text-milk">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-foam/60">{label}</div>
    </div>
  );
}

function Panel({ icon, title, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-bean">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brew/10 text-brew">
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </span>
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-crema/30 py-1.5 text-sm last:border-0">
      <span className="shrink-0 text-brew">{label}</span>
      <span className="text-right font-medium text-bean">{value || '—'}</span>
    </div>
  );
}

function TagList({ icon, title, items }) {
  return (
    <div>
      <div className="label">
        <FontAwesomeIcon icon={icon} className="mr-1.5" />
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(items || []).length ? (
          items.map((i) => (
            <span key={i} className="chip">
              {i}
            </span>
          ))
        ) : (
          <span className="text-sm text-roast/60">—</span>
        )}
      </div>
    </div>
  );
}
