"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CLASSES, WEAPONS } from "@/app/data/poe2";
import {
  formatRelativeTime,
  type SpinHistoryEntry,
} from "@/app/lib/history";

type HistoryPanelProps = {
  open: boolean;
  onClose: () => void;
  entries: SpinHistoryEntry[];
  onClear: () => void;
};

const CLASSES_BY_ID = new Map(CLASSES.map((c) => [c.id, c]));
const WEAPONS_BY_ID = new Map(WEAPONS.map((w) => [w.id, w]));

export function HistoryPanel({
  open,
  onClose,
  entries,
  onClear,
}: HistoryPanelProps): ReactNode {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!open) return;
    const refreshId = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      window.clearTimeout(refreshId);
      window.clearInterval(interval);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const resolvedEntries = useMemo(() => {
    return entries
      .map((entry) => {
        const klass = CLASSES_BY_ID.get(entry.classId);
        const weapon = WEAPONS_BY_ID.get(entry.weaponId);
        if (!klass || !weapon) return null;
        return { entry, klass, weapon };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);
  }, [entries]);

  function handleClear() {
    if (entries.length === 0) return;
    const ok = window.confirm("Limpar todo o histórico de giros?");
    if (ok) onClear();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="history-overlay-root"
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Fechar histórico"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="history-panel"
            role="dialog"
            aria-label="Histórico de giros"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-amber-700/70 bg-linear-to-b from-stone-950/98 to-stone-900/98 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur"
          >
            <header className="flex items-center justify-between gap-3 border-b border-amber-700/40 px-6 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/60">
                  Path of Exile 2
                </p>
                <h2 className="font-serif-display text-xl font-bold uppercase tracking-wider text-amber-200">
                  Histórico de giros
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={entries.length === 0}
                  className="cursor-pointer rounded-md border border-amber-700/60 bg-stone-900/80 px-3 py-1.5 text-[10px] uppercase tracking-widest text-amber-200/80 transition hover:border-amber-500 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="cursor-pointer rounded-md border border-amber-700/60 bg-stone-900/80 px-3 py-1.5 text-lg leading-none text-amber-200/80 transition hover:border-amber-500 hover:text-amber-100"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {resolvedEntries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center text-stone-400">
                  <span className="font-serif-display text-2xl text-amber-300/40">
                    ✦
                  </span>
                  <p className="mt-3 text-sm tracking-wide">
                    Nenhum giro ainda.
                  </p>
                  <p className="text-xs text-stone-500">
                    Gire a roleta para começar.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {resolvedEntries.map(({ entry, klass, weapon }) => (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl border border-amber-700/30 bg-stone-900/70 px-3 py-2.5 shadow-inner"
                    >
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-amber-700/50 bg-stone-950">
                          <Image
                            src={klass.iconSrc}
                            alt=""
                            aria-hidden
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                        <span className="text-amber-500/70">+</span>
                        <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-amber-700/50 bg-stone-950">
                          <Image
                            src={weapon.iconSrc}
                            alt=""
                            aria-hidden
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-bold uppercase tracking-wider text-amber-200">
                          {klass.label}
                          <span className="mx-1.5 text-amber-500/60">+</span>
                          <span className="text-purple-300">{weapon.label}</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-stone-500">
                          {formatRelativeTime(now, entry.timestamp)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-amber-700/30 px-6 py-3 text-center text-[10px] uppercase tracking-[0.3em] text-stone-500">
              {entries.length > 0
                ? `${entries.length} ${entries.length === 1 ? "giro salvo" : "giros salvos"}`
                : "Salvo no seu navegador"}
            </footer>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
