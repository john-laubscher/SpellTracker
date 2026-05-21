import ClassesData from "../components/ClassesData";
import spellTables from "../components/spellTables";

export const calculateTotalPreparedSpells = (characterInfo) => {
  const characterClass = characterInfo?.characterClass;
  const characterLevel = Number(characterInfo?.characterLevel) || 0;

  const spellcastingAbility = ClassesData?.[characterClass]?.spellcastingAbility;
  const stats = characterInfo?.stats || {};
  const statModRaw =
    spellcastingAbility && spellcastingAbility !== "nonCaster"
      ? stats?.[spellcastingAbility]?.mod
      : undefined;
  const statMod = Number.isFinite(Number(statModRaw)) ? Number(statModRaw) : undefined;
  // Back-compat fallback (older state stored this separately).
  const spellcastingMod = Number.isFinite(statMod)
    ? statMod
    : Number(characterInfo?.spellcastingMod) || 0;

  const classMeta = ClassesData?.[characterClass] || null;
  const subclassMeta = classMeta?.subclasses?.[characterInfo?.subclass] || null;
  const subclassSpellcasting = subclassMeta?.spellcasting || null;
  const hasSubclassSpellcasting =
    Boolean(subclassSpellcasting) && characterLevel >= Number(subclassSpellcasting?.startsAtLevel || 1);

  if (hasSubclassSpellcasting) {
    const tableKey = String(subclassSpellcasting?.spellTableKey || "");
    const spellsKnown = spellTables?.[tableKey]?.[characterLevel]?.spellsKnown;
    return Number(spellsKnown) || 0;
  }

  if (!spellcastingAbility || spellcastingAbility === "nonCaster") return 0;

  const isSpellCaster = ClassesData?.[characterClass]?.isSpellCaster;
  if (!isSpellCaster) return 0;

  if (isSpellCaster === "refer to spellTables") {
    const spellsKnown = spellTables?.[characterClass]?.[characterLevel]?.spellsKnown;
    return Number(spellsKnown) || 0;
  }

  if (isSpellCaster === "halfCaster") {
    // Paladins/Rangers don't get spellcasting until level 2.
    if (characterLevel < 2) return 0;
    return Math.max(1, Math.floor(0.5 * characterLevel + spellcastingMod));
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
