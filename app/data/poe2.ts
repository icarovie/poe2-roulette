export type PoeClass = {
  id: string;
  label: string;
  iconSrc: string;
};

export type PoeWeapon = {
  id: string;
  label: string;
  iconSrc: string;
};

/**
 * Inner ring, clockwise from 12 o'clock, matching the mockup arrangement.
 * The image is the slice background; no per-slice color is used.
 */
export const CLASSES: PoeClass[] = [
  { id: "warrior", label: "Warrior", iconSrc: "/poe2/classes/warrior.png" },
  { id: "ranger", label: "Ranger", iconSrc: "/poe2/classes/ranger.png" },
  { id: "sorceress", label: "Sorceress", iconSrc: "/poe2/classes/sorceress.png" },
  { id: "witch", label: "Witch", iconSrc: "/poe2/classes/witch.png" },
  { id: "monk", label: "Monk", iconSrc: "/poe2/classes/monk.png" },
  { id: "mercenary", label: "Mercenary", iconSrc: "/poe2/classes/mercenary.png" },
  { id: "huntress", label: "Huntress", iconSrc: "/poe2/classes/huntress.png" },
  { id: "druid", label: "Druid", iconSrc: "/poe2/classes/druid.png" },
];

/**
 * Outer ring, clockwise from 12 o'clock, matching the mockup arrangement.
 */
export const WEAPONS: PoeWeapon[] = [
  { id: "spear", label: "Spear", iconSrc: "/poe2/weapons/spear.png" },
  { id: "quarterstaff", label: "Quarterstaff", iconSrc: "/poe2/weapons/quarterstaff.png" },
  { id: "bow", label: "Bow", iconSrc: "/poe2/weapons/bow.png" },
  { id: "crossbow", label: "Crossbow", iconSrc: "/poe2/weapons/crossbow.png" },
  { id: "wand", label: "Wand", iconSrc: "/poe2/weapons/wand.png" },
  { id: "staff", label: "Staff", iconSrc: "/poe2/weapons/staff.png" },
  { id: "talisman", label: "Talisman", iconSrc: "/poe2/weapons/talisman.png" },
  { id: "sceptre", label: "Sceptre", iconSrc: "/poe2/weapons/sceptre.png" },
  { id: "shield", label: "Shield", iconSrc: "/poe2/weapons/shield.png" },
  { id: "unarmed", label: "Unarmed", iconSrc: "/poe2/weapons/unarmed.png" },
  { id: "mace", label: "Mace", iconSrc: "/poe2/weapons/mace.png" },
];
