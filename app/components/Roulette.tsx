"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { CLASSES, WEAPONS } from "@/app/data/poe2";
import { computeNextRotation, randInt } from "@/app/lib/spin";
import { useSpinHistory } from "@/app/lib/useSpinHistory";
import { WheelRing } from "./WheelRing";
import { Pointer } from "./Pointer";
import { ResultPanel } from "./ResultPanel";
import { HistoryButton } from "./HistoryButton";
import { HistoryPanel } from "./HistoryPanel";

const VIEW_BOX_SIZE = 760;
const HALF = VIEW_BOX_SIZE / 2;

const OUTER_RING_OUTER = 320;
const OUTER_RING_INNER = 220;
const INNER_RING_OUTER = 218;
const INNER_RING_INNER = 95;
const CENTER_BUTTON_R = 88;

const WHEEL_BORDER_OUTER = 350;
const WHEEL_BORDER_INNER = 322;

const SPIN_DURATION_MS = 4800;

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
  const ringsArrivedRef = useRef(0);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { entries, addEntry, clear } = useSpinHistory();

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
        addEntry(CLASSES[classIndex].id, WEAPONS[weaponIndex].id);
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
      ringsArrivedRef.current = 0;
      setSpinning(true);
      setCurrentDuration(SPIN_DURATION_MS);
      setClassRotation(nextClass);
      setWeaponRotation(nextWeapon);
    },
    [classRotation, weaponRotation, spinning, addEntry],
  );

  const handleRingArrived = useCallback(() => {
    ringsArrivedRef.current += 1;
    if (ringsArrivedRef.current < 2) return;
    ringsArrivedRef.current = 0;
    setSpinning(false);
    setShownResult(pendingResult);
    setPendingResult(null);
    if (pendingResult) {
      addEntry(
        CLASSES[pendingResult.classIndex].id,
        WEAPONS[pendingResult.weaponIndex].id,
      );
    }
  }, [pendingResult, addEntry]);

  const resultClass =
    shownResult !== null ? CLASSES[shownResult.classIndex] : null;
  const resultWeapon =
    shownResult !== null ? WEAPONS[shownResult.weaponIndex] : null;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <HistoryButton onClick={() => setHistoryOpen(true)} count={entries.length} />
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        entries={entries}
        onClear={clear}
      />
      <div className="relative aspect-square w-full max-w-[min(82vh,760px)]">
        <svg
          viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
          className="h-full w-full drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          aria-label="Roleta de classes e armas de Path of Exile 2"
        >
          <defs>
            <radialGradient id="wheelBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1c1208" />
              <stop offset="80%" stopColor="#0b0703" />
              <stop offset="100%" stopColor="#050300" />
            </radialGradient>
            <radialGradient id="centerBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3a2410" />
              <stop offset="70%" stopColor="#180c04" />
              <stop offset="100%" stopColor="#0a0502" />
            </radialGradient>
            <radialGradient id="borderBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2a1a08" />
              <stop offset="100%" stopColor="#100802" />
            </radialGradient>
          </defs>

          <g transform={`translate(${HALF} ${HALF})`}>
            <circle r={WHEEL_BORDER_OUTER} fill="url(#borderBg)" />
            <circle
              r={WHEEL_BORDER_OUTER}
              fill="none"
              stroke="#c39537"
              strokeWidth={3}
            />
            <circle
              r={WHEEL_BORDER_INNER}
              fill="none"
              stroke="#c39537"
              strokeWidth={3}
            />

            <circle r={OUTER_RING_OUTER} fill="url(#wheelBg)" />

            <WheelRing
              ringId="weapons"
              items={WEAPONS}
              innerRadius={OUTER_RING_INNER}
              outerRadius={OUTER_RING_OUTER}
              rotation={weaponRotation}
              labelFontSize={13}
              labelInsetFromInner={16}
              spinDurationMs={currentDuration}
              onSpinEnd={spinning ? handleRingArrived : undefined}
            />

            <WheelRing
              ringId="classes"
              items={CLASSES}
              innerRadius={INNER_RING_INNER}
              outerRadius={INNER_RING_OUTER}
              rotation={classRotation}
              labelFontSize={15}
              labelInsetFromInner={18}
              spinDurationMs={currentDuration}
              onSpinEnd={spinning ? handleRingArrived : undefined}
            />

            <circle r={CENTER_BUTTON_R + 8} fill="#0a0502" />
            <circle
              r={CENTER_BUTTON_R + 8}
              fill="none"
              stroke="#c39537"
              strokeWidth={3}
            />
            <circle r={CENTER_BUTTON_R} fill="url(#centerBg)" />

            <Pointer wheelBorderRadius={WHEEL_BORDER_OUTER} />
          </g>
        </svg>

        <button
          type="button"
          onClick={() => handleSpin(false)}
          disabled={spinning}
          className="font-serif-display absolute left-1/2 top-1/2 z-10 flex h-[23%] w-[23%] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[3px] border-amber-600/90 bg-gradient-to-b from-stone-800 to-stone-950 text-3xl md:text-4xl font-extrabold uppercase tracking-[0.18em] text-amber-300 shadow-[inset_0_2px_10px_rgba(255,200,100,0.25),0_6px_24px_rgba(0,0,0,0.8)] transition hover:from-stone-700 hover:to-stone-900 hover:text-amber-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
          className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-amber-700/60 bg-stone-900/80 text-[10px] uppercase tracking-widest text-amber-200/80 shadow-lg transition hover:border-amber-500 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Sortear aleatoriamente sem animação"
          title="Sortear sem animação"
        >
          <span className="text-2xl leading-none">⚄</span>
          <span className="leading-none">Aleatório</span>
        </button>

        <ResultPanel
          className={resultClass?.label ?? null}
          weapon={resultWeapon?.label ?? null}
          classIconSrc={resultClass?.iconSrc ?? null}
          weaponIconSrc={resultWeapon?.iconSrc ?? null}
        />

        <button
          type="button"
          onClick={() => handleSpin(false)}
          disabled={spinning}
          className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-amber-700/60 bg-stone-900/80 text-[10px] uppercase tracking-widest text-amber-200/80 shadow-lg transition hover:border-amber-500 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Girar a roleta"
        >
          <span className="text-2xl leading-none">⟳</span>
          <span className="leading-none">Girar</span>
        </button>
      </div>
    </div>
  );
}
