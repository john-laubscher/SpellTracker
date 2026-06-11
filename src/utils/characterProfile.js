const normalizeObject = (value, fallback = {}) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  return value;
};

const normalizeStringArray = (value) =>
  Array.isArray(value) ? value.filter((entry) => typeof entry === "string" && entry.trim().length > 0) : [];

const normalizeSpellArray = (value) =>
  Array.isArray(value) ? value.filter((entry) => entry && typeof entry === "object") : [];

export const createEmptySpellLevels = () => ({
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
});

export const createDefaultStats = () => ({
  str: { value: 8, mod: -1 },
  dex: { value: 10, mod: 0 },
  con: { value: 11, mod: 0 },
  int: { value: 13, mod: 1 },
  wis: { value: 15, mod: 2 },
  cha: { value: 17, mod: 3 },
});

const createDefaultWeapons = () => [
  {
    name: "Longsword",
    dmgType: "slashing",
    diceCount: 1,
    diceSize: 8,
    mod: 1,
    statMod: "str",
    proficient: true,
  },
];

export const createDefaultCharacterInfo = (overrides = {}) => {
  const safeOverrides = normalizeObject(overrides);
  const defaultSpellLevels = createEmptySpellLevels();

  return {
    characterName: String(safeOverrides.characterName || "New Character"),
    race: safeOverrides.race || "noRace",
    subrace: safeOverrides.subrace || "noSubrace",
    draconicAncestry: String(safeOverrides.draconicAncestry || ""),
    genieKind: String(safeOverrides.genieKind || ""),
    druidLandType: String(safeOverrides.druidLandType || ""),
    halfElfVersatility: String(safeOverrides.halfElfVersatility || ""),
    divineSoulAffinity: String(safeOverrides.divineSoulAffinity || ""),
    lunarEmbodimentPhase: String(safeOverrides.lunarEmbodimentPhase || ""),
    fightingStyle: String(safeOverrides.fightingStyle || ""),
    additionalFightingStyle: String(safeOverrides.additionalFightingStyle || ""),
    characterClass: safeOverrides.characterClass || "noClass",
    subclass: safeOverrides.subclass || "noSubclass",
    characterLevel: Number.isFinite(Number(safeOverrides.characterLevel))
      ? Math.max(1, Math.trunc(Number(safeOverrides.characterLevel)))
      : 1,
    proficiencyMod: Number.isFinite(Number(safeOverrides.proficiencyMod))
      ? Math.trunc(Number(safeOverrides.proficiencyMod))
      : 2,
    hp: Number.isFinite(Number(safeOverrides.hp)) ? Math.trunc(Number(safeOverrides.hp)) : 0,
    ac: Number.isFinite(Number(safeOverrides.ac)) ? Math.trunc(Number(safeOverrides.ac)) : 10,
    weapons: Array.isArray(safeOverrides.weapons) ? safeOverrides.weapons : createDefaultWeapons(),
    spellcastingMod: Number.isFinite(Number(safeOverrides.spellcastingMod))
      ? Math.trunc(Number(safeOverrides.spellcastingMod))
      : 2,
    wizardSpellCountMod: Number.isFinite(Number(safeOverrides.wizardSpellCountMod))
      ? Math.trunc(Number(safeOverrides.wizardSpellCountMod))
      : 2,
    stats: {
      ...createDefaultStats(),
      ...normalizeObject(safeOverrides.stats),
    },
    classLevels: normalizeObject(safeOverrides.classLevels),
    spellsPrepared: { ...defaultSpellLevels, ...normalizeObject(safeOverrides.spellsPrepared) },
    wizardSpellbook: { ...defaultSpellLevels, ...normalizeObject(safeOverrides.wizardSpellbook) },
    wizardSpellMastery: {
      1: safeOverrides?.wizardSpellMastery?.[1] || safeOverrides?.wizardSpellMastery?.first || null,
      2: safeOverrides?.wizardSpellMastery?.[2] || safeOverrides?.wizardSpellMastery?.second || null,
    },
    wizardSignatureSpells: normalizeSpellArray(safeOverrides.wizardSignatureSpells),
    wizardScribesMasterScriviner: normalizeSpellArray(safeOverrides.wizardScribesMasterScriviner),
    wizardScribesLostSpells: normalizeSpellArray(safeOverrides.wizardScribesLostSpells),
    wizardScribesLostSpellRestCount: Number.isFinite(Number(safeOverrides.wizardScribesLostSpellRestCount))
      ? Math.max(0, Math.trunc(Number(safeOverrides.wizardScribesLostSpellRestCount)))
      : 0,
    magicalSecretsPrepared: normalizeSpellArray(safeOverrides.magicalSecretsPrepared),
    spiritSessionPrepared: normalizeSpellArray(safeOverrides.spiritSessionPrepared),
    arcanaInitiateCantrips: normalizeSpellArray(safeOverrides.arcanaInitiateCantrips),
    blessedWarriorCantrips: normalizeSpellArray(safeOverrides.blessedWarriorCantrips),
    druidicWarriorCantrips: normalizeSpellArray(safeOverrides.druidicWarriorCantrips),
    arcaneMasterySpells: normalizeSpellArray(safeOverrides.arcaneMasterySpells),
    reaperCantrip: safeOverrides.reaperCantrip || null,
    acolyteOfNatureCantrip: safeOverrides.acolyteOfNatureCantrip || null,
    arcaneArcherLoreCantrip: safeOverrides.arcaneArcherLoreCantrip || null,
    arcaneShotOptions: normalizeStringArray(safeOverrides.arcaneShotOptions),
    arcaneShotBonusOptions: Number.isFinite(Number(safeOverrides.arcaneShotBonusOptions))
      ? Math.max(0, Math.trunc(Number(safeOverrides.arcaneShotBonusOptions)))
      : 0,
    battleMasterManeuvers: normalizeStringArray(safeOverrides.battleMasterManeuvers),
    warlockInvocations: normalizeStringArray(safeOverrides.warlockInvocations),
    warlockPactBoon: String(safeOverrides.warlockPactBoon || ""),
    warlockMysticArcanum: normalizeSpellArray(safeOverrides.warlockMysticArcanum),
    metamagicOptions: normalizeStringArray(safeOverrides.metamagicOptions),
    showManeuversInSpellTracker: Boolean(safeOverrides.showManeuversInSpellTracker),
    domainSpellSwaps: normalizeObject(safeOverrides.domainSpellSwaps),
    fourElementsDisciplines: normalizeStringArray(safeOverrides.fourElementsDisciplines),
    arcaneTricksterMageHandOptOut: Boolean(safeOverrides.arcaneTricksterMageHandOptOut),
    runeKnightRunes: normalizeStringArray(safeOverrides.runeKnightRunes),
  };
};

export const normalizeSoulknifeCustomUses = (value) =>
  Array.isArray(value)
    ? value
        .map((entry) => ({
          id: String(entry?.id || "").trim(),
          title: String(entry?.title || "").trim(),
          description: String(entry?.description || ""),
        }))
        .filter((entry) => entry.id && entry.title)
    : [];

export const normalizeCharacterProfile = (profile = {}) => {
  const safeProfile = normalizeObject(profile);
  return {
    characterInfo: createDefaultCharacterInfo(safeProfile.characterInfo),
    featureTrackers: normalizeObject(safeProfile.featureTrackers),
    featureOverrides: normalizeObject(safeProfile.featureOverrides),
    untrackedFeatureChoices: normalizeObject(safeProfile.untrackedFeatureChoices),
    soulknifeCustomUses: normalizeSoulknifeCustomUses(safeProfile.soulknifeCustomUses),
  };
};
