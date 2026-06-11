import { getActiveCharacterIdFromStorage, getScopedStorageKey } from "./scopedStorage";

const STORAGE_KEY = "spelltracker_untrackedFeatureChoices_v1";

const safeJsonParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const loadUntrackedFeatureChoices = (characterId = "") => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(
    getScopedStorageKey(STORAGE_KEY, characterId || getActiveCharacterIdFromStorage())
  );
  const parsed = raw ? safeJsonParse(raw) : null;
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
};

export const saveUntrackedFeatureChoices = (choices, characterId = "") => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getScopedStorageKey(STORAGE_KEY, characterId || getActiveCharacterIdFromStorage()),
      JSON.stringify(choices || {})
    );
  } catch {
    // ignore storage errors
  }
};

export const getChoiceKey = ({ kind, characterClass, subclass }) => {
  const safeKind = kind || "subclass";
  const safeClass = characterClass || "noClass";
  const safeSubclass = subclass || "none";
  return `${safeKind}|${safeClass}|${safeSubclass}`;
};

export const getFeatureChoice = (choices, choiceKey, featureId) => {
  const bucket = choices?.[choiceKey];
  if (!bucket || typeof bucket !== "object") return "";
  const raw = bucket?.[featureId];
  return typeof raw === "string" ? raw : "";
};

export const setFeatureChoice = (choices, choiceKey, featureId, optionId) => {
  const next = { ...(choices || {}) };
  const bucket = { ...(next[choiceKey] || {}) };
  const normalized = String(optionId || "").trim();

  if (normalized) bucket[featureId] = normalized;
  else delete bucket[featureId];

  next[choiceKey] = bucket;
  return next;
};
