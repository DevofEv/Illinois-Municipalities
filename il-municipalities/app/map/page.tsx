"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/features/MapView/MapViewClient"), { ssr: false });

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-2rem)] p-4">
      <MapView municipalities={[]} selectedIds={[]} onSelect={() => {}} onMultiSelect={() => {}} />
    </div>
  );
}