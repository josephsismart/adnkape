'use client';

import { useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot,
  faSeedling,
  faMountainSun,
  faUsers,
  faRulerCombined,
  faMagnifyingGlass,
  faCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import { ADN_CENTER, ADN_ZOOM } from '@/lib/schema';

const STATUS_COLOR = {
  active: '#6F4E37',
  expansion: '#4F7942',
  pilot: '#B23A2E',
  dormant: '#8A8A8A',
};

function pinIcon(status) {
  const color = STATUS_COLOR[status] || STATUS_COLOR.active;
  return L.divIcon({
    className: 'adn-pin',
    html: `
      <div style="transform:translate(-50%,-100%);filter:drop-shadow(0 3px 5px rgba(43,27,18,.45))">
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 10.6 13.2 23.5 13.8 24.1a1.7 1.7 0 0 0 2.4 0C16.8 38.5 30 25.6 30 15 30 6.7 23.3 0 15 0z" fill="${color}"/>
          <path d="M15 0C6.7 0 0 6.7 0 15c0 10.6 13.2 23.5 13.8 24.1a1.7 1.7 0 0 0 2.4 0C16.8 38.5 30 25.6 30 15 30 6.7 23.3 0 15 0z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/>
          <ellipse cx="15" cy="14.6" rx="5.2" ry="6.8" fill="#F3E9DD"/>
          <path d="M15 8.2c1.7 2.7 1.7 10.1 0 12.8" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
      </div>`,
    iconSize: [30, 40],
    iconAnchor: [0, 0],
    popupAnchor: [0, -38],
  });
}

function FlyTo({ target }) {
  const map = useMap();
  if (target) map.flyTo([target.lat, target.lng], 13, { duration: 1.1 });
  return null;
}

export default function FarmMap({ farms, height = '620px' }) {
  const [query, setQuery] = useState('');
  const [municipality, setMunicipality] = useState('all');
  const [variety, setVariety] = useState('all');
  const [target, setTarget] = useState(null);

  const municipalities = useMemo(
    () => Array.from(new Set(farms.map((f) => f.municipality))).sort(),
    [farms]
  );
  const varieties = useMemo(
    () => Array.from(new Set(farms.flatMap((f) => f.varieties || []))).sort(),
    [farms]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farms.filter((f) => {
      if (municipality !== 'all' && f.municipality !== municipality) return false;
      if (variety !== 'all' && !(f.varieties || []).includes(variety)) return false;
      if (!q) return true;
      return [f.name, f.barangay, f.municipality, f.soilType, ...(f.varieties || [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [farms, query, municipality, variety]);

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      {/* Sidebar */}
      <div className="flex flex-col gap-3">
        <div className="card !p-4">
          <div className="relative mb-3">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brew/60"
            />
            <input
              className="input !pl-9"
              placeholder="Search farm, barangay, variety…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              className="input !py-1.5"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
            >
              <option value="all">All municipalities</option>
              {municipalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className="input !py-1.5"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
            >
              <option value="all">All varieties</option>
              {varieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-brew">
            {Object.entries(STATUS_COLOR).map(([k, c]) => (
              <span key={k} className="inline-flex items-center gap-1.5 capitalize">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                {k}
              </span>
            ))}
          </div>
        </div>

        <div
          className="scroll-slim flex-1 space-y-2 overflow-y-auto pr-1"
          style={{ maxHeight: height }}
        >
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-brew">
            {visible.length} farm{visible.length === 1 ? '' : 's'}
          </p>
          {visible.map((f) => (
            <button
              key={f.id}
              onClick={() => setTarget({ ...f.geotag, id: f.id })}
              className="w-full rounded-lg border border-line bg-white p-3.5 text-left transition hover:border-crema hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-bean">{f.name}</div>
                  <div className="text-xs text-brew">
                    Brgy. {f.barangay}, {f.municipality}
                  </div>
                </div>
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: STATUS_COLOR[f.status] }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(f.varieties || []).map((v) => (
                  <span key={v} className="chip">
                    <FontAwesomeIcon icon={faMugHot} className="text-[9px]" />
                    {v}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-4 text-[11px] text-roast/80">
                <span>
                  <FontAwesomeIcon icon={faRulerCombined} className="mr-1" />
                  {f.areaHectares} ha
                </span>
                <span>
                  <FontAwesomeIcon icon={faUsers} className="mr-1" />
                  {f.farmers?.count} farmers
                </span>
                <span>
                  <FontAwesomeIcon icon={faMountainSun} className="mr-1" />
                  {f.geotag?.elevationMasl} m
                </span>
              </div>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-brew">
              No farms match these filters.
            </p>
          )}
        </div>
      </div>

      {/* Map */}
      <div
        className="overflow-hidden rounded-xl border border-line shadow-soft"
        style={{ height }}
      >
        <MapContainer
          center={[ADN_CENTER.lat, ADN_CENTER.lng]}
          zoom={ADN_ZOOM}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <FlyTo target={target} />

          {visible.map((f) => (
            <Marker
              key={f.id}
              position={[f.geotag.lat, f.geotag.lng]}
              icon={pinIcon(f.status)}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <div className="font-display text-base font-bold text-bean">{f.name}</div>
                  <div className="mb-2 text-xs text-brew">
                    Brgy. {f.barangay}, {f.municipality}
                  </div>
                  <dl className="space-y-1 text-xs text-bean">
                    <div>
                      <FontAwesomeIcon icon={faMugHot} className="mr-1.5 text-brew" />
                      {(f.varieties || []).join(', ')}
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faRulerCombined} className="mr-1.5 text-brew" />
                      {f.areaHectares} ha · {f.soilType}
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faUsers} className="mr-1.5 text-brew" />
                      {f.farmers?.count} farmers
                    </div>
                    {f.motherGarden?.exists && (
                      <div>
                        <FontAwesomeIcon icon={faSeedling} className="mr-1.5 text-leaf" />
                        {f.motherGarden.type} ·{' '}
                        {Number(f.motherGarden.nurseryPlants).toLocaleString()} plants
                      </div>
                    )}
                    <div>
                      <FontAwesomeIcon icon={faCrosshairs} className="mr-1.5 text-brew" />
                      {f.geotag.lat}, {f.geotag.lng}
                    </div>
                  </dl>
                  <Link
                    href={`/farms/${f.slug}`}
                    className="mt-3 inline-block rounded-lg bg-brew px-3 py-1.5 text-xs font-semibold !text-milk no-underline"
                  >
                    View full profile
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
