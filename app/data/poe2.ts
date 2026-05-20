export type PoeClass = {
  id: string;
  label: string;
  /** Single character / short glyph used as a placeholder medallion until real art is added. */
  glyph: string;
  /** Tailwind-compatible HEX for the slice background. */
  color: string;
};

export type PoeWeapon = {
  id: string;
  label: string;
  glyph: string;
  color: string;
};

/**
 * Inner ring, clockwise from 12 o'clock, matching the mockup arrangement.
 */
export const CLASSES: PoeClass[] = [
  { id: "warrior", label: "Warrior", glyph: "\u2694", color: "#5b4a2a" },
  { id: "ranger", label: "Ranger", glyph: "\u2B07", color: "#3f5a2e" },
  { id: "sorceress", label: "Sorceress", glyph: "\u2728", color: "#2f3f6b" },
  { id: "witch", label: "Witch", glyph: "\u26B1", color: "#4a2a55" },
  { id: "monk", label: "Monk", glyph: "\u270A", color: "#5a3a25" },
  { id: "mercenary", label: "Mercenary", glyph: "\u2620", color: "#4a3a2a" },
  { id: "huntress", label: "Huntress", glyph: "\u27B9", color: "#3a4a55" },
  { id: "druid", label: "Druid", glyph: "\u2618", color: "#3e5a3a" },
];

/**
 * Outer ring, clockwise from 12 o'clock, matching the mockup arrangement.
 */
export const WEAPONS: PoeWeapon[] = [
  { id: "spear", label: "Spear", glyph: "\u2191", color: "#3a2e1f" },
  { id: "quarterstaff", label: "Quarterstaff", glyph: "\u2225", color: "#4a3a1f" },
  { id: "bow", label: "Bow", glyph: "\u27B2", color: "#2f4a2a" },
  { id: "crossbow", label: "Crossbow", glyph: "\u271B", color: "#2a4a3a" },
  { id: "wand", label: "Wand", glyph: "\u2735", color: "#2a3a5a" },
  { id: "staff", label: "Staff", glyph: "\u2020", color: "#3a2a5a" },
  { id: "talisman", label: "Talisman", glyph: "\u269A", color: "#4a2a4a" },
  { id: "sceptre", label: "Sceptre", glyph: "\u26B2", color: "#4a2a3a" },
  { id: "shield", label: "Shield", glyph: "\u26E8", color: "#3a2a2a" },
  { id: "unarmed", label: "Unarmed", glyph: "\u270A", color: "#3a3a3a" },
  { id: "mace", label: "Mace", glyph: "\u2692", color: "#4a3a2a" },
];
