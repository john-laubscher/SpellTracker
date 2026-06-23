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

  const primary = primaryClass && primaryClass !== NO_CLASS
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

export const isStandardSpellcasterClass = (classKey) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  return FULL_CASTER_CLASSES.has(normalizedClassKey) || HALF_CASTER_CLASSES.has(normalizedClassKey);
};

export const hasSpellcastingForClass = ({ classKey, subclassKey, level }) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  const normalizedLevel = sanitizeLevel(level, 0);
  if (!normalizedClassKey || normalizedClassKey === NO_CLASS || normalizedLevel <= 0) return false;

  const classMeta = ClassesData?.[normalizedClassKey] || null;
  if (!classMeta) return false;

  const subclassMeta = classMeta?.subclasses?.[subclassKey] || null;
  const subclassSpellcasting = subclassMeta?.spellcasting || null;
  if (subclassSpellcasting && normalizedLevel >= sanitizeLevel(subclassSpellcasting?.startsAtLevel, 1)) {
    const tableKey = String(subclassSpellcasting?.spellTableKey || "");
    const row = spellTables?.[tableKey]?.[normalizedLevel] || null;
    return SPELL_SLOT_LEVEL_KEYS.some((slotKey) => Number(row?.[slotKey] || 0) > 0) || Number(row?.spellSlots || 0) > 0;
  }

  if (classMeta?.isSpellCaster === "nonCaster" || classMeta?.spellcastingAbility === "nonCaster") return false;
  const row = spellTables?.[normalizedClassKey]?.[normalizedLevel] || null;
  return SPELL_SLOT_LEVEL_KEYS.some((slotKey) => Number(row?.[slotKey] || 0) > 0) || Number(row?.spellSlots || 0) > 0;
};

export const getMulticlassSpellcasterLevel = (characterInfo = {}) => {
  return getClassEntries(characterInfo).reduce((sum, entry) => {
    const classKey = getNormalizedClassKey(entry.classKey);
    const level = sanitizeLevel(entry.level, 0);
    if (FULL_CASTER_CLASSES.has(classKey)) return sum + level;
    if (HALF_CASTER_CLASSES.has(classKey)) return sum + Math.floor(level / 2);
    return sum;
  }, 0);
};

export const usesMulticlassSpellcasterTable = (characterInfo = {}) => {
  if (!characterInfo?.multiclassEnabled) return false;
  const entries = getClassEntries(characterInfo);
  if (entries.length !== 2) return false;
  return entries.every((entry) => isStandardSpellcasterClass(entry.classKey) && hasSpellcastingForClass(entry));
};

export const getEffectiveSpellSlotsRow = (characterInfo = {}) => {
  if (!usesMulticlassSpellcasterTable(characterInfo)) return null;
  const casterLevel = getMulticlassSpellcasterLevel(characterInfo);
  if (casterLevel <= 0) return null;
  return spellTables?.multiclassSpellcaster?.[casterLevel] || null;
};
