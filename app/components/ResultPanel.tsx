import Image from "next/image";
import type { ReactNode } from "react";

type ResultPanelProps = {
  className: string | null;
  weapon: string | null;
  classIconSrc: string | null;
  weaponIconSrc: string | null;
};

export function ResultPanel({
  className,
  weapon,
  classIconSrc,
  weaponIconSrc,
}: ResultPanelProps): ReactNode {
  const hasResult = className && weapon && classIconSrc && weaponIconSrc;

  return (
    <div className="rounded-2xl border-2 border-amber-700/70 bg-linear-to-b from-stone-900/95 to-stone-950/95 px-8 py-4 shadow-2xl backdrop-blur-sm">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-amber-200/70">
        Sua combinação:
      </p>
      <div className="mt-2 flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold uppercase tracking-wider">
        {hasResult ? (
          <>
            <span className="flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-amber-700/60 bg-stone-950 shadow-inner md:h-14 md:w-14">
                <Image
                  src={classIconSrc}
                  alt=""
                  aria-hidden
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {className}
              </span>
            </span>
            <span className="text-amber-500/80 text-xl">+</span>
            <span className="flex items-center gap-3">
              <span className="text-purple-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {weapon}
              </span>
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-amber-700/60 bg-stone-950 shadow-inner md:h-14 md:w-14">
                <Image
                  src={weaponIconSrc}
                  alt=""
                  aria-hidden
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
            </span>
          </>
        ) : (
          <span className="text-stone-500 text-lg font-medium tracking-widest">
            Gire a roleta para descobrir seu build
          </span>
        )}
      </div>
    </div>
  );
}
