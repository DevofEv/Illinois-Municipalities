#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs/promises');
const path = require('path');
const { URLSearchParams } = require('url');

const CENSUS_API = {
  base: 'https://api.census.gov/data',
  datasets: {
    acs5_2022: '2022/acs/acs5',
    decennial_2020_pl: '2020/dec/pl',
    decennial_2010_sf1: '2010/dec/sf1',
    decennial_2000_sf1: '2000/dec/sf1',
    pep_timeseries: 'timeseries/pep/population',
  },
  variables: {
    // ACS 5-year
    total_population: 'B01003_001E',
    median_household_income: 'B19013_001E',
    median_home_value: 'B25077_001E',
    median_age: 'B01002_001E',
    // Decennial
    total_pop_2020: 'P1_001N',
    total_pop_decennial: 'P001001', // 2010/2000
    // PEP
    pep_population: 'POP',
  },
};

const IL_STATE_FIPS = '17';
const DATA_DIR = path.join(process.cwd(), 'data', 'municipalities');
const API_KEY = process.env.CENSUS_API_KEY || '';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildUrl(dataset, params) {
  const qs = new URLSearchParams(params);
  if (API_KEY) qs.set('key', API_KEY);
  return `${CENSUS_API.base}/${dataset}?${qs.toString()}`;
}

async function fetchCensus(endpoint, params, { retry = 2 } = {}) {
  const url = buildUrl(endpoint, params);
  for (let attempt = 0; attempt <= retry; attempt += 1) {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      return json;
    }
    if (attempt < retry && res.status >= 500) {
      await sleep(400 * (attempt + 1));
      continue;
    }
    const text = await res.text();
    throw new Error(`Census API error ${res.status} at ${url}: ${text}`);
  }
}

function normalizeNameKey(nameWithType) {
  // Example: "Chicago city, Illinois" -> { name: 'chicago', type: 'city' }
  const base = nameWithType.replace(/,\s*Illinois.*/i, '').trim();
  const parts = base.split(/\s+/);
  const typeCandidate = parts[parts.length - 1].toLowerCase();
  const maybeTypes = new Set(['city', 'village', 'town', 'township', 'borough']);
  let type = '';
  let nameOnly = base;
  if (maybeTypes.has(typeCandidate)) {
    type = typeCandidate;
    nameOnly = parts.slice(0, -1).join(' ');
  }
  return { name: nameOnly.toLowerCase(), type };
}

function seedKey(name, type) {
  return `${name}`.toLowerCase() + (type ? `|${type.toLowerCase()}` : '');
}

let placeIndexCache = null;
async function getIlPlacesIndex() {
  if (placeIndexCache) return placeIndexCache;
  const rows = await fetchCensus(CENSUS_API.datasets.decennial_2020_pl, {
    get: ['NAME'].join(','),
    for: 'place:*',
    in: `state:${IL_STATE_FIPS}`,
  });
  // rows[0] is header [ 'NAME', 'state', 'place' ]
  const header = rows[0];
  const idxName = header.indexOf('NAME');
  const idxPlace = header.indexOf('place');
  const mapByKey = new Map();
  const mapByNameOnly = new Map();
  for (let i = 1; i < rows.length; i += 1) {
    const r = rows[i];
    const name = r[idxName];
    const place = r[idxPlace];
    const { name: n, type } = normalizeNameKey(name);
    if (n) {
      if (type) mapByKey.set(seedKey(n, type), place);
      if (!mapByNameOnly.has(n)) mapByNameOnly.set(n, []);
      mapByNameOnly.get(n).push({ place, type });
    }
  }
  placeIndexCache = { mapByKey, mapByNameOnly };
  return placeIndexCache;
}

async function resolvePlaceCode(name, type) {
  const index = await getIlPlacesIndex();
  const key = seedKey(name, type);
  if (index.mapByKey.has(key)) return index.mapByKey.get(key);
  const candidates = index.mapByNameOnly.get(name.toLowerCase());
  if (candidates && candidates.length === 1) return candidates[0].place;
  // If multiple, try prefer city > village > town
  if (candidates && candidates.length > 1) {
    const pref = ['city', 'village', 'town'];
    for (const p of pref) {
      const match = candidates.find((c) => c.type === p);
      if (match) return match.place;
    }
    return candidates[0].place;
  }
  return null;
}

async function fetchPopulationPEP(place) {
  // Use timeseries to get latest year population
  const data = await fetchCensus(CENSUS_API.datasets.pep_timeseries, {
    get: ['NAME', CENSUS_API.variables.pep_population, 'time'].join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const header = data[0];
  const idxPop = header.indexOf(CENSUS_API.variables.pep_population);
  const idxTime = header.indexOf('time');
  let latest = null;
  for (let i = 1; i < data.length; i += 1) {
    const row = data[i];
    const year = Number(row[idxTime]);
    const pop = Number(row[idxPop] || 0) || null;
    if (!latest || year > latest.year) latest = { year, pop };
  }
  return latest?.pop ?? null;
}

async function fetchACS(place) {
  const vars = [
    'NAME',
    CENSUS_API.variables.total_population,
    CENSUS_API.variables.median_household_income,
    CENSUS_API.variables.median_home_value,
    CENSUS_API.variables.median_age,
  ];
  const data = await fetchCensus(CENSUS_API.datasets.acs5_2022, {
    get: vars.join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const header = data[0];
  const row = data[1];
  const getNum = (v) => {
    const i = header.indexOf(v);
    return Number(row?.[i] || 0) || null;
  };
  return {
    total_population: getNum(CENSUS_API.variables.total_population),
    median_household_income: getNum(CENSUS_API.variables.median_household_income),
    median_home_value: getNum(CENSUS_API.variables.median_home_value),
    median_age: getNum(CENSUS_API.variables.median_age),
  };
}

async function fetchDecennial(place) {
  // 2020
  const d2020 = await fetchCensus(CENSUS_API.datasets.decennial_2020_pl, {
    get: ['NAME', CENSUS_API.variables.total_pop_2020].join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const idx2020 = d2020[0].indexOf(CENSUS_API.variables.total_pop_2020);
  const pop2020 = Number(d2020?.[1]?.[idx2020] || 0) || null;
  // 2010
  const d2010 = await fetchCensus(CENSUS_API.datasets.decennial_2010_sf1, {
    get: ['NAME', CENSUS_API.variables.total_pop_decennial].join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const idx2010 = d2010[0].indexOf(CENSUS_API.variables.total_pop_decennial);
  const pop2010 = Number(d2010?.[1]?.[idx2010] || 0) || null;
  // 2000
  const d2000 = await fetchCensus(CENSUS_API.datasets.decennial_2000_sf1, {
    get: ['NAME', CENSUS_API.variables.total_pop_decennial].join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const idx2000 = d2000[0].indexOf(CENSUS_API.variables.total_pop_decennial);
  const pop2000 = Number(d2000?.[1]?.[idx2000] || 0) || null;
  return { pop2020, pop2010, pop2000 };
}

async function fetchACSDetailEconomics(place) {
  const vars = [
    'NAME',
    'B19013_001E', // median household income
    'B19113_001E', // median family income
    'B19301_001E', // per capita income
    'B25077_001E', // median home value
    'B25064_001E', // median gross rent
  ];
  const data = await fetchCensus(CENSUS_API.datasets.acs5_2022, {
    get: vars.join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const header = data[0];
  const row = data[1];
  const getNum = (v) => {
    const i = header.indexOf(v);
    return Number(row?.[i] || 0) || null;
  };
  return {
    median_household_income: getNum('B19013_001E'),
    median_family_income: getNum('B19113_001E'),
    per_capita_income: getNum('B19301_001E'),
    median_home_value: getNum('B25077_001E'),
    median_rent: getNum('B25064_001E'),
  };
}

async function fetchACSSubjectIndicators(place) {
  // Subject tables for unemployment, poverty, education levels
  const subjectDataset = '2022/acs/acs5/subject';
  const vars = [
    'NAME',
    'S2301_C04_001E', // Unemployment rate
    'S1701_C02_001E', // Poverty rate (% of people in poverty)
    'S1501_C02_001E', // Percent high school graduate or higher (25 years and over)
    'S1501_C02_015E', // Percent bachelor's degree or higher (25 years and over)
    'S1501_C02_016E', // Percent graduate or professional degree (25 years and over)
  ];
  const data = await fetchCensus(subjectDataset, {
    get: vars.join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const header = data[0];
  const row = data[1];
  const getNum = (v) => {
    const i = header.indexOf(v);
    const raw = row?.[i];
    const val = Number(raw);
    if (!Number.isFinite(val)) return null;
    if (val < 0 || val > 100) return null;
    return Number((val / 100).toFixed(6));
  };
  return {
    unemployment_rate: getNum('S2301_C04_001E'),
    poverty_rate: getNum('S1701_C02_001E'),
    education: {
      high_school_graduate: getNum('S1501_C02_001E'),
      bachelors_degree: getNum('S1501_C02_015E'),
      graduate_degree: getNum('S1501_C02_016E'),
    },
  };
}

async function fetchACSRaceComposition(place) {
  // B03002 Hispanic Origin by Race
  const vars = [
    'NAME',
    'B03002_001E', // total
    'B03002_003E', // White alone
    'B03002_004E', // Black or African American alone
    'B03002_006E', // Asian alone
    'B03002_012E', // Hispanic or Latino
  ];
  const data = await fetchCensus(CENSUS_API.datasets.acs5_2022, {
    get: vars.join(','),
    for: `place:${place}`,
    in: `state:${IL_STATE_FIPS}`,
  });
  const header = data[0];
  const row = data[1];
  const val = (code) => Number(row?.[header.indexOf(code)] || 0) || 0;
  const total = val('B03002_001E');
  if (!total) return null;
  const white = val('B03002_003E') / total;
  const black = val('B03002_004E') / total;
  const asian = val('B03002_006E') / total;
  const hispanic = val('B03002_012E') / total;
  let other = 1 - (white + black + asian + hispanic);
  other = Math.max(0, Number(other.toFixed(6)));
  return { white, black, asian, hispanic, other };
}

async function fetchCensusDataByName(name, type) {
  const place = await resolvePlaceCode(name, type);
  if (!place) {
    return { errors: [`Could not resolve place code for ${name} (${type || 'unknown type'})`] };
  }
  let pep = null;
  try {
    pep = await fetchPopulationPEP(place);
  } catch (e) {
    console.warn(`[${name}] PEP fetch failed:`, e.message);
  }
  const [acs, dec, econ, subj, race] = await Promise.all([
    fetchACS(place),
    fetchDecennial(place),
    fetchACSDetailEconomics(place),
    fetchACSSubjectIndicators(place),
    fetchACSRaceComposition(place),
  ]);
  const current = pep ?? acs.total_population ?? null;
  return {
    population: {
      current,
      census_2020: dec.pop2020,
      census_2010: dec.pop2010,
      census_2000: dec.pop2000,
      estimate_year: 2023,
      growth_rate: computeGrowthRate(dec.pop2010, current),
    },
    economics: {
      median_household_income: econ.median_household_income,
      median_family_income: econ.median_family_income,
      per_capita_income: econ.per_capita_income,
      median_home_value: econ.median_home_value,
      median_rent: econ.median_rent,
      poverty_rate: subj.poverty_rate ?? null,
      unemployment_rate: subj.unemployment_rate ?? null,
    },
    demographics: {
      median_age: acs.median_age,
      racial_composition: race || undefined,
      education: {
        high_school_graduate: subj.education?.high_school_graduate ?? null,
        bachelors_degree: subj.education?.bachelors_degree ?? null,
        graduate_degree: subj.education?.graduate_degree ?? null,
      },
    },
    _meta: { place, fetched_at: new Date().toISOString() },
  };
}

function computeGrowthRate(base, current) {
  if (!base || !current) return null;
  const years = 13; // 2010 -> 2023
  const rate = Math.pow(current / base, 1 / years) - 1;
  return Number(rate.toFixed(6));
}

async function fetchStateData(/* name */) {
  // Placeholder for IL sources
  return {};
}

async function fetchHistoricalData(/* id */) {
  // Placeholder; could scrape/ingest curated history
  return {};
}

async function fetchGovernmentInfo(/* website */) {
  // Placeholder; manual/curated or municipal APIs
  return {};
}

function mergeMunicipalityData(base, census, state, historical, govt) {
  const out = {
    ...base,
    population: { ...(base.population || {}), ...(census.population || {}) },
    geography: { ...(base.geography || {}) },
    economics: { ...(base.economics || {}), ...(census.economics || {}) },
    demographics: { ...(base.demographics || {}), ...(census.demographics || {}) },
    government: { ...(base.government || {}), ...(govt || {}) },
    history: { ...(base.history || {}), ...(historical || {}) },
    links: { ...(base.links || {}) },
    _meta: { ...(base._meta || {}), ...(census._meta || {}), source: 'census+state' },
  };
  // Derive density if possible
  if (out.population?.current && out.geography?.land_area_sq_mi && !out.geography.population_density) {
    out.geography.population_density = Number((out.population.current / out.geography.land_area_sq_mi).toFixed(1));
  }
  return validateMunicipality(out);
}

function validateMunicipality(m) {
  const required = ['id', 'name', 'type', 'county'];
  for (const key of required) {
    if (!m[key]) throw new Error(`Missing required field: ${key}`);
  }
  // Coerce numeric fields safely
  if (m.population) {
    for (const k of ['current', 'census_2020', 'census_2010', 'census_2000']) {
      if (m.population[k] != null) m.population[k] = Number(m.population[k]);
    }
    if (m.population.growth_rate != null) m.population.growth_rate = Number(m.population.growth_rate);
    if (!m.population.estimate_year && m.population.current) m.population.estimate_year = 2023;
  }
  return m;
}

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function enrichMunicipalityData(municipality) {
  const census = await fetchCensusDataByName(municipality.name, municipality.type);
  const [state, historical, govt] = await Promise.all([
    fetchStateData(municipality.name),
    fetchHistoricalData(municipality.id),
    fetchGovernmentInfo(municipality.website),
  ]);
  return mergeMunicipalityData(municipality, census, state, historical, govt);
}

async function loadSeed() {
  // If a seed file exists, use it; else inline minimal seeds
  const seedFile = path.join(process.cwd(), 'data', 'seed.json');
  try {
    const content = await fs.readFile(seedFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [
      { id: 'chicago', name: 'Chicago', type: 'City', county: 'Cook' },
      { id: 'springfield', name: 'Springfield', type: 'City', county: 'Sangamon' },
      { id: 'naperville', name: 'Naperville', type: 'City', county: 'DuPage' },
      { id: 'aurora', name: 'Aurora', type: 'City', county: 'Kane' },
      { id: 'evanston', name: 'Evanston', type: 'City', county: 'Cook' },
    ];
  }
}

async function writeStateSummary(munis) {
  if (!munis.length) return;
  const sum = (arr, sel) => arr.reduce((a, m) => a + (sel(m) ?? 0), 0);
  const n = munis.length;
  const safeAvg = (sel) => {
    const vals = munis.map(sel).filter((v) => typeof v === 'number' && Number.isFinite(v));
    if (!vals.length) return null;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  };
  const state = {
    population: { current_avg: safeAvg((m) => m.population?.current) },
    economics: {
      median_household_income_avg: safeAvg((m) => m.economics?.median_household_income),
      per_capita_income_avg: safeAvg((m) => m.economics?.per_capita_income),
      median_home_value_avg: safeAvg((m) => m.economics?.median_home_value),
      median_rent_avg: safeAvg((m) => m.economics?.median_rent),
      poverty_rate_avg: safeAvg((m) => m.economics?.poverty_rate),
      unemployment_rate_avg: safeAvg((m) => m.economics?.unemployment_rate),
    },
    demographics: {
      median_age_avg: safeAvg((m) => m.demographics?.median_age),
    }
  };
  const outdir = path.join(process.cwd(), 'data');
  await fs.writeFile(path.join(outdir, 'state-averages.json'), JSON.stringify(state, null, 2));
}

async function main() {
  await ensureDirs();
  const seed = await loadSeed();
  const outputs = [];
  for (const m of seed) {
    try {
      const enriched = await enrichMunicipalityData(m);
      const outfile = path.join(DATA_DIR, `${m.id}.json`);
      await fs.writeFile(outfile, JSON.stringify(enriched, null, 2));
      outputs.push(enriched);
      console.log('Wrote', outfile);
    } catch (err) {
      console.error(`[${m.name}] Failed to enrich:`, err.message);
    }
  }
  await writeStateSummary(outputs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});