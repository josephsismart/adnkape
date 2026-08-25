import { NextResponse } from 'next/server';
import { checkCredentials, createToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createToken(username), sessionCookieOptions());
  return res;
}
