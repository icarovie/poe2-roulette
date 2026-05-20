import type { ReactNode } from "react";

type PointerProps = {
  outerRadius: number;
};

/**
 * Gold pointer at 12 o'clock that points downward toward the selected slice.
 * Rendered as part of the same SVG so it sits flush with the outer ring.
 */
export function Pointer({ outerRadius }: PointerProps): ReactNode {
  const tipY = -outerRadius + 12;
  const baseY = -outerRadius - 22;
  const halfWidth = 14;

  return (
    <g>
      <polygon
        points={`-${halfWidth},${baseY} ${halfWidth},${baseY} 0,${tipY}`}
        fill="#e8c46a"
        stroke="#3a2a10"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
      />
      <circle
        cx={0}
        cy={baseY - 8}
        r={8}
        fill="#7a1a12"
        stroke="#e8c46a"
        strokeWidth={1.5}
      />
    </g>
  );
}
