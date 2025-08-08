import type * as GeoJSON from 'geojson';

export interface Municipality {
  id: string;
  slug?: string;
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
    census1990?: number;
    estimateYear?: number;
    growthRate: number;
    density: number; // per square mile
  };

  economics: {
    medianHouseholdIncome: number;
    medianFamilyIncome?: number;
    perCapitaIncome?: number;
    medianHomeValue: number;
    medianRent?: number;
    povertyRate: number;
    unemploymentRate: number;
  };

  demographics?: {
    medianAge?: number;
    malePercentage?: number;
    femalePercentage?: number;
    racialComposition?: {
      white?: number;
      black?: number;
      asian?: number;
      hispanic?: number;
      other?: number;
    };
    education?: {
      highSchoolGraduate?: number;
      bachelorsDegree?: number;
      graduateDegree?: number;
    };
  };

  government: {
    type: string;
    mayor?: string | { name: string; party?: string; termEnds?: string };
    website?: string;
    phone?: string;
    address?: string | { street?: string; city?: string; state?: string; zip?: string };
    cityCouncilSize?: number;
  };

  taxes?: {
    salesTaxRate?: number;
    propertyTaxRate?: number;
    incomeTaxLocal?: number;
    businessTax?: string;
  };

  infrastructure?: {
    schools?: {
      elementary?: number;
      middle?: number;
      high?: number;
      schoolDistrict?: string;
    };
    transportation?: {
      hasPublicTransit?: boolean;
      majorHighways?: string[];
      airports?: string[];
      trainStations?: string[];
    };
    utilities?: {
      electricityProvider?: string;
      gasProvider?: string;
      waterProvider?: string;
    };
  };

  history?: {
    founded?: number;
    incorporated?: number;
    historicalEvents?: Array<{ year: number; event: string; title?: string; description?: string; image?: string; id?: string }>;
  };

  links?: {
    wikipedia?: string;
    census?: string;
    stateProfile?: string;
  };

  lastUpdated: string;
  dataSource: string;
  searchTokens: string;
}