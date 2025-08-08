import { NextResponse } from "next/server";
import type { Municipality } from "@/types/municipality";
import municipalitiesData from "@/public/data/municipalities.json" assert { type: "json" };

export const dynamic = "force-static";

const municipalities = municipalitiesData as unknown as Municipality[];

type FlatRow = {
  id: string;
  name: string;
  type: Municipality["type"];
  county: string;
  population_current: number | null;
  median_income: number | null;
  lat: number | null;
  lng: number | null;
};

function toCsv(rows: FlatRow[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]) as Array<keyof FlatRow>;
  const escape = (v: string | number | null) => {
    const s = v === null ? "" : String(v);
    return '"' + s.replaceAll('"', '""') + '"';
  };
  const lines: string[] = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h] as string | number | null)).join(","));
  }
  return lines.join("\n");
}

export async function GET() {
  const data = municipalities;
  const flat: FlatRow[] = data.map((m) => ({
    id: m.id,
    name: m.name,
    type: m.type,
    county: m.county,
    population_current: m.population?.current ?? null,
    median_income: m.economics?.medianHouseholdIncome ?? null,
    lat: m.coordinates?.lat ?? null,
    lng: m.coordinates?.lng ?? null,
  }));

  const csv = toCsv(flat);

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=municipalities.csv",
    },
  });
}