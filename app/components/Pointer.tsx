import type { ReactNode } from "react";

type PointerProps = {
  /** Outer radius of the decorative wheel border (the gem sits just above this). */
  wheelBorderRadius: number;
};

/**
 * Indicator at 12 o'clock: a red diamond gem sits on the wheel border with a
 * gold arrowhead pointing inward toward the selected slice. Both pieces fit
 * inside the SVG viewBox (unlike the v1 pointer, which got clipped at the top).
 */
export function Pointer({ wheelBorderRadius }: PointerProps): ReactNode {
  const gemCenterY = -wheelBorderRadius + 4;
  const gemHalf = 16;
  const triBaseY = -wheelBorderRadius + 20;
  const triTipY = -wheelBorderRadius + 64;
  const triHalfWidth = 16;

  return (
    <g style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.7))" }}>
      <polygon
        points={`-${triHalfWidth},${triBaseY} ${triHalfWidth},${triBaseY} 0,${triTipY}`}
        fill="#f0c560"
        stroke="#3a2410"
        strokeWidth={2}
      />
      <polygon
        points={`0,${gemCenterY - gemHalf} ${gemHalf - 2},${gemCenterY} 0,${gemCenterY + gemHalf} ${-(gemHalf - 2)},${gemCenterY}`}
        fill="#8a1612"
        stroke="#f0c560"
        strokeWidth={2.5}
      />
      <polygon
        points={`0,${gemCenterY - gemHalf + 4} 6,${gemCenterY - 2} 0,${gemCenterY + 4} -6,${gemCenterY - 2}`}
        fill="#c4221b"
        opacity={0.85}
      />
    </g>
  );
}
