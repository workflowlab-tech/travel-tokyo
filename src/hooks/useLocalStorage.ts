"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    // Route through React's functional setState form (setStoredValue(prev => ...))
    // instead of resolving against the `storedValue` closure directly. A stale
    // closure here (e.g. a setInterval callback captured once on mount, like the
    // budget page's Telegram sync poll) would otherwise overwrite localStorage
    // using an outdated snapshot, silently discarding anything saved in between —
    // that's exactly how the sync poll could wipe a just-added expense. Using the
    // updater form guarantees `prev` is always the true latest state, no matter
    // how stale the caller's own closure is.
    setStoredValue((prev) => {
      try {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        return prev;
      }
    });
  };

  return [storedValue, setValue, isLoaded];
}
