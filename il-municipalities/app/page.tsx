"use client";

import data from "@/public/data/municipalities.json" assert { type: "json" };
import { useMemo, useState } from "react";
import type { Municipality } from "@/types/municipality";
import { SearchBar } from "@/components/features/SearchBar/SearchBar";
import { FilterPanel, type FilterState } from "@/components/features/FilterPanel/FilterPanel";
import { MunicipalityList } from "@/components/features/MunicipalityList/MunicipalityList";
import Link from "next/link";

export default function Home() {
  const allData = (data as unknown as Municipality[]) ?? [];
  const [filtered, setFiltered] = useState<Municipality[]>(allData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const defaultFilters: FilterState = useMemo(() => ({
    county: "",
    types: [],
    populationMin: 0,
    populationMax: 3_000_000,
  }), []);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const effectiveData = useMemo(() => {
    return filtered.filter((m) => {
      if (filters.county && m.county !== filters.county) return false;
      if (filters.types.length && !filters.types.includes(m.type)) return false;
      if (m.population.current < filters.populationMin || m.population.current > filters.populationMax) return false;
      return true;
    });
  }, [filtered, filters]);

  return (
    <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <SearchBar data={allData} onSearch={setFiltered} />
          <Link href="/map" className="px-3 py-2 rounded border whitespace-nowrap">🗺️ Map</Link>
        </div>
        <MunicipalityList data={effectiveData} selectedIds={selectedIds} onSelect={(id) => {
          setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
        }} />
        <div className="text-xs text-gray-500">Tip: Click a municipality to open its profile.</div>
      </section>
      <aside>
        <FilterPanel
          data={allData}
          filters={filters}
          onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          clearFilters={() => setFilters(defaultFilters)}
        />
      </aside>
    </main>
  );
}
