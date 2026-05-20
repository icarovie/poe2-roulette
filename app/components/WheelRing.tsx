"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type WheelRingItem = {
  id: string;
  label: string;
  iconSrc: string;
};

type WheelRingProps = {
  ringId: string;
  items: WheelRingItem[];
  innerRadius: number;
  outerRadius: number;
  rotation: number;
  /** Label font size in SVG units. */
  labelFontSize: number;
  /** Distance from the slice's inner edge outward where the label sits, in SVG units. */
  labelInsetFromInner: number;
  spinDurationMs: number;
  onSpinEnd?: () => void;
};

/**
 * SVG polar helper: angle is in degrees, 0 = 12 o'clock, clockwise positive.
 * Rounded to 3 decimals to keep SSR/CSR identical and avoid hydration mismatches.
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
  ringId,
  items,
  innerRadius,
  outerRadius,
  rotation,
  labelFontSize,
  labelInsetFromInner,
  spinDurationMs,
  onSpinEnd,
}: WheelRingProps): ReactNode {
  const sliceCount = items.length;
  const sliceAngle = 360 / sliceCount;
  const halfSliceAngle = sliceAngle / 2;
  const labelRadius = innerRadius + labelInsetFromInner;
  const durationSec = spinDurationMs / 1000;

  // Image bounding box in the slice's local (rotated) frame, where the slice is
  // centered at 12 o'clock spanning -halfSliceAngle..+halfSliceAngle.
  const halfArcRad = (halfSliceAngle * Math.PI) / 180;
  const imageX = -outerRadius * Math.sin(halfArcRad);
  const imageY = -outerRadius;
  const imageWidth = 2 * outerRadius * Math.sin(halfArcRad);
  const imageHeight = outerRadius - innerRadius;

  // One reusable clip for all slices of this ring. When referenced from inside a
  // `rotate(midAngle)` group, the clip applies in the rotated frame and crops
  // the image to the actual wedge shape.
  const sliceClipId = `slice-clip-${ringId}`;
  const sliceClipPath = annularSectorPath(
    innerRadius,
    outerRadius,
    -halfSliceAngle,
    halfSliceAngle,
  );

  return (
    <>
      <defs>
        <clipPath id={sliceClipId}>
          <path d={sliceClipPath} />
        </clipPath>
        <radialGradient id={`label-shade-${ringId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>
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
          const midAngle = startAngle + halfSliceAngle;
          const slicePath = annularSectorPath(
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
          );
          const flipForReading = midAngle > 90 && midAngle < 270;

          return (
            <g key={item.id}>
              <g transform={`rotate(${midAngle})`}>
                <g clipPath={`url(#${sliceClipId})`}>
                  <image
                    href={item.iconSrc}
                    x={imageX}
                    y={imageY}
                    width={imageWidth}
                    height={imageHeight}
                    preserveAspectRatio="xMidYMid slice"
                  />
                  {/* Dark gradient at the inner edge so the label stays legible. */}
                  <rect
                    x={imageX}
                    y={-innerRadius - imageHeight * 0.35}
                    width={imageWidth}
                    height={imageHeight * 0.35}
                    fill={`url(#label-shade-${ringId})`}
                  />
                </g>
                <g
                  transform={
                    flipForReading ? `rotate(180 0 ${-labelRadius})` : ""
                  }
                >
                  <text
                    x={0}
                    y={-labelRadius}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={labelFontSize}
                    fill="#f6e4b3"
                    fontWeight={800}
                    letterSpacing={1.8}
                    style={{
                      userSelect: "none",
                      paintOrder: "stroke",
                      stroke: "rgba(0,0,0,0.95)",
                      strokeWidth: 4,
                      strokeLinejoin: "round",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </text>
                </g>
              </g>
              {/* Thin gold divider on top of the image. */}
              <path
                d={slicePath}
                fill="none"
                stroke="#a07a32"
                strokeWidth={1.5}
                opacity={0.8}
              />
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
    </>
  );
}
