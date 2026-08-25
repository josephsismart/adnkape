import FarmForm from '@/components/FarmForm';

export const metadata = { title: 'Add farm — ADN Kape admin' };

export default function NewFarmPage() {
  return <FarmForm mode="create" />;
}
