'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faEye,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

export default function AdminFarmTable({ farms, readOnly }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farms;
    return farms.filter((f) =>
      [f.name, f.municipality, f.barangay, ...(f.varieties || [])]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [farms, query]);

  async function remove(farm) {
    if (!confirm(`Delete "${farm.name}"? This cannot be undone.`)) return;
    setPendingId(farm.id);
    setError('');
    const res = await fetch(`/api/farms/${farm.id}`, { method: 'DELETE' });
    setPendingId(null);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => ({}))).error || 'Delete failed.');
  }

  return (
    <div className="card !p-0">
      <div className="border-b border-line p-4">
        <div className="relative max-w-sm">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brew/60"
          />
          <input
            className="input !pl-9"
            placeholder="Filter farms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {error && <p className="mt-3 text-sm text-cherry">{error}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-foam text-[10px] uppercase tracking-official text-brew">
            <tr>
              <th className="px-4 py-3">Farm</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Varieties</th>
              <th className="px-4 py-3 text-right">Area</th>
              <th className="px-4 py-3 text-right">Farmers</th>
              <th className="px-4 py-3 text-right">Nursery</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-t border-line hover:bg-foam/50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-bean">{f.name}</div>
                  <div className="text-[11px] text-brew">{f.id}</div>
                </td>
                <td className="px-4 py-3 text-roast">
                  {f.barangay}, {f.municipality}
                </td>
                <td className="px-4 py-3 text-roast">{(f.varieties || []).join(', ')}</td>
                <td className="px-4 py-3 text-right text-roast">{f.areaHectares} ha</td>
                <td className="px-4 py-3 text-right text-roast">{f.farmers?.count}</td>
                <td className="px-4 py-3 text-right text-roast">
                  {Number(f.motherGarden?.nurseryPlants || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="chip capitalize">{f.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/farms/${f.slug}`}
                      title="View public page"
                      className="rounded-lg px-2 py-1.5 text-brew hover:bg-foam"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      href={`/admin/farms/${f.id}`}
                      title="Edit"
                      className="rounded-lg px-2 py-1.5 text-brew hover:bg-foam"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                    <button
                      title="Delete"
                      disabled={readOnly || pendingId === f.id}
                      onClick={() => remove(f)}
                      className="rounded-lg px-2 py-1.5 text-cherry hover:bg-cherry/10 disabled:opacity-40"
                    >
                      <FontAwesomeIcon
                        icon={pendingId === f.id ? faSpinner : faTrash}
                        spin={pendingId === f.id}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-brew">
                  No farms match that filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
