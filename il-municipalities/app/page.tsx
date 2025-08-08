"use client";

import data from "@/public/data/municipalities.json" assert { type: "json" };
import { useMemo, useState } from "react";
import type { Municipality } from "@/types/municipality";
import { SearchBar } from "@/components/features/SearchBar/SearchBar";
import { FilterPanel, type FilterState } from "@/components/features/FilterPanel/FilterPanel";
import { MunicipalityList } from "@/components/features/MunicipalityList/MunicipalityList";

export default function Home() {
  const allData = (data as unknown as Municipality[]) ?? [];
  const [filtered, setFiltered] = useState<Municipality[]>(allData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const defaultFilters: FilterState = useMemo(() => ({
    county: "",
    types: [],
    populationMin: 0,
    populationMax: 3_000_000,
    sortOrder: "asc",
  }), []);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const effectiveData = useMemo(() => {
    const filteredData = filtered.filter((m) => {
      if (filters.county && m.county !== filters.county) return false;
      if (filters.types.length && !filters.types.includes(m.type)) return false;
      if (m.population.current < filters.populationMin || m.population.current > filters.populationMax) return false;
      return true;
    });

    const sorted = [...filteredData].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    if (filters.sortOrder === "desc") sorted.reverse();
    return sorted;
  }, [filtered, filters]);

  return (
    <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-2 space-y-4">

        <SearchBar
          data={allData}
          onSearch={setFiltered}
          onCountySelect={(county) => setFilters((prev) => ({ ...prev, county }))}
        />

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
