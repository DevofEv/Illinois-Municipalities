"use client";

import type { Municipality } from "@/types/municipality";

export interface FilterState {
  county: string;
  types: Array<Municipality["type"]>;
  populationMin: number;
  populationMax: number;
}

interface FilterPanelProps {
  data: Municipality[];
  filters: FilterState;
  onFilterChange: (partial: Partial<FilterState>) => void;
  clearFilters: () => void;
}

export function FilterPanel({ data, filters, onFilterChange, clearFilters }: FilterPanelProps) {
  const counties = Array.from(new Set(data.map((d) => d.county))).sort();

  function handleTypeToggle(type: Municipality["type"], checked: boolean) {
    const set = new Set(filters.types);
    if (checked) set.add(type);
    else set.delete(type);
    onFilterChange({ types: Array.from(set) });
  }

  const filteredData = data.filter((m) => {
    if (filters.county && m.county !== filters.county) return false;
    if (filters.types.length && !filters.types.includes(m.type)) return false;
    if (m.population.current < filters.populationMin || m.population.current > filters.populationMax) return false;
    return true;
  });

  const totalPopulation = filteredData.reduce((sum, m) => sum + (m.population.current || 0), 0);

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
              min={0}
              max={3000000}
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
              min={0}
              max={3000000}
              step={1000}
              value={filters.populationMax}
              onChange={(e) => onFilterChange({ populationMax: parseInt(e.target.value, 10) })}
              className="w-full"
              aria-label="Maximum population"
            />
          </label>
        </div>
      </fieldset>

      <div className="mt-6 p-3 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Summary</h3>
        <dl className="text-sm space-y-1">
          <div className="flex justify-between">
            <dt>Municipalities:</dt>
            <dd className="font-medium">{filteredData.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Total Population:</dt>
            <dd className="font-medium">{formatNumber(totalPopulation)}</dd>
          </div>
        </dl>
      </div>

      <button onClick={clearFilters} className="mt-2 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
        Clear all filters
      </button>
    </aside>
  );
}