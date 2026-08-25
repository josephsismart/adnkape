import { NextResponse } from 'next/server';
import { getFarms, createFarm } from '@/lib/store';
import { getSession } from '@/lib/auth';
import { normalizeFarm, validateFarm, slugify } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getFarms());
}

export async function POST(request) {
  if (!getSession()) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });

  const errors = validateFarm(body);
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

  const farm = normalizeFarm(body);
  farm.slug = farm.slug || slugify(farm.name);
  farm.id =
    farm.id ||
    `adn-${slugify(farm.municipality).slice(0, 3)}-${Date.now().toString(36).slice(-5)}`;

  try {
    const created = await createFarm(farm);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
