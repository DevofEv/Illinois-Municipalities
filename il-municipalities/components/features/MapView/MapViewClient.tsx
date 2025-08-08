"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Municipality } from "@/types/municipality";

export interface MapViewProps {
  municipalities: Municipality[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onMultiSelect: (ids: string[]) => void;
}

export default function MapView({}: MapViewProps) {
  const center = useMemo<[number, number]>(() => [40, -89], []);
  return (
    <MapContainer center={center} zoom={7} className="h-full w-full rounded border">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
    </MapContainer>
  );
}