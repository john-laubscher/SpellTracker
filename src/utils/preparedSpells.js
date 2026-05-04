import ClassesData from "../components/ClassesData";
import spellTables from "../components/spellTables";

export const calculateTotalPreparedSpells = (characterInfo) => {
  const characterClass = characterInfo?.characterClass;
  const characterLevel = Number(characterInfo?.characterLevel) || 0;
  const spellcastingMod = Number(characterInfo?.spellcastingMod) || 0;

  const spellcastingAbility = ClassesData?.[characterClass]?.spellcastingAbility;
  if (!spellcastingAbility || spellcastingAbility === "nonCaster") return 0;

  const isSpellCaster = ClassesData?.[characterClass]?.isSpellCaster;
  if (!isSpellCaster) return 0;

  if (isSpellCaster === "refer to spellTables") {
    const spellsKnown = spellTables?.[characterClass]?.[characterLevel]?.spellsKnown;
    return Number(spellsKnown) || 0;
  }

  if (isSpellCaster === "halfCaster") {
    return Math.floor(0.5 * characterLevel + spellcastingMod);
  }

  if (characterClass === "wizard") {
    return characterLevel + spellcastingMod;
  }

  if (isSpellCaster === "fullCaster") {
    return characterLevel + spellcastingMod;
  }

  return 0;
};

export const calculateActualPreparedSpells = (characterInfo) => {
  const spellsPrepared = characterInfo?.spellsPrepared;
  if (!spellsPrepared || typeof spellsPrepared !== "object") return 0;

  return Object.entries(spellsPrepared).reduce((acc, [levelKey, value]) => {
    // Cantrips (level 0) do not count toward prepared spell totals.
    if (String(levelKey) === "0") return acc;
    if (!Array.isArray(value)) return acc;
    return acc + value.length;
  }, 0);
};
