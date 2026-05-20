"use client";

import type { ReactNode } from "react";

type HistoryButtonProps = {
  onClick: () => void;
  count: number;
};

export function HistoryButton({ onClick, count }: HistoryButtonProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir histórico de giros"
      className="font-serif-display fixed right-4 top-4 z-30 flex items-center gap-2 rounded-xl border border-amber-700/60 bg-stone-900/80 px-3.5 py-2 text-[10px] uppercase tracking-[0.25em] text-amber-200/90 shadow-lg backdrop-blur transition hover:border-amber-500 hover:text-amber-100 md:right-8 md:top-8 md:px-4 md:py-2.5 md:text-xs"
    >
      <span className="text-base leading-none md:text-lg" aria-hidden>
        ≡
      </span>
      <span>Histórico</span>
      {count > 0 ? (
        <span
          aria-hidden
          className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-amber-500/60 bg-amber-500/15 px-1.5 text-[10px] font-bold tracking-normal text-amber-200"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
