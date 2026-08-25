/**
 * Edge-runtime-safe token verification for middleware.
 *
 * Next.js middleware runs on the Edge Runtime, where Node's `crypto` module is
 * unavailable — so this mirrors lib/auth.js using Web Crypto instead.
 * Keep the signing scheme here identical to lib/auth.js.
 */

export const COOKIE_NAME = 'adnkape_session';

function secret() {
  return process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-me';
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function base64urlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return decodeURIComponent(
    Array.from(bin)
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
}

async function sign(value) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

/** Constant-time-ish string comparison. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyTokenEdge(token) {
  if (!token || typeof token !== 'string') return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;

  let payload;
  try {
    payload = base64urlDecode(encoded);
  } catch {
    return null;
  }

  if (!safeEqual(sig, await sign(payload))) return null;

  const [username, expiry] = payload.split('.');
  if (!username || Number(expiry) < Date.now()) return null;
  return { username };
}
