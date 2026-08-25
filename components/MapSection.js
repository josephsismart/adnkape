'use client';

import dynamic from 'next/dynamic';

// Leaflet touches `window`, so the map must never render on the server.
const FarmMap = dynamic(() => import('./FarmMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-[620px] place-items-center rounded-xl border border-line bg-foam/50 text-sm text-brew">
      Loading map…
    </div>
  ),
});

export default function MapSection({ farms, height }) {
  return <FarmMap farms={farms} height={height} />;
}
