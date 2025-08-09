"use client";

import type { Municipality } from "@/types/municipality";

export interface FilterState {
  county: string;
  types: Array<Municipality["type"]>;
  populationMin: number;
  populationMax: number;
  sortOrder: "asc" | "desc";
}

interface FilterPanelProps {
  data: Municipality[];
  filters: FilterState;
  onFilterChange: (partial: Partial<FilterState>) => void;
  clearFilters: () => void;
}

export function FilterPanel({ data, filters, onFilterChange, clearFilters }: FilterPanelProps) {
  const counties = Array.from(new Set(data.map((d) => d.county))).sort();
  const minPopulation = Math.min(0, ...data.map((d) => d.population.current || 0));
  const maxPopulation = Math.max(3000000, ...data.map((d) => d.population.current || 0));

  function handleTypeToggle(type: Municipality["type"], checked: boolean) {
    const set = new Set(filters.types);
    if (checked) set.add(type);
    else set.delete(type);
    onFilterChange({ types: Array.from(set) });
  }

  const formatNumber = (n: number) => n.toLocaleString();

  return (
    <aside className="space-y-4" role="region" aria-label="Filter municipalities">
      <h2 className="text-lg font-semibold">Filters</h2>

      <fieldset className="space-y-2">
        <legend className="font-medium">County</legend>
        <select
          id="county-filter"
          value={filters.county}
          onChange={(e) => onFilterChange({ county: e.target.value })}
          className="w-full p-2 border rounded"
          aria-label="Filter by county"
        >
          <option value="">All Counties</option>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-medium">Municipality Type</legend>
        <div className="space-y-2">
          {["City", "Village", "Town", "CDP"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.types.includes(type as Municipality["type"]) }
                onChange={(e) => handleTypeToggle(type as Municipality["type"], e.target.checked)}
                aria-label={`Include ${type}`}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-medium">Population Range</legend>
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm">Min: {formatNumber(filters.populationMin)}</span>
            <input
              type="range"
              min={minPopulation}
              max={maxPopulation}
              step={1000}
              value={filters.populationMin}
              onChange={(e) => onFilterChange({ populationMin: parseInt(e.target.value, 10) })}
              className="w-full"
              aria-label="Minimum population"
            />
          </label>
          <label className="block">
            <span className="text-sm">Max: {formatNumber(filters.populationMax)}</span>
            <input
              type="range"
              min={minPopulation}
              max={maxPopulation}
              step={1000}
              value={filters.populationMax}
              onChange={(e) => onFilterChange({ populationMax: parseInt(e.target.value, 10) })}
              className="w-full"
              aria-label="Maximum population"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-medium">Sort</legend>
        <select
          id="sort-order"
          value={filters.sortOrder}
          onChange={(e) => onFilterChange({ sortOrder: e.target.value as FilterState["sortOrder"] })}
          className="w-full p-2 border rounded"
          aria-label="Sort order"
        >
          <option value="asc">Name: A → Z</option>
          <option value="desc">Name: Z → A</option>
        </select>
      </fieldset>

      <button onClick={clearFilters} className="mt-6 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
        Clear all filters
      </button>
    </aside>
  );
}