"use client";

import { useCallback, useState, type ReactNode } from "react";
import { CLASSES, WEAPONS } from "@/app/data/poe2";
import { computeNextRotation, randInt } from "@/app/lib/spin";
import { WheelRing } from "./WheelRing";
import { Pointer } from "./Pointer";
import { ResultPanel } from "./ResultPanel";

const VIEW_BOX_SIZE = 700;
const HALF = VIEW_BOX_SIZE / 2;
const OUTER_RING_OUTER = 340;
const OUTER_RING_INNER = 250;
const INNER_RING_OUTER = 248;
const INNER_RING_INNER = 130;
const CENTER_BUTTON_R = 95;

const SPIN_DURATION_MS = 4500;

type Result = {
  classIndex: number;
  weaponIndex: number;
};

export function Roulette(): ReactNode {
  const [classRotation, setClassRotation] = useState(0);
  const [weaponRotation, setWeaponRotation] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(SPIN_DURATION_MS);
  const [spinning, setSpinning] = useState(false);
  const [pendingResult, setPendingResult] = useState<Result | null>(null);
  const [shownResult, setShownResult] = useState<Result | null>(null);
  const [ringsArrivedCount, setRingsArrivedCount] = useState(0);

  const handleSpin = useCallback(
    (instant: boolean) => {
      if (spinning) return;

      const classIndex = randInt(CLASSES.length);
      const weaponIndex = randInt(WEAPONS.length);
      const result: Result = { classIndex, weaponIndex };

      if (instant) {
        const nextClass = computeNextRotation({
          currentRotation: classRotation,
          targetIndex: classIndex,
          sliceCount: CLASSES.length,
          fullTurns: 0,
        });
        const nextWeapon = computeNextRotation({
          currentRotation: weaponRotation,
          targetIndex: weaponIndex,
          sliceCount: WEAPONS.length,
          fullTurns: 0,
        });
        setCurrentDuration(0);
        setClassRotation(nextClass);
        setWeaponRotation(nextWeapon);
        setShownResult(result);
        setPendingResult(null);
        return;
      }

      const nextClass = computeNextRotation({
        currentRotation: classRotation,
        targetIndex: classIndex,
        sliceCount: CLASSES.length,
        fullTurns: 6,
      });
      const nextWeapon = computeNextRotation({
        currentRotation: weaponRotation,
        targetIndex: weaponIndex,
        sliceCount: WEAPONS.length,
        fullTurns: 8,
      });

      setShownResult(null);
      setPendingResult(result);
      setRingsArrivedCount(0);
      setSpinning(true);
      setCurrentDuration(SPIN_DURATION_MS);
      setClassRotation(nextClass);
      setWeaponRotation(nextWeapon);
    },
    [classRotation, weaponRotation, spinning],
  );

  const handleRingArrived = useCallback(() => {
    setRingsArrivedCount((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        setSpinning(false);
        setShownResult(pendingResult);
        setPendingResult(null);
      }
      return next;
    });
  }, [pendingResult]);

  const resultClass =
    shownResult !== null ? CLASSES[shownResult.classIndex].label : null;
  const resultWeapon =
    shownResult !== null ? WEAPONS[shownResult.weaponIndex].label : null;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="relative aspect-square w-full max-w-[min(85vh,720px)]">
        <svg
          viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
          className="h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          aria-label="Roleta de classes e armas de Path of Exile 2"
        >
          <defs>
            <radialGradient id="wheelBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1d1408" />
              <stop offset="100%" stopColor="#0a0604" />
            </radialGradient>
            <radialGradient id="centerBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3a2510" />
              <stop offset="100%" stopColor="#160a04" />
            </radialGradient>
          </defs>

          <g transform={`translate(${HALF} ${HALF})`}>
            <circle
              r={OUTER_RING_OUTER + 22}
              fill="url(#wheelBg)"
              stroke="#5a3a18"
              strokeWidth={4}
            />
            <circle
              r={OUTER_RING_OUTER + 14}
              fill="none"
              stroke="#c39537"
              strokeWidth={3}
            />

            <WheelRing
              items={WEAPONS}
              innerRadius={OUTER_RING_INNER}
              outerRadius={OUTER_RING_OUTER}
              rotation={weaponRotation}
              fontSize={14}
              glyphSize={22}
              spinDurationMs={currentDuration}
              onSpinEnd={spinning ? handleRingArrived : undefined}
            />

            <WheelRing
              items={CLASSES}
              innerRadius={INNER_RING_INNER}
              outerRadius={INNER_RING_OUTER}
              rotation={classRotation}
              fontSize={15}
              glyphSize={28}
              spinDurationMs={currentDuration}
              onSpinEnd={spinning ? handleRingArrived : undefined}
            />

            <circle
              r={CENTER_BUTTON_R + 6}
              fill="none"
              stroke="#c39537"
              strokeWidth={3}
            />
            <circle r={CENTER_BUTTON_R} fill="url(#centerBg)" />

            <Pointer outerRadius={OUTER_RING_OUTER + 14} />
          </g>
        </svg>

        <button
          type="button"
          onClick={() => handleSpin(false)}
          disabled={spinning}
          className="absolute left-1/2 top-1/2 z-10 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-amber-600/80 bg-gradient-to-b from-stone-800 to-stone-950 font-serif text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-amber-300 shadow-[inset_0_2px_8px_rgba(255,200,100,0.2),0_4px_20px_rgba(0,0,0,0.7)] transition hover:from-stone-700 hover:to-stone-900 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Girar a roleta"
        >
          {spinning ? "..." : "Girar"}
        </button>
      </div>

      <div className="flex w-full max-w-3xl items-center justify-between gap-4 px-2">
        <button
          type="button"
          onClick={() => handleSpin(true)}
          disabled={spinning}
          className="flex h-16 w-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border border-amber-700/60 bg-stone-900/80 text-[10px] uppercase tracking-widest text-amber-200/80 shadow-lg transition hover:border-amber-500 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Sortear aleatoriamente sem animação"
          title="Sortear sem animação"
        >
          <span className="text-2xl">⚄</span>
          <span className="mt-0.5">Aleatório</span>
        </button>

        <ResultPanel className={resultClass} weapon={resultWeapon} />

        <button
          type="button"
          onClick={() => handleSpin(false)}
          disabled={spinning}
          className="flex h-16 w-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border border-amber-700/60 bg-stone-900/80 text-[10px] uppercase tracking-widest text-amber-200/80 shadow-lg transition hover:border-amber-500 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Girar a roleta"
        >
          <span className="text-2xl">⟳</span>
          <span className="mt-0.5">Girar</span>
        </button>
      </div>
    </div>
  );
}
