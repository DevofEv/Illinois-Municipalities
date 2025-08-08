#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

async function fetchCensusData(_fips) {
  // TODO: Integrate real Census API
  return { demographics: { medianAge: 35 }, economics: { perCapitaIncome: 39000 } };
}

async function fetchStateData(_name) {
  // TODO: Integrate state sources
  return { taxes: { salesTaxRate: 0.1025 } };
}

async function fetchHistoricalData(_id) {
  // TODO: Integrate IL archives
  return { history: { founded: 1833, incorporated: 1837 } };
}

function mergeMunicipalityData(base, ...partials) {
  return partials.reduce((acc, part) => ({
    ...acc,
    ...part,
    population: { ...acc.population, ...(part.population ?? {}) },
    economics: { ...acc.economics, ...(part.economics ?? {}) },
    demographics: { ...(acc.demographics ?? {}), ...(part.demographics ?? {}) },
    government: { ...acc.government, ...(part.government ?? {}) },
    taxes: { ...(acc.taxes ?? {}), ...(part.taxes ?? {}) },
    infrastructure: { ...(acc.infrastructure ?? {}), ...(part.infrastructure ?? {}) },
    history: { ...(acc.history ?? {}), ...(part.history ?? {}) },
    links: { ...(acc.links ?? {}), ...(part.links ?? {}) },
  }), base);
}

async function main() {
  const dataPath = resolve(process.cwd(), 'public/data/municipalities.json');
  const raw = await readFile(dataPath, 'utf8');
  const list = JSON.parse(raw);

  const enriched = [];
  for (const m of list) {
    const [census, state, historical] = await Promise.all([
      fetchCensusData(m.fipsCode),
      fetchStateData(m.name),
      fetchHistoricalData(m.id),
    ]);
    enriched.push(mergeMunicipalityData(m, census, state, historical));
  }

  await writeFile(dataPath, JSON.stringify(enriched, null, 2));
  console.log(`Enriched ${enriched.length} municipalities`);
}

main().catch((e) => {
  console.error('Enrichment failed', e);
  process.exit(1);
});