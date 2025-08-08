import { NextResponse } from "next/server";
import type { Municipality } from "@/types/municipality";

export const dynamic = "force-static";

export async function GET() {
  // Static export cannot support query-based APIs; search is handled client-side.
  return NextResponse.json<Municipality[]>([]);
}