"use client";

import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Municipality } from "@/types/municipality";

export interface MapViewProps {
  municipalities: Municipality[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onMultiSelect: (ids: string[]) => void;
}

function FitIllinoisBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([
      [36.97, -91.5],
      [42.5, -87.0],
    ]);
  }, [map]);
  return null;
}

export default function MapView({ municipalities = [], selectedIds = [], onSelect }: MapViewProps) {
  const center = useMemo<[number, number]>(() => [40, -89], []);

  return (
    <MapContainer center={center} zoom={7} className="h-full w-full rounded border">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
      <FitIllinoisBounds />
      {municipalities.map((m) => {
        const lat = m.coordinates?.lat;
        const lng = m.coordinates?.lng;
        if (typeof lat !== "number" || typeof lng !== "number") return null;
        const isSelected = selectedIds.includes(m.id);
        const population = m.population?.current ?? 0;
        const radius = population > 25000 ? 10 : population >= 1000 ? 7 : 5;
        const color = population > 25000 ? "#d7191c" : population >= 1000 ? "#fdae61" : "#abd9e9";
        return (
          <CircleMarker
            key={m.id}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{ color: isSelected ? "#2563eb" : color, fillOpacity: 0.7, weight: 1.5 }}
            eventHandlers={{ click: () => onSelect(m.id) }}
          >
            <Popup>
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-600">{m.type} · {m.county} County</div>
                <div className="mt-1 text-sm">Population: {population.toLocaleString()}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}