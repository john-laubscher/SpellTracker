const FIGHTING_STYLE_CLASS_KEYS = ["fighter", "paladin", "ranger"];

const FIGHTING_STYLE_REQUIREMENT_BY_CLASS = {
  fighter: 1,
  paladin: 2,
  ranger: 2,
};

export const normalizeFightingStylesByClass = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value).reduce((acc, [classKey, style]) => {
    const normalizedClassKey = String(classKey || "").trim();
    const normalizedStyle = String(style || "").trim();
    if (!normalizedClassKey || !normalizedStyle) return acc;
    acc[normalizedClassKey] = normalizedStyle;
    return acc;
  }, {});
};

export const classSupportsFightingStyle = (classKey) =>
  FIGHTING_STYLE_CLASS_KEYS.includes(String(classKey || "").trim());

export const getFightingStyleRequirementLevel = (classKey) =>
  FIGHTING_STYLE_REQUIREMENT_BY_CLASS[String(classKey || "").trim()] || null;

export const canClassChooseFightingStyle = (classKey, level) => {
  const requirementLevel = getFightingStyleRequirementLevel(classKey);
  if (!requirementLevel) return false;
  return Math.max(0, Math.trunc(Number(level) || 0)) >= requirementLevel;
};

export const getDefaultFightingStyleForClass = (classKey, options = []) => {
  const normalizedClassKey = String(classKey || "").trim();
  const list = Array.isArray(options) ? options : [];
  if (list.length === 0) return "";

  if (normalizedClassKey === "paladin" && list.includes("Defense")) return "Defense";
  if (normalizedClassKey === "ranger" && list.includes("Archery")) return "Archery";
  return String(list[0] || "");
};

export const getFightingStyleForClass = (characterInfo, classKey) => {
  const normalizedClassKey = String(classKey || "").trim();
  if (!normalizedClassKey) return "";

  const fightingStylesByClass = normalizeFightingStylesByClass(characterInfo?.fightingStylesByClass);
  if (fightingStylesByClass[normalizedClassKey]) {
    return String(fightingStylesByClass[normalizedClassKey] || "");
  }

  if (normalizedClassKey === String(characterInfo?.characterClass || "").trim()) {
    return String(characterInfo?.fightingStyle || "");
  }

  return "";
};
