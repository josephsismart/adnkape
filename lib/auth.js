/**
 * Minimal signed-cookie session for the admin area.
 * No database, no third-party auth service — credentials come from env vars.
 *
 * Set in .env.local:
 *   ADMIN_USERNAME=admin
 *   ADMIN_PASSWORD=<something long>
 *   SESSION_SECRET=<random 32+ chars>
 */

import crypto from 'crypto';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'adnkape_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  return process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-me';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createToken(username) {
  const payload = `${username}.${Date.now() + MAX_AGE * 1000}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;
  let payload;
  try {
    payload = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [username, expiry] = payload.split('.');
  if (!username || Number(expiry) < Date.now()) return null;
  return { username };
}

export function checkCredentials(username, password) {
  const u = process.env.ADMIN_USERNAME || 'admin';
  const p = process.env.ADMIN_PASSWORD || 'adnkape2026';
  return username === u && password === p;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  };
}

/** Server-side helper: returns { username } or null. */
export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
