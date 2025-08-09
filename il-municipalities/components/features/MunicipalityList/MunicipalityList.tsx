"use client";

import type { Municipality } from "@/types/municipality";
import Link from "next/link";

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
          <li key={m.id} className={`${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}>
            <div className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onSelect(m.id)}
                  aria-label={`Select ${m.name} for comparison`}
                />
                <div className="min-w-0">
                  <Link href={`/municipalities/${m.id}`} className="block truncate font-medium">
                    {m.name}
                  </Link>
                  <div className="text-sm text-gray-500 truncate">{m.county} County • {m.type}</div>
                </div>
              </div>
              <div className="text-sm tabular-nums flex-shrink-0">{m.population.current.toLocaleString()}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}