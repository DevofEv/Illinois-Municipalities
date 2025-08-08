"use client";

import dynamic from "next/dynamic";
import data from "@/public/data/municipalities.json" assert { type: "json" };
import type { Municipality } from "@/types/municipality";

const MapView = dynamic(() => import("@/components/features/MapView/MapViewClient"), { ssr: false });

export default function MapPage() {
  const municipalities = (data as unknown as Municipality[]) ?? [];
  return (
    <div className="h-[calc(100vh-2rem)] p-4">
      <MapView municipalities={municipalities} selectedIds={[]} onSelect={() => {}} onMultiSelect={() => {}} />
    </div>
  );
}