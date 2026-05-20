"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  HISTORY_KEY,
  appendEntry,
  clearHistory as clearStoredHistory,
  loadHistory,
  saveHistory,
  type SpinHistoryEntry,
} from "./history";

export type UseSpinHistory = {
  entries: SpinHistoryEntry[];
  addEntry: (classId: string, weaponId: string) => void;
  clear: () => void;
  isLoaded: boolean;
};

const EMPTY: SpinHistoryEntry[] = [];

// Module-level cache so every component using the hook sees the same array
// reference between renders (required by `useSyncExternalStore`) and so that
// in-tab mutations are broadcast to all consumers via the listener set.
let cachedSnapshot: SpinHistoryEntry[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot(): SpinHistoryEntry[] {
  if (cachedSnapshot === null) {
    cachedSnapshot = loadHistory();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): SpinHistoryEntry[] {
  return EMPTY;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  function handleStorage(event: StorageEvent) {
    if (event.key !== HISTORY_KEY) return;
    cachedSnapshot = loadHistory();
    emit();
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function commit(next: SpinHistoryEntry[]) {
  cachedSnapshot = next;
  emit();
}

export function useSpinHistory(): UseSpinHistory {
  const entries = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addEntry = useCallback((classId: string, weaponId: string) => {
    const current = cachedSnapshot ?? loadHistory();
    const next = appendEntry(current, classId, weaponId);
    saveHistory(next);
    commit(next);
  }, []);

  const clear = useCallback(() => {
    clearStoredHistory();
    commit([]);
  }, []);

  return { entries, addEntry, clear, isLoaded: cachedSnapshot !== null };
}
