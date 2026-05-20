/**
 * Spin math for an SVG wheel whose slices are laid out clockwise starting at 12 o'clock.
 *
 * The pointer is fixed at the top (12 o'clock). Slice `i` of `n` slices occupies the arc
 * from `i * (360/n)` to `(i+1) * (360/n)` measured clockwise from the top, so its center is
 * at `(i + 0.5) * (360/n)` clockwise from the top.
 *
 * A positive rotation in SVG/CSS means clockwise. To bring slice `i`'s center under the pointer,
 * the wheel's rotation must satisfy: rotation ≡ -sliceCenter (mod 360).
 */
export function sliceCenterDeg(index: number, sliceCount: number): number {
  return (index + 0.5) * (360 / sliceCount);
}

export type SpinComputeArgs = {
  currentRotation: number;
  targetIndex: number;
  sliceCount: number;
  /** Minimum full revolutions to add for visual flair. */
  fullTurns: number;
};

/**
 * Compute the next absolute rotation so the wheel spins `>= fullTurns` revolutions clockwise
 * and lands with slice `targetIndex`'s center under the pointer.
 */
export function computeNextRotation({
  currentRotation,
  targetIndex,
  sliceCount,
  fullTurns,
}: SpinComputeArgs): number {
  const sliceCenter = sliceCenterDeg(targetIndex, sliceCount);
  const desiredMod = ((-sliceCenter) % 360 + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = desiredMod - currentMod;
  if (delta <= 0) delta += 360;
  delta += 360 * fullTurns;
  return currentRotation + delta;
}

export function randInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}
