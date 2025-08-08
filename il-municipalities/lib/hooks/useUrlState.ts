"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Primitive = string | number | boolean;

export function useUrlState<T extends Record<string, Primitive | Primitive[]>>(
  defaultState: T
): [T, (updates: Partial<T>) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getStateFromUrl = useCallback((): T => {
    const state = { ...defaultState } as T;

    searchParams.forEach((value, key) => {
      if (key in defaultState) {
        try {
          const defaultValue = defaultState[key as keyof T];
          if (typeof defaultValue === "number") {
            (state as Record<string, unknown>)[key] = Number(value);
          } else if (typeof defaultValue === "boolean") {
            (state as Record<string, unknown>)[key] = value === "true";
          } else if (Array.isArray(defaultValue)) {
            (state as Record<string, unknown>)[key] = value.split(",");
          } else {
            (state as Record<string, unknown>)[key] = value;
          }
        } catch (e) {
          console.warn(`Failed to parse URL param ${key}:`, e);
        }
      }
    });

    return state;
  }, [searchParams, defaultState]);

  const [state, setState] = useState<T>(getStateFromUrl);

  useEffect(() => {
    setState(getStateFromUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateState = useCallback(
    (updates: Partial<T>) => {
      setState((current) => {
        const newState = { ...current, ...updates } as T;

        const params = new URLSearchParams();
        (Object.entries(newState) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
          if (value !== defaultState[key]) {
            if (Array.isArray(value)) {
              params.set(String(key), (value as Primitive[]).join(","));
            } else {
              params.set(String(key), String(value));
            }
          }
        });

        router.push(`?${params.toString()}`, { scroll: false });

        return newState;
      });
    },
    [defaultState, router]
  );

  return [state, updateState];
}