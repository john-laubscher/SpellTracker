import ClassesData from "../components/ClassesData";
import spellTables from "../components/spellTables";

export const NO_CLASS = "noClass";
export const NO_SUBCLASS = "noSubclass";

export const MULTICLASS_REQUIREMENTS = {
  barbarian: [{ stat: "str", min: 13 }],
  bard: [{ stat: "cha", min: 13 }],
  cleric: [{ stat: "wis", min: 13 }],
  druid: [{ stat: "wis", min: 13 }],
  fighter: [{ stat: "str", min: 13, label: "Strength 13" }, { stat: "dex", min: 13, label: "Dexterity 13" }],
  monk: [{ stat: "dex", min: 13 }, { stat: "wis", min: 13 }],
  paladin: [{ stat: "str", min: 13 }, { stat: "cha", min: 13 }],
  ranger: [{ stat: "dex", min: 13 }, { stat: "wis", min: 13 }],
  rogue: [{ stat: "dex", min: 13 }],
  sorcerer: [{ stat: "cha", min: 13 }],
  sorceror: [{ stat: "cha", min: 13 }],
  warlock: [{ stat: "cha", min: 13 }],
  wizard: [{ stat: "int", min: 13 }],
};

const FULL_CASTER_CLASSES = new Set(["bard", "cleric", "druid", "sorcerer", "wizard"]);
const HALF_CASTER_CLASSES = new Set(["paladin", "ranger"]);
const THIRD_CASTER_TABLE_KEYS = new Set(["fighterEldritchKnight", "rogueArcaneTrickster"]);
const SPELL_SLOT_LEVEL_KEYS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];

export const getNormalizedClassKey = (classKey) => {
  if (String(classKey || "") === "sorceror") return "sorcerer";
  return String(classKey || "");
};

const sanitizeLevel = (value, fallback = 0) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.trunc(numeric));
};

const hasSlotsOnRow = (row) =>
  SPELL_SLOT_LEVEL_KEYS.some((slotKey) => Number(row?.[slotKey] || 0) > 0) || Number(row?.spellSlots || 0) > 0;

export const buildClassLevelsMap = (characterInfo = {}) => {
  const raw = characterInfo?.classLevels && typeof characterInfo.classLevels === "object" ? characterInfo.classLevels : {};
  const normalized = {};

  Object.entries(raw).forEach(([key, value]) => {
    const classKey = getNormalizedClassKey(key);
    const level = sanitizeLevel(value, 0);
    if (!classKey || classKey === NO_CLASS || level <= 0) return;
    normalized[classKey] = level;
  });

  const primaryClass = getNormalizedClassKey(characterInfo?.characterClass);
  const primaryLevel = sanitizeLevel(characterInfo?.characterLevel, 1);
  if (primaryClass && primaryClass !== NO_CLASS && !normalized[primaryClass]) {
    normalized[primaryClass] = primaryLevel;
  }

  const secondaryClass = getNormalizedClassKey(characterInfo?.secondaryCharacterClass);
  const secondaryLevel = sanitizeLevel(characterInfo?.secondaryCharacterLevel, 0);
  if (secondaryClass && secondaryClass !== NO_CLASS && secondaryLevel > 0) {
    normalized[secondaryClass] = secondaryLevel;
  }

  return normalized;
};

export const getClassLevel = (characterInfo = {}, classKey) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  if (!normalizedClassKey || normalizedClassKey === NO_CLASS) return 0;
  const classLevels = buildClassLevelsMap(characterInfo);
  return sanitizeLevel(classLevels?.[normalizedClassKey], 0);
};

export const getClassEntries = (characterInfo = {}) => {
  const classLevels = buildClassLevelsMap(characterInfo);
  const primaryClass = getNormalizedClassKey(characterInfo?.characterClass);
  const secondaryClass = getNormalizedClassKey(characterInfo?.secondaryCharacterClass);
  const primaryLevel = sanitizeLevel(classLevels?.[primaryClass], sanitizeLevel(characterInfo?.characterLevel, 1));
  const secondaryLevel = sanitizeLevel(classLevels?.[secondaryClass], sanitizeLevel(characterInfo?.secondaryCharacterLevel, 0));

  const primary =
    primaryClass && primaryClass !== NO_CLASS
      ? {
          slot: "primary",
          classKey: primaryClass,
          subclassKey: String(characterInfo?.subclass || NO_SUBCLASS),
          level: primaryLevel,
        }
      : null;

  const secondary =
    Boolean(characterInfo?.multiclassEnabled) && secondaryClass && secondaryClass !== NO_CLASS
      ? {
          slot: "secondary",
          classKey: secondaryClass,
          subclassKey: String(characterInfo?.secondarySubclass || NO_SUBCLASS),
          level: secondaryLevel,
        }
      : null;

  return [primary, secondary].filter((entry) => entry && entry.level > 0);
};

export const getTotalCharacterLevel = (characterInfo = {}) => {
  const entries = getClassEntries(characterInfo);
  if (entries.length === 0) return Math.max(1, sanitizeLevel(characterInfo?.characterLevel, 1));
  const total = entries.reduce((sum, entry) => sum + sanitizeLevel(entry.level, 0), 0);
  return Math.max(1, total);
};

export const formatClassLevelSummary = (characterInfo = {}) => {
  const entries = getClassEntries(characterInfo);
  if (entries.length === 0) return "";
  return entries
    .map((entry) => {
      const classKey = getNormalizedClassKey(entry.classKey);
      const label = classKey ? classKey.charAt(0).toUpperCase() + classKey.slice(1) : "Class";
      return `${label} ${entry.level}`;
    })
    .join(" / ");
};

export const getMulticlassRequirementLabel = (classKey) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  const requirements = MULTICLASS_REQUIREMENTS?.[normalizedClassKey] || [];
  if (normalizedClassKey === "fighter") return "Strength 13 or Dexterity 13";
  return requirements
    .map((requirement) => requirement?.label || `${String(requirement?.stat || "").toUpperCase()} ${requirement?.min}`)
    .join(" and ");
};

export const getUnmetMulticlassRequirements = (characterInfo = {}, classKey) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  const requirements = MULTICLASS_REQUIREMENTS?.[normalizedClassKey] || [];
  const stats = characterInfo?.stats || {};

  if (normalizedClassKey === "fighter") {
    const strValue = sanitizeLevel(stats?.str?.value, 0);
    const dexValue = sanitizeLevel(stats?.dex?.value, 0);
    return strValue >= 13 || dexValue >= 13 ? [] : [{ stat: "str_or_dex", label: "Strength 13 or Dexterity 13" }];
  }

  return requirements.filter((requirement) => sanitizeLevel(stats?.[requirement.stat]?.value, 0) < sanitizeLevel(requirement.min, 0));
};

export const getSpellcastingDetailsForEntry = (entry = {}) => {
  const normalizedClassKey = getNormalizedClassKey(entry?.classKey);
  const normalizedLevel = sanitizeLevel(entry?.level, 0);
  const normalizedSubclassKey = String(entry?.subclassKey || NO_SUBCLASS);
  if (!normalizedClassKey || normalizedClassKey === NO_CLASS || normalizedLevel <= 0) return null;

  const classMeta = ClassesData?.[normalizedClassKey] || null;
  if (!classMeta) return null;

  if (normalizedClassKey === "warlock") {
    const row = spellTables?.warlock?.[normalizedLevel] || null;
    return {
      classKey: normalizedClassKey,
      subclassKey: normalizedSubclassKey,
      level: normalizedLevel,
      slotType: "pact",
      progression: "pact",
      spellListClassKey: "warlock",
      spellcastingAbility: String(classMeta?.spellcastingAbility || "cha"),
      spellTableKey: "warlock",
      row,
      hasSlots: hasSlotsOnRow(row),
    };
  }

  const subclassMeta = classMeta?.subclasses?.[normalizedSubclassKey] || null;
  const subclassSpellcasting = subclassMeta?.spellcasting || null;
  if (subclassSpellcasting && normalizedLevel >= sanitizeLevel(subclassSpellcasting?.startsAtLevel, 1)) {
    const tableKey = String(subclassSpellcasting?.spellTableKey || "");
    const row = spellTables?.[tableKey]?.[normalizedLevel] || null;
    const progression = THIRD_CASTER_TABLE_KEYS.has(tableKey)
      ? "third"
      : HALF_CASTER_CLASSES.has(normalizedClassKey)
        ? "half"
        : FULL_CASTER_CLASSES.has(normalizedClassKey)
          ? "full"
          : "full";
    return {
      classKey: normalizedClassKey,
      subclassKey: normalizedSubclassKey,
      level: normalizedLevel,
      slotType: "spellcasting",
      progression,
      spellListClassKey: String(subclassSpellcasting?.spellListClassKey || normalizedClassKey),
      spellcastingAbility: String(subclassSpellcasting?.spellcastingAbility || classMeta?.spellcastingAbility || "nonCaster"),
      spellTableKey: tableKey,
      row,
      hasSlots: hasSlotsOnRow(row),
    };
  }

  if (classMeta?.isSpellCaster === "nonCaster" || classMeta?.spellcastingAbility === "nonCaster") return null;
  const row = spellTables?.[normalizedClassKey]?.[normalizedLevel] || null;
  const progression = FULL_CASTER_CLASSES.has(normalizedClassKey)
    ? "full"
    : HALF_CASTER_CLASSES.has(normalizedClassKey)
      ? "half"
      : null;

  if (!progression) return null;

  return {
    classKey: normalizedClassKey,
    subclassKey: normalizedSubclassKey,
    level: normalizedLevel,
    slotType: "spellcasting",
    progression,
    spellListClassKey: normalizedClassKey,
    spellcastingAbility: String(classMeta?.spellcastingAbility || "nonCaster"),
    spellTableKey: normalizedClassKey,
    row,
    hasSlots: hasSlotsOnRow(row),
  };
};

export const hasSpellcastingForClass = (entry = {}) => {
  const details = getSpellcastingDetailsForEntry(entry);
  return Boolean(details?.hasSlots);
};

export const getSpellcastingEntries = (characterInfo = {}) =>
  getClassEntries(characterInfo)
    .map((entry) => ({
      ...entry,
      spellcasting: getSpellcastingDetailsForEntry(entry),
    }))
    .filter((entry) => entry?.spellcasting);

export const getPreparedCasterEntries = (characterInfo = {}) =>
  getSpellcastingEntries(characterInfo).filter((entry) => entry?.spellcasting?.slotType === "spellcasting");

export const getPactCasterEntries = (characterInfo = {}) =>
  getSpellcastingEntries(characterInfo).filter((entry) => entry?.spellcasting?.slotType === "pact");

export const getMulticlassSpellcasterLevel = (characterInfo = {}) =>
  getPreparedCasterEntries(characterInfo).reduce((sum, entry) => {
    const progression = entry?.spellcasting?.progression;
    const level = sanitizeLevel(entry?.level, 0);
    if (progression === "full") return sum + level;
    if (progression === "half") return sum + Math.floor(level / 2);
    if (progression === "third") return sum + Math.floor(level / 3);
    return sum;
  }, 0);

export const usesMulticlassSpellcasterTable = (characterInfo = {}) => {
  const entries = getPreparedCasterEntries(characterInfo);
  return entries.length > 1 && getMulticlassSpellcasterLevel(characterInfo) > 0;
};

export const getEffectiveSpellSlotsRow = (characterInfo = {}) => {
  if (!usesMulticlassSpellcasterTable(characterInfo)) return null;
  const casterLevel = getMulticlassSpellcasterLevel(characterInfo);
  if (casterLevel <= 0) return null;
  return spellTables?.multiclassSpellcaster?.[casterLevel] || null;
};

export const getPactMagicSlotsRow = (characterInfo = {}) => {
  const pactEntries = getPactCasterEntries(characterInfo);
  if (pactEntries.length === 0) return null;
  return pactEntries[0]?.spellcasting?.row || null;
};

export const getSpellSlotSummary = (characterInfo = {}) => {
  const preparedEntries = getPreparedCasterEntries(characterInfo);
  const pactEntries = getPactCasterEntries(characterInfo);
  const combinedSpellcastingRow =
    preparedEntries.length > 1
      ? getEffectiveSpellSlotsRow(characterInfo)
      : preparedEntries[0]?.spellcasting?.row || null;
  const pactMagicRow = pactEntries[0]?.spellcasting?.row || null;

  return {
    hasCombinedSpellcasting: Boolean(combinedSpellcastingRow),
    hasPactMagic: Boolean(pactMagicRow),
    combinedSpellcastingRow,
    pactMagicRow,
    multiclassSpellcasterLevel: getMulticlassSpellcasterLevel(characterInfo),
    preparedEntries,
    pactEntries,
  };
};

export const getSpellcastingEntryForSlot = (characterInfo = {}, slot = "primary") =>
  getSpellcastingEntries(characterInfo).find((entry) => String(entry?.slot || "") === String(slot || ""));
