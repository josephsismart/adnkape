'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFloppyDisk,
  faSpinner,
  faMapLocationDot,
  faMugHot,
  faUsers,
  faSeedling,
  faBarcode,
  faUserTie,
  faMountainSun,
  faLeaf,
  faArrowLeft,
  faCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import {
  MUNICIPALITIES,
  SOIL_TYPES,
  VARIETIES,
  STATUSES,
  MOTHER_GARDEN_TYPES,
  emptyFarm,
  slugify,
} from '@/lib/schema';

/** Deep-set a value at a dotted path, returning a new object. */
function setPath(obj, path, value) {
  const keys = path.split('.');
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] || {}) };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return next;
}

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export default function FarmForm({ initial, mode = 'create' }) {
  const router = useRouter();
  const [farm, setFarm] = useState(initial || emptyFarm());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (path) => (e) => {
    const el = e.target;
    const value = el.type === 'checkbox' ? el.checked : el.value;
    setFarm((f) => setPath(f, path, value));
  };

  const toggleVariety = (v) =>
    setFarm((f) => ({
      ...f,
      varieties: f.varieties.includes(v)
        ? f.varieties.filter((x) => x !== v)
        : [...f.varieties, v],
    }));

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const payload = { ...farm, slug: farm.slug || slugify(farm.name) };
    const url = mode === 'create' ? '/api/farms' : `/api/farms/${farm.id}`;
    const res = await fetch(url, {
      method: mode === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || 'Save failed.');
      setBusy(false);
    }
  }

  const listValue = (path) => {
    const v = getPath(farm, path);
    return Array.isArray(v) ? v.join(', ') : v || '';
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-brew hover:underline">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to admin
      </Link>

      <h1 className="section-title">
        {mode === 'create' ? 'Add a coffee farm' : `Edit: ${initial?.name}`}
      </h1>
      <p className="mt-1 text-brew">All fields feed the public map and farm profile.</p>

      {error && (
        <p className="mt-5 rounded-lg bg-cherry/10 p-3 text-sm text-cherry">{error}</p>
      )}

      <div className="mt-8 space-y-5">
        <Section icon={faMapLocationDot} title="Identity & location">
          <Grid>
            <Field label="Farm name" required>
              <input className="input" value={farm.name} onChange={set('name')} required />
            </Field>
            <Field label="Slug (URL)" hint="Auto-generated from the name if left blank.">
              <input
                className="input"
                value={farm.slug}
                onChange={set('slug')}
                placeholder={slugify(farm.name || '')}
              />
            </Field>
            <Field label="City / municipality" required>
              <select className="input" value={farm.municipality} onChange={set('municipality')} required>
                <option value="">Select…</option>
                {MUNICIPALITIES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Barangay">
              <input className="input" value={farm.barangay} onChange={set('barangay')} />
            </Field>
            <Field label="Status">
              <select className="input" value={farm.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Area (hectares)">
              <input
                className="input"
                type="number"
                step="0.1"
                value={farm.areaHectares ?? ''}
                onChange={set('areaHectares')}
              />
            </Field>
          </Grid>
        </Section>

        <Section icon={faCrosshairs} title="Geotag">
          <Grid cols={3}>
            <Field label="Latitude" required hint="e.g. 9.0512">
              <input
                className="input"
                type="number"
                step="any"
                value={farm.geotag?.lat ?? ''}
                onChange={set('geotag.lat')}
                required
              />
            </Field>
            <Field label="Longitude" required hint="e.g. 125.5123">
              <input
                className="input"
                type="number"
                step="any"
                value={farm.geotag?.lng ?? ''}
                onChange={set('geotag.lng')}
                required
              />
            </Field>
            <Field label="Elevation (masl)">
              <input
                className="input"
                type="number"
                value={farm.geotag?.elevationMasl ?? ''}
                onChange={set('geotag.elevationMasl')}
              />
            </Field>
          </Grid>
        </Section>

        <Section icon={faMugHot} title="Variety & soil">
          <Field label="Varieties grown">
            <div className="flex flex-wrap gap-2">
              {VARIETIES.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => toggleVariety(v)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    farm.varieties?.includes(v)
                      ? 'border-brew bg-brew text-milk'
                      : 'border-line bg-white text-roast hover:border-brew'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </Field>
          <Grid>
            <Field label="Soil type">
              <input
                className="input"
                list="soil-types"
                value={farm.soilType}
                onChange={set('soilType')}
              />
              <datalist id="soil-types">
                {SOIL_TYPES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </Field>
            <Field label="Estimated annual yield (kg green beans)">
              <input
                className="input"
                type="number"
                value={farm.yieldEstimateKgPerYear ?? ''}
                onChange={set('yieldEstimateKgPerYear')}
              />
            </Field>
          </Grid>
        </Section>

        <Section icon={faUsers} title="Farmers">
          <Grid>
            <Field label="Number of farmers">
              <input
                className="input"
                type="number"
                value={farm.farmers?.count ?? ''}
                onChange={set('farmers.count')}
              />
            </Field>
            <Field label="Association / cooperative">
              <input className="input" value={farm.farmers?.association ?? ''} onChange={set('farmers.association')} />
            </Field>
            <Field label="Lead farmer">
              <input className="input" value={farm.farmers?.leadFarmer ?? ''} onChange={set('farmers.leadFarmer')} />
            </Field>
            <Field label="Notes">
              <input className="input" value={farm.farmers?.notes ?? ''} onChange={set('farmers.notes')} />
            </Field>
          </Grid>
        </Section>

        <Section icon={faSeedling} title="Mother garden (greenhouse / nursery)">
          <label className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-bean">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brew"
              checked={Boolean(farm.motherGarden?.exists)}
              onChange={set('motherGarden.exists')}
            />
            This farm has a mother garden / nursery on site
          </label>
          {farm.motherGarden?.exists && (
            <Grid>
              <Field label="Facility name">
                <input className="input" value={farm.motherGarden?.name ?? ''} onChange={set('motherGarden.name')} />
              </Field>
              <Field label="Type">
                <select
                  className="input"
                  value={farm.motherGarden?.type ?? ''}
                  onChange={set('motherGarden.type')}
                >
                  <option value="">Select…</option>
                  {MOTHER_GARDEN_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Number of nursery plants">
                <input
                  className="input"
                  type="number"
                  value={farm.motherGarden?.nurseryPlants ?? ''}
                  onChange={set('motherGarden.nurseryPlants')}
                />
              </Field>
              <Field label="Year established">
                <input
                  className="input"
                  type="number"
                  value={farm.motherGarden?.establishedYear ?? ''}
                  onChange={set('motherGarden.establishedYear')}
                />
              </Field>
            </Grid>
          )}
        </Section>

        <Section icon={faBarcode} title="Seed traceability">
          <Grid>
            <Field label="Immediate source" hint="Nursery or office the seedlings came from">
              <input className="input" value={farm.seedTraceability?.source ?? ''} onChange={set('seedTraceability.source')} />
            </Field>
            <Field label="Original origin" hint="Where that stock ultimately came from">
              <input className="input" value={farm.seedTraceability?.origin ?? ''} onChange={set('seedTraceability.origin')} />
            </Field>
            <Field label="Batch / lot number">
              <input className="input" value={farm.seedTraceability?.batch ?? ''} onChange={set('seedTraceability.batch')} />
            </Field>
            <Field label="Year acquired">
              <input
                className="input"
                type="number"
                value={farm.seedTraceability?.yearAcquired ?? ''}
                onChange={set('seedTraceability.yearAcquired')}
              />
            </Field>
            <Field label="Certification" className="sm:col-span-2">
              <input
                className="input"
                value={farm.seedTraceability?.certification ?? ''}
                onChange={set('seedTraceability.certification')}
                placeholder="e.g. DA-BPI accredited source"
              />
            </Field>
          </Grid>
        </Section>

        <Section icon={faUserTie} title="Focal person (city / municipality)">
          <Grid>
            <Field label="Name">
              <input className="input" value={farm.focalPerson?.name ?? ''} onChange={set('focalPerson.name')} />
            </Field>
            <Field label="Position">
              <input className="input" value={farm.focalPerson?.position ?? ''} onChange={set('focalPerson.position')} />
            </Field>
            <Field label="Office">
              <input className="input" value={farm.focalPerson?.office ?? ''} onChange={set('focalPerson.office')} />
            </Field>
            <Field label="Contact number">
              <input className="input" value={farm.focalPerson?.contact ?? ''} onChange={set('focalPerson.contact')} />
            </Field>
          </Grid>
        </Section>

        <Section icon={faMountainSun} title="Topography">
          <Grid>
            <Field label="Terrain">
              <input className="input" value={farm.topography?.terrain ?? ''} onChange={set('topography.terrain')} placeholder="Rolling to hilly" />
            </Field>
            <Field label="Slope">
              <input className="input" value={farm.topography?.slopePercent ?? ''} onChange={set('topography.slopePercent')} placeholder="18–30%" />
            </Field>
            <Field label="Elevation range (masl)">
              <input className="input" value={farm.topography?.elevationRangeMasl ?? ''} onChange={set('topography.elevationRangeMasl')} placeholder="540–720" />
            </Field>
            <Field label="Climate type">
              <input className="input" value={farm.topography?.climate ?? ''} onChange={set('topography.climate')} placeholder="Type II — no pronounced dry season" />
            </Field>
          </Grid>
        </Section>

        <Section icon={faLeaf} title="Planting materials">
          <Grid>
            <Field label="Fertilizers" hint="Comma-separated">
              <input
                className="input"
                value={listValue('plantingMaterials.fertilizers')}
                onChange={set('plantingMaterials.fertilizers')}
                placeholder="Complete 14-14-14, Urea 46-0-0"
              />
            </Field>
            <Field label="Soil amendments" hint="Comma-separated">
              <input
                className="input"
                value={listValue('plantingMaterials.soilAmendments')}
                onChange={set('plantingMaterials.soilAmendments')}
                placeholder="Agricultural lime, Vermicompost"
              />
            </Field>
            <Field label="Pest management" hint="Comma-separated">
              <input
                className="input"
                value={listValue('plantingMaterials.pestManagement')}
                onChange={set('plantingMaterials.pestManagement')}
                placeholder="Berry borer traps, Beauveria bassiana"
              />
            </Field>
            <Field label="Field practices" hint="Comma-separated">
              <input
                className="input"
                value={listValue('plantingMaterials.practices')}
                onChange={set('plantingMaterials.practices')}
                placeholder="Shade-grown, Contour planting"
              />
            </Field>
          </Grid>
          <Field label="General notes">
            <textarea className="input min-h-[90px]" value={farm.notes ?? ''} onChange={set('notes')} />
          </Field>
        </Section>
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end gap-2 rounded-lg border border-line bg-white/95 p-3 shadow-lift backdrop-blur">
        <Link href="/admin" className="btn-ghost">
          Cancel
        </Link>
        <button className="btn-primary" disabled={busy}>
          <FontAwesomeIcon icon={busy ? faSpinner : faFloppyDisk} spin={busy} />
          {mode === 'create' ? 'Create farm' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function Section({ icon, title, children }) {
  return (
    <fieldset className="card">
      <legend className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-bean">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brew/10 text-brew">
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Grid({ children, cols = 2 }) {
  return (
    <div className={`grid gap-4 ${cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
      {children}
    </div>
  );
}

function Field({ label, hint, required, className = '', children }) {
  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="text-cherry"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-brew/80">{hint}</p>}
    </div>
  );
}
