import type * as GeoJSON from 'geojson';

export interface Municipality {
  id: string;
  fipsCode: string;
  gnisId: string;

  name: string;
  type: "City" | "Village" | "Town" | "CDP";
  county: string;
  incorporationStatus: "Incorporated" | "Unincorporated";
  incorporationDate?: string;

  coordinates: {
    lat: number;
    lng: number;
  };
  boundaries?: GeoJSON.Geometry;
  landArea: number; // square miles
  waterArea: number;
  totalArea: number;
  elevation: number; // feet

  population: {
    current: number;
    census2020: number;
    census2010: number;
    census2000: number;
    growthRate: number;
    density: number; // per square mile
  };

  economics: {
    medianHouseholdIncome: number;
    medianHomeValue: number;
    povertyRate: number;
    unemploymentRate: number;
  };

  government: {
    type: string;
    mayor?: string;
    website?: string;
    phone?: string;
    address?: string;
  };

  lastUpdated: string;
  dataSource: string;
  searchTokens: string;
}