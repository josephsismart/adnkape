/**
 * Data layer for ADN Kape.
 *
 * Reads always come from data/farms.json bundled with the app.
 *
 * Writes have two modes:
 *   1. LOCAL  — writes straight back to data/farms.json (works in `npm run dev`).
 *   2. GITHUB — commits the updated JSON to the repo through the GitHub
 *               Contents API. Required on Vercel, whose filesystem is read-only
 *               at runtime. Enable by setting GITHUB_TOKEN / GITHUB_REPO.
 *
 * Swapping to a real database later means rewriting only this file.
 */

import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'farms.json');
const GH_PATH = process.env.GITHUB_DATA_PATH || 'data/farms.json';

function githubConfigured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

export function storageMode() {
  if (githubConfigured()) return 'github';
  return process.env.VERCEL ? 'readonly' : 'local';
}

/* ------------------------------- reads ---------------------------------- */

export async function getFarms() {
  if (githubConfigured()) {
    const { content } = await ghGetFile();
    return JSON.parse(content);
  }
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function getFarmBySlug(slug) {
  const farms = await getFarms();
  return farms.find((f) => f.slug === slug || f.id === slug) || null;
}

/* ------------------------------- writes --------------------------------- */

export async function saveFarms(farms, message = 'chore(data): update farms') {
  const json = JSON.stringify(farms, null, 2) + '\n';

  if (githubConfigured()) {
    await ghPutFile(json, message);
    return { mode: 'github' };
  }

  if (process.env.VERCEL) {
    throw new Error(
      'Cannot write data on Vercel without GITHUB_TOKEN and GITHUB_REPO configured. ' +
        'See README — "Making the admin panel writable in production".'
    );
  }

  await fs.writeFile(DATA_PATH, json, 'utf8');
  return { mode: 'local' };
}

export async function createFarm(farm) {
  const farms = await getFarms();
  if (farms.some((f) => f.slug === farm.slug)) {
    throw new Error(`A farm with the slug "${farm.slug}" already exists.`);
  }
  const today = new Date().toISOString().slice(0, 10);
  const record = { ...farm, createdAt: today, updatedAt: today };
  farms.push(record);
  await saveFarms(farms, `feat(data): add farm ${farm.name}`);
  return record;
}

export async function updateFarm(id, farm) {
  const farms = await getFarms();
  const i = farms.findIndex((f) => f.id === id);
  if (i === -1) throw new Error(`Farm "${id}" not found.`);
  const record = {
    ...farms[i],
    ...farm,
    id: farms[i].id,
    createdAt: farms[i].createdAt,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  farms[i] = record;
  await saveFarms(farms, `chore(data): update farm ${record.name}`);
  return record;
}

export async function deleteFarm(id) {
  const farms = await getFarms();
  const next = farms.filter((f) => f.id !== id);
  if (next.length === farms.length) throw new Error(`Farm "${id}" not found.`);
  await saveFarms(next, `chore(data): remove farm ${id}`);
  return true;
}

/* --------------------------- GitHub transport --------------------------- */

async function ghGetFile() {
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const branch = process.env.GITHUB_BRANCH || 'main';
  const url = `https://api.github.com/repos/${repo}/contents/${GH_PATH}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return { content: Buffer.from(json.content, 'base64').toString('utf8'), sha: json.sha };
}

async function ghPutFile(content, message) {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const { sha } = await ghGetFile();
  const url = `https://api.github.com/repos/${repo}/contents/${GH_PATH}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      sha,
      branch,
    }),
  });
  if (!res.ok) throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  return res.json();
}

/* ------------------------------ statistics ------------------------------ */

export function summarize(farms) {
  const round = (n) => Math.round(n * 10) / 10;
  return {
    farms: farms.length,
    municipalities: new Set(farms.map((f) => f.municipality)).size,
    hectares: round(farms.reduce((s, f) => s + (Number(f.areaHectares) || 0), 0)),
    farmers: farms.reduce((s, f) => s + (Number(f.farmers?.count) || 0), 0),
    nurseryPlants: farms.reduce(
      (s, f) => s + (Number(f.motherGarden?.nurseryPlants) || 0),
      0
    ),
    varieties: new Set(farms.flatMap((f) => f.varieties || [])).size,
  };
}
