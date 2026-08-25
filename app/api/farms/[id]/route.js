import { NextResponse } from 'next/server';
import { getFarms, updateFarm, deleteFarm } from '@/lib/store';
import { getSession } from '@/lib/auth';
import { normalizeFarm, validateFarm } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const farms = await getFarms();
  const farm = farms.find((f) => f.id === params.id);
  if (!farm) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(farm);
}

export async function PUT(request, { params }) {
  if (!getSession()) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });

  const errors = validateFarm(body);
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

  try {
    const updated = await updateFarm(params.id, normalizeFarm(body));
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  if (!getSession()) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  try {
    await deleteFarm(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
