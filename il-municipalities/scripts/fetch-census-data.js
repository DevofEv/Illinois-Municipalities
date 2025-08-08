#!/usr/bin/env node

import { writeFile, readFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const publicDataDir = resolve(__dirname, '../public/data');
  try { await mkdir(publicDataDir, { recursive: true }); } catch {}

  const samplePath = resolve(publicDataDir, 'municipalities.json');

  try {
    // Keep existing data if present
    const existing = await readFile(samplePath, 'utf8');
    if (existing?.length > 2) {
      console.log('Data exists; leaving as-is');
      return;
    }
  } catch {}

  const sample = [
    {
      id: '1714000',
      fipsCode: '1714000',
      gnisId: '2394867',
      name: 'Chicago',
      type: 'City',
      county: 'Cook',
      incorporationStatus: 'Incorporated',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      landArea: 227.34,
      waterArea: 7.31,
      totalArea: 234.65,
      elevation: 594,
      population: {
        current: 2700000,
        census2020: 2746388,
        census2010: 2695598,
        census2000: 2896016,
        growthRate: 0.02,
        density: 11875,
      },
      economics: {
        medianHouseholdIncome: 65000,
        medianHomeValue: 320000,
        povertyRate: 0.18,
        unemploymentRate: 0.06,
      },
      government: { type: 'Mayor-Council', website: 'https://www.chicago.gov' },
      lastUpdated: new Date().toISOString(),
      dataSource: 'Sample',
      searchTokens: 'chicago cook city',
    },
  ];

  await writeFile(samplePath, JSON.stringify(sample, null, 2));
  console.log('Wrote sample municipalities.json');
}

main().catch((e) => {
  console.error('Failed to prepare data', e);
  process.exit(0); // do not fail the build
});