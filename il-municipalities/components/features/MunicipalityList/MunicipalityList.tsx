"use client";

import type { Municipality } from "@/types/municipality";

interface MunicipalityListProps {
  data: Municipality[];
  selectedIds: string[];
  onSelect: (id: string) => void;
}

export function MunicipalityList({ data, selectedIds, onSelect }: MunicipalityListProps) {
  return (
    <ul className="divide-y rounded border">
      {data.map((m) => {
        const selected = selectedIds.includes(m.id);
        return (
          <li
            key={m.id}
            className={`p-3 cursor-pointer ${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}
            onClick={() => onSelect(m.id)}
            role="button"
            aria-pressed={selected}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-500">{m.county} County • {m.type}</div>
              </div>
              <div className="text-sm tabular-nums">{m.population.current.toLocaleString()}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}