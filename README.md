# ☕ ADN Kape — Agusan del Norte Coffee Farm Map

A Next.js app that maps and documents the coffee farms of Agusan del Norte:
geotag, variety, soil type, area, farmers, mother garden/nursery, seed
traceability, focal person, topography and planting materials — with a public
landing page + interactive map, and a password-protected admin panel for
managing the data.

---

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Server components for data, API routes for the admin |
| Styling | **Tailwind CSS** with a custom coffee palette | `bean`, `roast`, `brew`, `crema`, `foam`, `milk`, `leaf`, `cherry` |
| Icons | **Font Awesome** (`react-fontawesome`, free-solid) | as requested |
| Map | **Leaflet + OpenStreetMap** (`react-leaflet`) | free, no API key, no billing; OpenTopoMap layer for terrain |
| Data | **JSON file** (`data/farms.json`) | git-versioned, human-readable, easy to hand-edit |
| Auth | Signed HTTP-only cookie, credentials from env vars | no database needed |

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then edit it
npm run dev
```

Open <http://localhost:3000>.

`.env.local` at minimum:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pick-something-long
SESSION_SECRET=any-random-32+-character-string
```

Admin panel: <http://localhost:3000/admin>

---

## Project structure

```
app/
  page.js                     Landing page — hero, stats, map, field explainer
  farms/page.js               Farm directory grouped by municipality
  farms/[slug]/page.js        Full farm profile
  admin/page.js               Admin dashboard + farm table
  admin/login/page.js         Sign in
  admin/farms/new/page.js     Create farm
  admin/farms/[id]/page.js    Edit farm
  api/auth/login|logout       Session cookie
  api/farms                   GET all · POST create
  api/farms/[id]              GET one · PUT update · DELETE
components/
  FarmMap.js                  Leaflet map + filters + sidebar list
  MapSection.js               Client-only wrapper (Leaflet needs `window`)
  FarmForm.js                 The full farm data entry form
  AdminFarmTable.js           Searchable admin table with delete
  LogoutButton.js
lib/
  schema.js                   Field lists, validation, normalisation
  store.js                    THE data layer — swap this to move off JSON
  auth.js                     Node-side session helpers
  auth-edge.js                Web-Crypto twin used by middleware
data/
  farms.json                  ← all farm records live here
middleware.js                 Protects /admin/*
```

---

## The data model

Each record in `data/farms.json`:

```jsonc
{
  "id": "adn-lni-001",
  "name": "Sitio Malinao Coffee Farm",
  "slug": "sitio-malinao-coffee-farm",
  "status": "active",              // active | expansion | pilot | dormant
  "municipality": "Las Nieves",
  "barangay": "Malicato",
  "geotag":   { "lat": 8.7433, "lng": 125.6047, "elevationMasl": 620 },
  "areaHectares": 12.5,
  "varieties": ["Arabica (Typica)", "Robusta"],
  "soilType": "Clay loam",
  "farmers":  { "count": 34, "association": "...", "leadFarmer": "...", "notes": "" },
  "motherGarden": {
    "exists": true, "type": "Nursery", "name": "...",
    "nurseryPlants": 18000, "establishedYear": 2022
  },
  "seedTraceability": {
    "source": "immediate nursery/office",
    "origin": "where that stock ultimately came from",
    "batch": "ARB-2022-014", "yearAcquired": 2022,
    "certification": "DA-BPI accredited source"
  },
  "focalPerson": { "name": "...", "position": "...", "office": "...", "contact": "..." },
  "topography":  { "terrain": "...", "slopePercent": "18–30%",
                   "elevationRangeMasl": "540–720", "climate": "Type II" },
  "plantingMaterials": {
    "fertilizers": [], "soilAmendments": [], "pestManagement": [], "practices": []
  },
  "yieldEstimateKgPerYear": 9400,
  "photos": [], "notes": "",
  "createdAt": "2026-01-14", "updatedAt": "2026-08-01"
}
```

**The 12 fields you asked for map to:** geotag → `geotag` · variety →
`varieties` · soil type → `soilType` · area → `areaHectares` · farmers →
`farmers` · mother garden → `motherGarden` · nursery plant count →
`motherGarden.nurseryPlants` · seed traceability → `seedTraceability` · focal
person → `focalPerson` · topography → `topography` · planting materials →
`plantingMaterials`.

The 12 records currently in the file are **sample data** for demonstration.
Replace them with real figures from the LGU agriculture offices.

---

## Deploying to GitHub + Vercel

```bash
git init
git add .
git commit -m "feat: ADN Kape coffee farm map"
git branch -M main
git remote add origin https://github.com/<you>/adnkape.git
git push -u origin main
```

Then on Vercel: **Add New → Project → import the repo**. Framework is
auto-detected. Add these environment variables before deploying:

| Variable | Value |
|---|---|
| `ADMIN_USERNAME` | your admin username |
| `ADMIN_PASSWORD` | a long password |
| `SESSION_SECRET` | random 32+ characters |

### Making the admin panel writable in production

Vercel's filesystem is **read-only at runtime**, so the admin panel cannot save
back to `data/farms.json` the way it does locally. The app handles this by
committing changes to GitHub instead — which also triggers a redeploy, so the
site updates itself.

Create a fine-grained GitHub personal access token scoped to the `adnkape`
repo with **Contents: Read and write**, then add:

| Variable | Value |
|---|---|
| `GITHUB_TOKEN` | `github_pat_…` |
| `GITHUB_REPO` | `<you>/adnkape` |
| `GITHUB_BRANCH` | `main` |

The admin dashboard shows which mode it is in (local / GitHub / read-only).

---

## Moving to a real database later

Everything that touches storage lives in `lib/store.js` —
`getFarms`, `getFarmBySlug`, `createFarm`, `updateFarm`, `deleteFarm`.
Rewrite those five functions against Postgres/Neon/Supabase and nothing else
in the app has to change.

Worth doing once you have several people editing at the same time — the JSON
file has no locking, so two simultaneous saves can overwrite each other.

---

## Security notes

- Change `ADMIN_PASSWORD` and `SESSION_SECRET` before going public.
- Sessions expire after 8 hours.
- There is a single shared admin account. If you need per-office logins with an
  audit trail of who changed what, that's the point to move to a database and
  a real user table.
