// Single source of truth for the ADN Kape farm record shape.
// Keep this in sync with data/farms.json and the admin form.

export const VARIETIES = [
  'Arabica (Typica)',
  'Arabica (Bourbon)',
  'Robusta',
  'Excelsa',
  'Liberica (Barako)',
];

export const SOIL_TYPES = [
  'Clay loam',
  'Sandy loam',
  'Sandy clay loam',
  'Silty clay',
  'Loam',
  'Alluvial loam',
  'Clay loam with gravel',
];

export const MUNICIPALITIES = [
  'Buenavista',
  'Butuan City',
  'Cabadbaran City',
  'Carmen',
  'Jabonga',
  'Kitcharao',
  'Las Nieves',
  'Magallanes',
  'Nasipit',
  'Remedios T. Romualdez',
  'Santiago',
  'Tubay',
];

export const STATUSES = ['active', 'expansion', 'pilot', 'dormant'];

export const MOTHER_GARDEN_TYPES = ['Nursery', 'Greenhouse', 'Screen house'];

// Map centre for Agusan del Norte
export const ADN_CENTER = { lat: 9.05, lng: 125.5 };
export const ADN_ZOOM = 9;

export function emptyFarm() {
  return {
    id: '',
    name: '',
    slug: '',
    status: 'active',
    municipality: '',
    barangay: '',
    geotag: { lat: '', lng: '', elevationMasl: '' },
    areaHectares: '',
    varieties: [],
    soilType: '',
    farmers: { count: '', association: '', leadFarmer: '', notes: '' },
    motherGarden: {
      exists: false,
      type: null,
      name: '',
      nurseryPlants: 0,
      establishedYear: '',
    },
    seedTraceability: {
      source: '',
      origin: '',
      batch: '',
      yearAcquired: '',
      certification: '',
    },
    focalPerson: { name: '', position: '', office: '', contact: '' },
    topography: {
      terrain: '',
      slopePercent: '',
      elevationRangeMasl: '',
      climate: '',
    },
    plantingMaterials: {
      fertilizers: [],
      soilAmendments: [],
      pestManagement: [],
      practices: [],
    },
    yieldEstimateKgPerYear: '',
    photos: [],
    notes: '',
  };
}

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Returns an array of human-readable problems; empty array means valid. */
export function validateFarm(farm) {
  const errors = [];
  if (!farm.name || !farm.name.trim()) errors.push('Farm name is required.');
  if (!farm.municipality) errors.push('City / municipality is required.');
  const lat = Number(farm?.geotag?.lat);
  const lng = Number(farm?.geotag?.lng);
  if (!Number.isFinite(lat) || lat < 4 || lat > 22)
    errors.push('Latitude must be a number within the Philippines (4–22).');
  if (!Number.isFinite(lng) || lng < 115 || lng > 128)
    errors.push('Longitude must be a number within the Philippines (115–128).');
  if (farm.areaHectares !== '' && !Number.isFinite(Number(farm.areaHectares)))
    errors.push('Area (hectares) must be a number.');
  return errors;
}

/** Coerce string form values into the right types before saving. */
export function normalizeFarm(farm) {
  const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
  const list = (v) =>
    Array.isArray(v)
      ? v.filter(Boolean)
      : String(v || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

  return {
    ...farm,
    slug: farm.slug || slugify(farm.name),
    areaHectares: num(farm.areaHectares),
    yieldEstimateKgPerYear: num(farm.yieldEstimateKgPerYear),
    varieties: list(farm.varieties),
    geotag: {
      lat: num(farm.geotag?.lat),
      lng: num(farm.geotag?.lng),
      elevationMasl: num(farm.geotag?.elevationMasl),
    },
    farmers: {
      ...farm.farmers,
      count: num(farm.farmers?.count) ?? 0,
    },
    motherGarden: {
      ...farm.motherGarden,
      exists: Boolean(farm.motherGarden?.exists),
      nurseryPlants: num(farm.motherGarden?.nurseryPlants) ?? 0,
      establishedYear: num(farm.motherGarden?.establishedYear),
    },
    seedTraceability: {
      ...farm.seedTraceability,
      yearAcquired: num(farm.seedTraceability?.yearAcquired),
    },
    plantingMaterials: {
      fertilizers: list(farm.plantingMaterials?.fertilizers),
      soilAmendments: list(farm.plantingMaterials?.soilAmendments),
      pestManagement: list(farm.plantingMaterials?.pestManagement),
      practices: list(farm.plantingMaterials?.practices),
    },
  };
}
