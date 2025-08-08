"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import type { Municipality } from "@/types/municipality";

interface SearchBarProps {
  data: Municipality[];
  onSearch: (results: Municipality[]) => void;
  onCountySelect?: (county: string) => void;
  placeholder?: string;
}

export function SearchBar({ data, onSearch, onCountySelect, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [countySuggestions, setCountySuggestions] = useState<string[]>([]);

  const fuse = useMemo(() => {
    return new Fuse<Municipality>(data, {
      keys: [
        { name: "name", weight: 2 },
        { name: "county", weight: 1 },
        { name: "searchTokens", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
      useExtendedSearch: true,
    });
  }, [data]);

  const allCounties = useMemo(() => Array.from(new Set(data.map((d) => d.county))).sort(), [data]);

  const parseAdvancedQuery = useCallback((q: string) => {
    const tokens = {
      county: "",
      type: "",
      population: { min: 0, max: Number.POSITIVE_INFINITY },
      text: "",
    };

    const countyMatch = q.match(/county:(\S+)/i);
    if (countyMatch) {
      tokens.county = countyMatch[1];
      q = q.replace(countyMatch[0], "");
    }

    const typeMatch = q.match(/type:(\S+)/i);
    if (typeMatch) {
      tokens.type = typeMatch[1];
      q = q.replace(typeMatch[0], "");
    }

    const popMatch = q.match(/population([><=])(\d+)/i);
    if (popMatch) {
      const operator = popMatch[1];
      const value = parseInt(popMatch[2], 10);
      if (operator === ">") tokens.population.min = value;
      if (operator === "<") tokens.population.max = value;
      if (operator === "=") tokens.population.min = tokens.population.max = value;
      q = q.replace(popMatch[0], "");
    }

    tokens.text = q.trim();
    return tokens;
  }, []);

  useEffect(() => {
    if (!query) {
      onSearch(data);
      setCountySuggestions([]);
      return;
    }

    if (isAdvanced) {
      const tokens = parseAdvancedQuery(query);
      const results = data.filter((m) => {
        if (tokens.county && !m.county.toLowerCase().includes(tokens.county.toLowerCase())) {
          return false;
        }
        if (tokens.type && m.type.toLowerCase() !== tokens.type.toLowerCase()) {
          return false;
        }
        if (m.population.current < tokens.population.min || m.population.current > tokens.population.max) {
          return false;
        }
        if (tokens.text) {
          const fuseResults = fuse.search(tokens.text);
          return fuseResults.some((r) => r.item.id === m.id);
        }
        return true;
      });
      onSearch(results);
      setCountySuggestions(tokens.county ? [tokens.county] : []);
      return;
    }

    const fuseResults = fuse.search(query);
    onSearch(fuseResults.map((r) => r.item));
    const localCounties = allCounties.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
    setCountySuggestions(localCounties);
  }, [query, isAdvanced, data, fuse, onSearch, parseAdvancedQuery, allCounties]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search municipalities..."}
          className="w-full pl-10 pr-10 py-2 border rounded-lg"
          aria-label="Search municipalities"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isAdvanced && countySuggestions.length > 0 && (
        <div className="border rounded-lg p-2 text-sm bg-white">
          <div className="mb-1 text-gray-600">Counties</div>
          <ul className="flex flex-wrap gap-2">
            {countySuggestions.map((c) => (
              <li key={c}>
                <button
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
                  onClick={() => onCountySelect?.(c)}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => setIsAdvanced(!isAdvanced)}
        className="text-sm text-blue-600"
      >
        {isAdvanced ? "Simple search" : "Advanced search"}
      </button>

      {isAdvanced && (
        <div className="p-2 bg-gray-50 rounded text-sm">
          <p>Use tokens like: county:Cook population&gt;10000 type:City</p>
        </div>
      )}
    </div>
  );
}