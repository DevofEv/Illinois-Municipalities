import { resolve } from "path";
import { readFile } from "fs/promises";
import type { Municipality } from "@/types/municipality";
import { MunicipalitySchema } from "@/types/municipality.schema";

const DATA_PATH = resolve(process.cwd(), "public/data/municipalities.json");

export async function getAllMunicipalities(): Promise<Municipality[]> {
  const raw = await readFile(DATA_PATH, "utf8");
  const json = JSON.parse(raw);
  const result = MunicipalitySchema.array().safeParse(json);
  if (!result.success) {
    console.warn("Invalid municipalities data:", result.error.message);
    return [];
  }
  return result.data as unknown as Municipality[];
}

export async function getMunicipalityByIdOrSlug(idOrSlug: string): Promise<Municipality | undefined> {
  const all = await getAllMunicipalities();
  const normalized = idOrSlug.trim().toLowerCase();
  return all.find((m) => {
    const idMatch = m.id?.toLowerCase() === normalized;
    const fipsMatch = m.fipsCode?.toLowerCase() === normalized;
    const slugMatch = (m.slug ?? slugify(m.name)).toLowerCase() === normalized;
    return idMatch || fipsMatch || slugMatch;
  });
}

export async function getStaticIds(): Promise<string[]> {
  const all = await getAllMunicipalities();
  return all.map((m) => m.id || slugify(m.name));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}