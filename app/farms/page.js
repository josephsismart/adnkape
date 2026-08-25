import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot,
  faUsers,
  faRulerCombined,
  faSeedling,
  faLocationDot,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { getFarms } from '@/lib/store';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Farm directory — ADN Kape' };

export default async function FarmsPage() {
  const farms = await getFarms();
  const byMunicipality = farms.reduce((acc, f) => {
    (acc[f.municipality] ||= []).push(f);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <p className="eyebrow mb-2">Registry</p>
      <h1 className="section-title">Farm directory</h1>
      <p className="lede mt-3 max-w-2xl">
        {farms.length} coffee farms across {Object.keys(byMunicipality).length} cities and
        municipalities of Agusan del Norte.
      </p>

      <div className="mt-12 space-y-14">
        {Object.keys(byMunicipality)
          .sort()
          .map((mun) => (
            <section key={mun}>
              <div className="mb-5 flex items-center gap-3">
                <h2 className="flex items-center gap-2 font-display text-xl font-bold text-bean">
                  <FontAwesomeIcon icon={faLocationDot} className="text-[15px] text-brew" />
                  {mun}
                </h2>
                <span className="chip">{byMunicipality[mun].length}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {byMunicipality[mun].map((f) => (
                  <Link key={f.id} href={`/farms/${f.slug}`} className="card group flex flex-col transition duration-200 hover:-translate-y-0.5 hover:border-crema hover:shadow-lift">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-bean group-hover:text-brew">
                        {f.name}
                      </h3>
                      <span className="chip capitalize">{f.status}</span>
                    </div>
                    <p className="text-xs text-brew">Brgy. {f.barangay}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(f.varieties || []).map((v) => (
                        <span key={v} className="chip">
                          <FontAwesomeIcon icon={faMugHot} className="text-[9px]" />
                          {v}
                        </span>
                      ))}
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-roast/85">
                      <div>
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-1.5 text-brew" />
                        {f.areaHectares} ha
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faUsers} className="mr-1.5 text-brew" />
                        {f.farmers?.count} farmers
                      </div>
                      <div className="col-span-2">
                        <FontAwesomeIcon icon={faSeedling} className="mr-1.5 text-leaf" />
                        {f.motherGarden?.exists
                          ? `${f.motherGarden.type} · ${Number(
                              f.motherGarden.nurseryPlants
                            ).toLocaleString()} plants`
                          : 'No mother garden on site'}
                      </div>
                    </dl>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brew">
                      View profile <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
