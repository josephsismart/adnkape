import { notFound } from 'next/navigation';
import { getFarms } from '@/lib/store';
import FarmForm from '@/components/FarmForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const farm = (await getFarms()).find((f) => f.id === params.id);
  return { title: farm ? `Edit ${farm.name} — ADN Kape admin` : 'Edit farm — ADN Kape admin' };
}

export default async function EditFarmPage({ params }) {
  const farm = (await getFarms()).find((f) => f.id === params.id);
  if (!farm) notFound();
  return <FarmForm mode="edit" initial={farm} />;
}
