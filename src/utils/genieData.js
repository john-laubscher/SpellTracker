export const GENIE_KIND_DATA = {
  dao: {
    id: "dao",
    name: "Dao",
    element: "Earth",
    damageType: "bludgeoning",
    spells: ["sanctuary", "spike-growth", "meld-into-stone", "stone-shape", "wall-of-stone"],
  },
  djinni: {
    id: "djinni",
    name: "Djinni",
    element: "Air",
    damageType: "thunder",
    spells: ["thunderwave", "gust-of-wind", "wind-wall", "greater-invisibility", "seeming"],
  },
  efreeti: {
    id: "efreeti",
    name: "Efreeti",
    element: "Fire",
    damageType: "fire",
    spells: ["burning-hands", "scorching-ray", "fireball", "fire-shield", "flame-strike"],
  },
  marid: {
    id: "marid",
    name: "Marid",
    element: "Water",
    damageType: "cold",
    spells: ["fog-cloud", "blur", "sleet-storm", "control-water", "cone-of-cold"],
  },
};

export const GENIE_SHARED_SPELLS = [
  { spellLevel: 1, spells: ["detect-evil-and-good"] },
  { spellLevel: 2, spells: ["phantasmal-force"] },
  { spellLevel: 3, spells: ["create-food-and-water"] },
  { spellLevel: 4, spells: ["phantasmal-killer"] },
  { spellLevel: 5, spells: ["creation"] },
  { spellLevel: 9, spells: ["wish"] },
];

const humanizeSpellIndex = (spellIndex) =>
  String(spellIndex || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const GENIE_KIND_OPTIONS = Object.values(GENIE_KIND_DATA).map((kind) => ({
  id: kind.id,
  name: kind.name,
  desc: [
    `Element: ${kind.element}. Genie's Wrath and Elemental Gift use ${kind.damageType} damage/resistance.`,
    `Genie spells: ${GENIE_SHARED_SPELLS.flatMap((row) => row.spells).map(humanizeSpellIndex).join(", ")}.`,
    `${kind.name} spells: ${kind.spells.map(humanizeSpellIndex).join(", ")}.`,
  ],
}));

export const getGenieKindData = (genieKind) => {
  const key = String(genieKind || "").trim().toLowerCase();
  return GENIE_KIND_DATA[key] || null;
};

export const getGenieExpandedSpellOptions = (genieKind) => {
  const kindData = getGenieKindData(genieKind);
  return GENIE_SHARED_SPELLS.map((row, idx) => ({
    spellLevel: row.spellLevel,
    spells: [...row.spells, ...(kindData && row.spellLevel <= 5 ? [kindData.spells[idx]] : [])].filter(Boolean),
  }));
};

export const getGenieBenefitsSummaryLines = (genieKind) => {
  const kindData = getGenieKindData(genieKind);
  const sharedSpellNames = GENIE_SHARED_SPELLS.flatMap((row) => row.spells).map(humanizeSpellIndex).join(", ");

  if (!kindData) {
    return [
      "Patron Kind: not selected yet.",
      `Always expanded: ${sharedSpellNames}.`,
      "Choose a genie kind to see its damage type, resistance, and additional expanded spells.",
    ];
  }

  return [
    `Patron Kind: ${kindData.name} (${kindData.element}).`,
    `Associated damage/resistance: ${kindData.damageType}.`,
    `Always expanded: ${sharedSpellNames}.`,
    `${kindData.name} expanded spells: ${kindData.spells.map(humanizeSpellIndex).join(", ")}.`,
  ];
};
