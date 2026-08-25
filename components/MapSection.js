'use client';

import dynamic from 'next/dynamic';

// Leaflet touches `window`, so the map must never render on the server.
const FarmMap = dynamic(() => import('./FarmMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-[620px] place-items-center rounded-2xl border border-crema/50 bg-crema/10 text-sm text-brew">
      Loading map…
    </div>
  ),
});

export default function MapSection({ farms, height }) {
  return <FarmMap farms={farms} height={height} />;
}
