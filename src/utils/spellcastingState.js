import { getClassEntries, getNormalizedClassKey } from "./multiclassing";

export const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const createEmptySpellLevels = () =>
  SPELL_LEVELS.reduce((acc, level) => {
    acc[level] = [];
    return acc;
  }, {});

const normalizeObject = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
};

const normalizeSpellArray = (value) =>
  Array.isArray(value) ? value.filter((entry) => entry && typeof entry === "object") : [];

const normalizeSpellLevels = (value) => {
  const safe = normalizeObject(value);
  const next = createEmptySpellLevels();
  SPELL_LEVELS.forEach((level) => {
    next[level] = normalizeSpellArray(safe[level]);
  });
  return next;
};

export const normalizeSpellCollectionsByClass = (value) => {
  const safe = normalizeObject(value);
  return Object.entries(safe).reduce((acc, [classKey, spellLevels]) => {
    const normalizedClassKey = getNormalizedClassKey(classKey);
    if (!normalizedClassKey) return acc;
    acc[normalizedClassKey] = normalizeSpellLevels(spellLevels);
    return acc;
  }, {});
};

const dedupeSpells = (spells) => {
  const seen = new Set();
  return normalizeSpellArray(spells).filter((spell) => {
    const index = String(spell?.index || "");
    if (!index || seen.has(index)) return false;
    seen.add(index);
    return true;
  });
};

const withClassMetadata = (spell, classKey) => {
  if (!spell || typeof spell !== "object") return spell;
  const normalizedClassKey = getNormalizedClassKey(classKey);
  if (!normalizedClassKey) return spell;
  const priorKeys = Array.isArray(spell?.spelltrackerClassKeys) ? spell.spelltrackerClassKeys : [];
  const classKeys = Array.from(
    new Set([...priorKeys.map((key) => getNormalizedClassKey(key)).filter(Boolean), normalizedClassKey])
  );
  return {
    ...spell,
    spelltrackerClassKey: String(spell?.spelltrackerClassKey || normalizedClassKey),
    spelltrackerClassKeys: classKeys,
  };
};

const getKnownClassKeys = (characterInfo = {}) => {
  const byClass = normalizeSpellCollectionsByClass(characterInfo?.preparedSpellsByClass);
  const classKeys = new Set(Object.keys(byClass));
  getClassEntries(characterInfo).forEach((entry) => {
    const classKey = getNormalizedClassKey(entry?.classKey);
    if (classKey) classKeys.add(classKey);
  });
  return Array.from(classKeys);
};

export const ensureClassSpellCollection = (characterInfo = {}, classKey) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  if (!normalizedClassKey) return createEmptySpellLevels();
  const byClass = normalizeSpellCollectionsByClass(characterInfo?.preparedSpellsByClass);
  return byClass[normalizedClassKey] || createEmptySpellLevels();
};

export const getPreparedSpellsForClass = (characterInfo = {}, classKey, level = null) => {
  const collection = ensureClassSpellCollection(characterInfo, classKey);
  if (level === null || level === undefined) return collection;
  return Array.isArray(collection?.[level]) ? collection[level].map((spell) => withClassMetadata(spell, classKey)) : [];
};

export const getWizardSpellbookForClass = (characterInfo = {}, classKey = "wizard", level = null) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  const byClass = normalizeSpellCollectionsByClass(characterInfo?.wizardSpellbookByClass);
  const collection = byClass[normalizedClassKey] || createEmptySpellLevels();
  if (level === null || level === undefined) return collection;
  return Array.isArray(collection?.[level]) ? collection[level].map((spell) => withClassMetadata(spell, classKey)) : [];
};

export const getLegacyBonusPreparedSpells = (characterInfo = {}) => {
  const legacy = normalizeSpellLevels(characterInfo?.spellsPrepared);
  const classCollections = getKnownClassKeys(characterInfo).map((classKey) => getPreparedSpellsForClass(characterInfo, classKey));

  return SPELL_LEVELS.reduce((acc, level) => {
    const classIndexes = new Set(
      classCollections.flatMap((collection) =>
        (Array.isArray(collection?.[level]) ? collection[level] : []).map((spell) => String(spell?.index || ""))
      )
    );
    acc[level] = legacy[level].filter((spell) => !classIndexes.has(String(spell?.index || "")));
    return acc;
  }, createEmptySpellLevels());
};

export const buildMergedPreparedSpells = (characterInfo = {}, overrides = {}) => {
  const base = {
    ...characterInfo,
    ...overrides,
  };
  const classKeys = getKnownClassKeys(base);
  const bonusByLevel = getLegacyBonusPreparedSpells(base);
  return SPELL_LEVELS.reduce((acc, level) => {
    const merged = [];
    classKeys.forEach((classKey) => {
      merged.push(...getPreparedSpellsForClass(base, classKey, level).map((spell) => withClassMetadata(spell, classKey)));
    });
    merged.push(...bonusByLevel[level]);
    acc[level] = dedupeSpells(merged);
    return acc;
  }, createEmptySpellLevels());
};

export const buildMergedWizardSpellbook = (characterInfo = {}, overrides = {}) => {
  const base = {
    ...characterInfo,
    ...overrides,
  };
  const byClass = normalizeSpellCollectionsByClass(base?.wizardSpellbookByClass);
  const classKeys = Object.keys(byClass);
  if (classKeys.length === 0) return normalizeSpellLevels(base?.wizardSpellbook);

  return SPELL_LEVELS.reduce((acc, level) => {
    const merged = classKeys.flatMap((classKey) =>
      getWizardSpellbookForClass(base, classKey, level).map((spell) => withClassMetadata(spell, classKey))
    );
    acc[level] = dedupeSpells(merged);
    return acc;
  }, createEmptySpellLevels());
};

export const updatePreparedSpellsForClass = (characterInfo = {}, classKey, level, updater) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  if (!normalizedClassKey) return characterInfo;

  const currentByClass = normalizeSpellCollectionsByClass(characterInfo?.preparedSpellsByClass);
  const currentCollection = currentByClass[normalizedClassKey] || createEmptySpellLevels();
  const currentLevelSpells = Array.isArray(currentCollection?.[level]) ? currentCollection[level] : [];
  const nextLevelSpells = dedupeSpells(
    (typeof updater === "function" ? updater(currentLevelSpells) : updater).map((spell) =>
      withClassMetadata(spell, normalizedClassKey)
    )
  );
  const nextByClass = {
    ...currentByClass,
    [normalizedClassKey]: {
      ...currentCollection,
      [level]: nextLevelSpells,
    },
  };

  return {
    ...characterInfo,
    preparedSpellsByClass: nextByClass,
    spellsPrepared: buildMergedPreparedSpells(characterInfo, { preparedSpellsByClass: nextByClass }),
  };
};

export const updateWizardSpellbookForClass = (characterInfo = {}, classKey, level, updater) => {
  const normalizedClassKey = getNormalizedClassKey(classKey);
  if (!normalizedClassKey) return characterInfo;

  const currentByClass = normalizeSpellCollectionsByClass(characterInfo?.wizardSpellbookByClass);
  const currentCollection = currentByClass[normalizedClassKey] || createEmptySpellLevels();
  const currentLevelSpells = Array.isArray(currentCollection?.[level]) ? currentCollection[level] : [];
  const nextLevelSpells = dedupeSpells(
    (typeof updater === "function" ? updater(currentLevelSpells) : updater).map((spell) =>
      withClassMetadata(spell, normalizedClassKey)
    )
  );
  const nextByClass = {
    ...currentByClass,
    [normalizedClassKey]: {
      ...currentCollection,
      [level]: nextLevelSpells,
    },
  };

  return {
    ...characterInfo,
    wizardSpellbookByClass: nextByClass,
    wizardSpellbook: buildMergedWizardSpellbook(characterInfo, { wizardSpellbookByClass: nextByClass }),
  };
};
