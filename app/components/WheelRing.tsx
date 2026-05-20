"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type WheelRingItem = {
  id: string;
  label: string;
  glyph: string;
  color: string;
};

type WheelRingProps = {
  items: WheelRingItem[];
  innerRadius: number;
  outerRadius: number;
  rotation: number;
  fontSize: number;
  glyphSize: number;
  spinDurationMs: number;
  onSpinEnd?: () => void;
};

/**
 * SVG polar helper: angle is in degrees, 0 = 12 o'clock, clockwise positive.
 *
 * Coordinates are rounded to a fixed precision so SSR and client renders produce
 * the same string (avoids React hydration mismatches caused by tiny float drift
 * between Node and V8/JIT).
 */
function polar(radius: number, angleDeg: number): { x: string; y: string } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: (radius * Math.sin(rad)).toFixed(3),
    y: (-radius * Math.cos(rad)).toFixed(3),
  };
}

function annularSectorPath(
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const p1 = polar(innerR, startAngle);
  const p2 = polar(outerR, startAngle);
  const p3 = polar(outerR, endAngle);
  const p4 = polar(innerR, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p3.x} ${p3.y}`,
    `L ${p4.x} ${p4.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p1.x} ${p1.y}`,
    "Z",
  ].join(" ");
}

export function WheelRing({
  items,
  innerRadius,
  outerRadius,
  rotation,
  fontSize,
  glyphSize,
  spinDurationMs,
  onSpinEnd,
}: WheelRingProps): ReactNode {
  const sliceCount = items.length;
  const sliceAngle = 360 / sliceCount;
  const midRadius = (innerRadius + outerRadius) / 2;

  const durationSec = spinDurationMs / 1000;

  return (
    <motion.g
      initial={false}
      animate={{ rotate: rotation }}
      transition={{
        duration: durationSec,
        ease: durationSec > 0 ? [0.17, 0.67, 0.16, 1] : "linear",
      }}
      onAnimationComplete={onSpinEnd}
      style={{ transformOrigin: "center", transformBox: "fill-box" }}
    >
      {items.map((item, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;
        const midAngle = startAngle + sliceAngle / 2;
        const path = annularSectorPath(
          innerRadius,
          outerRadius,
          startAngle,
          endAngle,
        );
        const flip = midAngle > 90 && midAngle < 270;
        const labelOffsetFromMid = fontSize * 0.7;

        return (
          <g key={item.id}>
            <path
              d={path}
              fill={item.color}
              stroke="#a07a32"
              strokeWidth={1.5}
              opacity={0.9}
            />
            <g transform={`rotate(${midAngle}) translate(0 ${-midRadius})`}>
              <g transform={flip ? "rotate(180)" : ""}>
                <text
                  x={0}
                  y={-glyphSize * 0.6}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={glyphSize}
                  fill="#f6e4b3"
                  style={{ userSelect: "none" }}
                >
                  {item.glyph}
                </text>
                <text
                  x={0}
                  y={labelOffsetFromMid}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fill="#f6e4b3"
                  fontWeight={600}
                  letterSpacing={1}
                  style={{ userSelect: "none" }}
                >
                  {item.label.toUpperCase()}
                </text>
              </g>
            </g>
          </g>
        );
      })}
      <circle
        r={innerRadius}
        cx={0}
        cy={0}
        fill="none"
        stroke="#c39537"
        strokeWidth={2.5}
      />
      <circle
        r={outerRadius}
        cx={0}
        cy={0}
        fill="none"
        stroke="#c39537"
        strokeWidth={2.5}
      />
    </motion.g>
  );
}
