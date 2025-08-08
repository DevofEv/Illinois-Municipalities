import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data', 'municipalities');

export async function loadMunicipalityList() {
  try {
    const files = await fs.readdir(DATA_DIR);
    const municipalities = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const contents = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
      const json = JSON.parse(contents);
      municipalities.push({ id: json.id, name: json.name, type: json.type, county: json.county });
    }
    municipalities.sort((a, b) => a.name.localeCompare(b.name));
    return municipalities;
  } catch (err) {
    // Fallback: sample list
    return [
      { id: 'chicago', name: 'Chicago', type: 'City', county: 'Cook' },
      { id: 'springfield', name: 'Springfield', type: 'City', county: 'Sangamon' },
    ];
  }
}

export async function loadMunicipalityData(id) {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const contents = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(contents);
  } catch (err) {
    if (id === 'chicago') {
      return SAMPLE_CHICAGO;
    }
    return null;
  }
}

const SAMPLE_CHICAGO = {
  id: 'chicago',
  name: 'Chicago',
  type: 'City',
  county: 'Cook',
  population: {
    current: 2695598,
    census_2020: 2746388,
    census_2010: 2695598,
    census_2000: 2896016,
    census_1990: 2783726,
    estimate_year: 2023,
    growth_rate: -0.018,
  },
  geography: {
    land_area_sq_mi: 227.73,
    water_area_sq_mi: 6.88,
    total_area_sq_mi: 234.61,
    population_density: 11841.8,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    elevation_ft: 597,
    timezone: 'America/Chicago',
  },
  economics: {
    median_household_income: 62097,
    median_family_income: 75649,
    per_capita_income: 39056,
    poverty_rate: 0.178,
    unemployment_rate: 0.062,
    median_home_value: 284900,
    median_rent: 1195,
  },
  demographics: {
    median_age: 34.8,
    male_percentage: 0.487,
    female_percentage: 0.513,
    racial_composition: {
      white: 0.453,
      black: 0.297,
      asian: 0.067,
      hispanic: 0.291,
      other: 0.183,
    },
    education: {
      high_school_graduate: 0.843,
      bachelors_degree: 0.389,
      graduate_degree: 0.147,
    },
  },
  government: {
    incorporation_date: '1837-03-04',
    government_type: 'Mayor-Council',
    mayor: { name: 'Brandon Johnson', party: 'Democratic', term_ends: '2027-05-20' },
    city_council_size: 50,
    website: 'https://www.chicago.gov',
    phone: '(312) 744-3300',
    address: {
      street: '121 N LaSalle St',
      city: 'Chicago',
      state: 'IL',
      zip: '60602',
    },
  },
  taxes: {
    sales_tax_rate: 0.1025,
    property_tax_rate: 0.0267,
    income_tax_local: 0,
    business_tax: 'varies',
  },
  infrastructure: {
    schools: { elementary: 478, middle: 125, high: 106, school_district: 'Chicago Public Schools' },
    transportation: {
      has_public_transit: true,
      major_highways: ['I-90', 'I-94', 'I-55', 'I-57'],
      airports: ['ORD', 'MDW'],
      train_stations: ['Union Station', 'Ogilvie'],
    },
    utilities: { electricity_provider: 'ComEd', gas_provider: 'Peoples Gas', water_provider: 'Chicago Water Department' },
  },
  history: {
    founded: 1833,
    incorporated: 1837,
    historical_events: [
      { year: 1871, event: 'Great Chicago Fire' },
      { year: 1893, event: "World's Columbian Exposition" },
    ],
  },
  links: {
    wikipedia: 'https://en.wikipedia.org/wiki/Chicago',
    census: 'https://data.census.gov/profile/Chicago_city,_Illinois',
    state_profile: 'https://www.illinois.gov/cities/chicago',
  },
};