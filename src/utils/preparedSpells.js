import ClassesData from "../components/ClassesData";
import spellTables from "../components/spellTables";
import { getClassEntries, getSpellcastingDetailsForEntry } from "./multiclassing";
import { SPELL_LEVELS, createEmptySpellLevels, getLegacyBonusPreparedSpells, getPreparedSpellsForClass } from "./spellcastingState";

const getStatModForEntry = (characterInfo = {}, spellcastingAbility = "nonCaster") => {
  if (!spellcastingAbility || spellcastingAbility === "nonCaster") return 0;
  const stats = characterInfo?.stats || {};
  const statModRaw = stats?.[spellcastingAbility]?.mod;
  return Number.isFinite(Number(statModRaw)) ? Number(statModRaw) : Number(characterInfo?.spellcastingMod) || 0;
};

export const calculatePreparedSpellLimitForClass = (characterInfo = {}, entry = {}) => {
  const classKey = String(entry?.classKey || "");
  const classLevel = Number(entry?.level) || 0;
  const classMeta = ClassesData?.[classKey] || null;
  const spellcasting = getSpellcastingDetailsForEntry(entry);
  if (!classMeta || !spellcasting) return 0;

  const spellcastingAbility = String(spellcasting?.spellcastingAbility || classMeta?.spellcastingAbility || "nonCaster");
  const statMod = getStatModForEntry(characterInfo, spellcastingAbility);

  if (spellcasting?.spellTableKey && spellcasting?.row?.spellsKnown >= 0) {
    return Number(spellcasting.row.spellsKnown) || 0;
  }

  const isSpellCaster = classMeta?.isSpellCaster;
  if (isSpellCaster === "halfCaster") {
    if (classLevel < 2) return 0;
    return Math.max(1, Math.floor(0.5 * classLevel + statMod));
  }

  if (classKey === "wizard") return classLevel + statMod;
  if (isSpellCaster === "fullCaster") return classLevel + statMod;

  if (spellcasting?.progression === "third") {
    return Number(spellTables?.[spellcasting.spellTableKey]?.[classLevel]?.spellsKnown) || 0;
  }

  return 0;
};

export const calculateTotalPreparedSpells = (characterInfo = {}) =>
  getClassEntries(characterInfo).reduce((sum, entry) => sum + calculatePreparedSpellLimitForClass(characterInfo, entry), 0);

export const calculateActualPreparedSpellsForClass = (characterInfo = {}, classKey) =>
  SPELL_LEVELS.reduce((sum, level) => {
    if (level === 0) return sum;
    return (
      sum +
      getPreparedSpellsForClass(characterInfo, classKey, level).filter((spell) => !spell?.spelltrackerDoesNotCount).length
    );
  }, 0);

export const calculateActualPreparedSpells = (characterInfo = {}) => {
  const classTotal = getClassEntries(characterInfo).reduce(
    (sum, entry) => sum + calculateActualPreparedSpellsForClass(characterInfo, entry.classKey),
    0
  );

  const bonusByLevel = getLegacyBonusPreparedSpells(characterInfo);
  const bonusTotal = SPELL_LEVELS.reduce((sum, level) => {
    if (level === 0) return sum;
    return sum + (Array.isArray(bonusByLevel?.[level]) ? bonusByLevel[level].filter((spell) => !spell?.spelltrackerDoesNotCount).length : 0);
  }, 0);

  return classTotal + bonusTotal;
};

export const getPreparedSpellCountsByClass = (characterInfo = {}) =>
  getClassEntries(characterInfo).reduce((acc, entry) => {
    acc[entry.classKey] = {
      limit: calculatePreparedSpellLimitForClass(characterInfo, entry),
      actual: calculateActualPreparedSpellsForClass(characterInfo, entry.classKey),
    };
    return acc;
  }, {});

export const createEmptyPreparedCounts = () =>
  createEmptySpellLevels();
