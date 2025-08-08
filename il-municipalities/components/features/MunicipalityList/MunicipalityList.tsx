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
          <li key={m.id} className={`p-0 ${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}>
            <Link
              href={`/municipalities/${m.id}`}
              className="block p-3"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                onSelect(m.id);
                // Navigate after selection
                window.location.href = `/municipalities/${m.id}`;
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.county} County • {m.type}</div>
                </div>
                <div className="text-sm tabular-nums">{m.population.current.toLocaleString()}</div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}