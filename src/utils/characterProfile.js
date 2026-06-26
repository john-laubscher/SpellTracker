import {
  buildMergedPreparedSpells,
  buildMergedWizardSpellbook,
  createEmptySpellLevels,
  normalizeSpellCollectionsByClass,
} from "./spellcastingState";
import { normalizeFightingStylesByClass } from "./fightingStyles";

const normalizeObject = (value, fallback = {}) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  return value;
};

const normalizeStringArray = (value) =>
  Array.isArray(value) ? value.filter((entry) => typeof entry === "string" && entry.trim().length > 0) : [];

const normalizeSpellArray = (value) =>
  Array.isArray(value) ? value.filter((entry) => entry && typeof entry === "object") : [];

const normalizeClassLevels = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce((acc, [key, rawValue]) => {
    const normalizedKey = String(key || "").trim();
    const normalizedValue = Number(rawValue);
    if (!normalizedKey || !Number.isFinite(normalizedValue) || normalizedValue <= 0) return acc;
    acc[normalizedKey] = Math.max(1, Math.trunc(normalizedValue));
    return acc;
  }, {});
};

const normalizeDragonbornSubrace = (race, subrace, draconicAncestry) => {
  if (race !== "Dragonborn" || subrace !== "Chromatic/Metallic") return subrace;

  const metallicAncestries = new Set(["Brass", "Bronze", "Copper", "Gold", "Silver"]);
  if (metallicAncestries.has(String(draconicAncestry || ""))) return "Metallic";
  return "Chromatic";
};

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
  const primaryCharacterClass = safeOverrides.characterClass || "noClass";
  const primaryCharacterLevel = Number.isFinite(Number(safeOverrides.characterLevel))
    ? Math.max(1, Math.trunc(Number(safeOverrides.characterLevel)))
    : 1;
  const normalizedClassLevels = normalizeClassLevels(safeOverrides.classLevels);
  if (primaryCharacterClass !== "noClass" && !normalizedClassLevels[primaryCharacterClass]) {
    normalizedClassLevels[primaryCharacterClass] = primaryCharacterLevel;
  }
  const secondaryCharacterLevel = Number.isFinite(Number(safeOverrides.secondaryCharacterLevel))
    ? Math.max(1, Math.trunc(Number(safeOverrides.secondaryCharacterLevel)))
    : 1;
  if (
    Boolean(safeOverrides.multiclassEnabled) &&
    safeOverrides.secondaryCharacterClass &&
    safeOverrides.secondaryCharacterClass !== "noClass" &&
    !normalizedClassLevels[safeOverrides.secondaryCharacterClass]
  ) {
    normalizedClassLevels[safeOverrides.secondaryCharacterClass] = secondaryCharacterLevel;
  }
  const totalCharacterLevel =
    Object.values(normalizedClassLevels).reduce((sum, value) => sum + Math.max(0, Math.trunc(Number(value) || 0)), 0) ||
    primaryCharacterLevel;
  const normalizedSubrace = normalizeDragonbornSubrace(
    safeOverrides.race,
    safeOverrides.subrace,
    safeOverrides.draconicAncestry
  );
  const fightingStylesByClass = normalizeFightingStylesByClass(safeOverrides.fightingStylesByClass);
  const legacyFightingStyle = String(safeOverrides.fightingStyle || "");
  if (
    primaryCharacterClass !== "noClass" &&
    legacyFightingStyle &&
    !fightingStylesByClass[primaryCharacterClass]
  ) {
    fightingStylesByClass[primaryCharacterClass] = legacyFightingStyle;
  }

  const preparedSpellsByClass = normalizeSpellCollectionsByClass(safeOverrides.preparedSpellsByClass);
  if (
    primaryCharacterClass !== "noClass" &&
    !preparedSpellsByClass[primaryCharacterClass] &&
    safeOverrides.spellsPrepared
  ) {
    preparedSpellsByClass[primaryCharacterClass] = { ...defaultSpellLevels, ...normalizeObject(safeOverrides.spellsPrepared) };
  }

  const wizardSpellbookByClass = normalizeSpellCollectionsByClass(safeOverrides.wizardSpellbookByClass);
  if (!wizardSpellbookByClass.wizard && safeOverrides.wizardSpellbook) {
    wizardSpellbookByClass.wizard = { ...defaultSpellLevels, ...normalizeObject(safeOverrides.wizardSpellbook) };
  }

  const mergedPreparedSpells = buildMergedPreparedSpells(
    { ...safeOverrides, preparedSpellsByClass },
    { preparedSpellsByClass }
  );
  const mergedWizardSpellbook = buildMergedWizardSpellbook(
    { ...safeOverrides, wizardSpellbookByClass },
    { wizardSpellbookByClass }
  );

  return {
    characterName: String(safeOverrides.characterName || "New Character"),
    race: safeOverrides.race || "noRace",
    subrace: normalizedSubrace || "noSubrace",
    draconicAncestry: String(safeOverrides.draconicAncestry || ""),
    genieKind: String(safeOverrides.genieKind || ""),
    druidLandType: String(safeOverrides.druidLandType || ""),
    halfElfVersatility: String(safeOverrides.halfElfVersatility || ""),
    markOfWardingDailyCast: String(safeOverrides.markOfWardingDailyCast || ""),
    divineSoulAffinity: String(safeOverrides.divineSoulAffinity || ""),
    lunarEmbodimentPhase: String(safeOverrides.lunarEmbodimentPhase || ""),
    fightingStyle: String(fightingStylesByClass[primaryCharacterClass] || legacyFightingStyle || ""),
    fightingStylesByClass,
    additionalFightingStyle: String(safeOverrides.additionalFightingStyle || ""),
    characterClass: primaryCharacterClass,
    subclass: safeOverrides.subclass || "noSubclass",
    multiclassEnabled: Boolean(safeOverrides.multiclassEnabled),
    secondaryCharacterClass: safeOverrides.secondaryCharacterClass || "noClass",
    secondarySubclass: safeOverrides.secondarySubclass || "noSubclass",
    secondaryCharacterLevel: secondaryCharacterLevel,
    characterLevel: primaryCharacterLevel,
    totalCharacterLevel: Math.max(1, totalCharacterLevel),
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
    classLevels: normalizedClassLevels,
    preparedSpellsByClass,
    spellsPrepared: mergedPreparedSpells,
    wizardSpellbookByClass,
    wizardSpellbook: mergedWizardSpellbook,
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
    halfElfVersatilityCantrip: safeOverrides.halfElfVersatilityCantrip || null,
    forestGnomeCantrip: safeOverrides.forestGnomeCantrip || null,
    markOfScribingCantrip: safeOverrides.markOfScribingCantrip || null,
    drowMagicCantrip: safeOverrides.drowMagicCantrip || null,
    pallidMoonweaverCantrip: safeOverrides.pallidMoonweaverCantrip || null,
    markOfShadowCantrip: safeOverrides.markOfShadowCantrip || null,
    astralElfCantrip: safeOverrides.astralElfCantrip || null,
    vahadarCantrip: safeOverrides.vahadarCantrip || null,
    mulDayaMagicCantrip: safeOverrides.mulDayaMagicCantrip || null,
    markOfStormCantrip: safeOverrides.markOfStormCantrip || null,
    spellsmithCantrip: safeOverrides.spellsmithCantrip || null,
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
    showArcaneShotsInSpellTracker: Boolean(safeOverrides.showArcaneShotsInSpellTracker),
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
