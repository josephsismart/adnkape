import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMapLocationDot,
  faUsers,
  faSeedling,
  faRulerCombined,
  faTriangleExclamation,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { getFarms, summarize, storageMode } from '@/lib/store';
import { getSession } from '@/lib/auth';
import AdminFarmTable from '@/components/AdminFarmTable';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — ADN Kape' };

const MODE_NOTE = {
  local: 'Local mode — changes are written straight to data/farms.json in this project.',
  github:
    'GitHub mode — changes are committed to your repository, which redeploys the site.',
  readonly:
    'Read-only — this deployment has no write target. Set GITHUB_TOKEN and GITHUB_REPO to enable editing.',
};

export default async function AdminPage() {
  const farms = await getFarms();
  const stats = summarize(farms);
  const mode = storageMode();
  const session = getSession();

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Administration</p>
          <h1 className="section-title">Farm data admin</h1>
          <p className="mt-1 text-brew">
            Signed in as <strong>{session?.username}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/farms/new" className="btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Add farm
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div
        className={`mt-6 flex items-start gap-3 rounded-lg border p-4 text-sm ${
          mode === 'readonly'
            ? 'border-cherry/25 bg-cherry/8 text-cherry'
            : 'border-leaf/25 bg-leaf/8 text-leaf'
        }`}
      >
        <FontAwesomeIcon
          icon={mode === 'readonly' ? faTriangleExclamation : faDatabase}
          className="mt-0.5"
        />
        <span>{MODE_NOTE[mode]}</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={faMapLocationDot} value={stats.farms} label="Farms" />
        <Stat icon={faRulerCombined} value={`${stats.hectares} ha`} label="Total area" />
        <Stat icon={faUsers} value={stats.farmers} label="Farmers" />
        <Stat
          icon={faSeedling}
          value={stats.nurseryPlants.toLocaleString()}
          label="Nursery plants"
        />
      </div>

      <div className="mt-8">
        <AdminFarmTable farms={farms} readOnly={mode === 'readonly'} />
      </div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="card !p-4">
      <FontAwesomeIcon icon={icon} className="text-brew" />
      <div className="mt-1.5 font-display text-2xl font-bold text-bean">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-brew">{label}</div>
    </div>
  );
}
