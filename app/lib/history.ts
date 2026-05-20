export type SpinHistoryEntry = {
  id: string;
  classId: string;
  weaponId: string;
  timestamp: number;
};

export const HISTORY_KEY = "poe2-roulette:history:v1";
export const HISTORY_LIMIT = 50;

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function generateId(): string {
  if (hasWindow() && typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isValidEntry(value: unknown): value is SpinHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<SpinHistoryEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.classId === "string" &&
    typeof entry.weaponId === "string" &&
    typeof entry.timestamp === "number" &&
    Number.isFinite(entry.timestamp)
  );
}

export function loadHistory(): SpinHistoryEntry[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveHistory(entries: SpinHistoryEntry[]): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded or storage unavailable; ignore.
  }
}

export function appendEntry(
  entries: SpinHistoryEntry[],
  classId: string,
  weaponId: string,
): SpinHistoryEntry[] {
  const entry: SpinHistoryEntry = {
    id: generateId(),
    classId,
    weaponId,
    timestamp: Date.now(),
  };
  return [entry, ...entries].slice(0, HISTORY_LIMIT);
}

export function clearHistory(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore.
  }
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatRelativeTime(now: number, then: number): string {
  const diff = Math.max(0, now - then);
  if (diff < MINUTE_MS) return "agora";
  if (diff < HOUR_MS) {
    const minutes = Math.floor(diff / MINUTE_MS);
    return `há ${minutes} min`;
  }
  if (diff < DAY_MS) {
    const hours = Math.floor(diff / HOUR_MS);
    return `há ${hours} h`;
  }
  const days = Math.floor(diff / DAY_MS);
  return `há ${days} d`;
}
