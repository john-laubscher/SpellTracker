import { getActiveCharacterIdFromStorage, getScopedStorageKey } from "./scopedStorage";

const STORAGE_KEY = "spelltracker_featureOverrides_v1";

const safeJsonParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const loadFeatureOverrides = (characterId = "") => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(
    getScopedStorageKey(STORAGE_KEY, characterId || getActiveCharacterIdFromStorage())
  );
  const parsed = raw ? safeJsonParse(raw) : null;
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
};

export const saveFeatureOverrides = (overrides, characterId = "") => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getScopedStorageKey(STORAGE_KEY, characterId || getActiveCharacterIdFromStorage()),
      JSON.stringify(overrides || {})
    );
  } catch {
    // ignore storage errors
  }
};

export const getOverrideKey = ({ kind, characterClass, subclass }) => {
  const safeKind = kind || "class";
  const safeClass = characterClass || "noClass";
  const safeSubclass = subclass || "none";
  return `${safeKind}|${safeClass}|${safeSubclass}`;
};

export const getFeatureTrackedOverride = (overrides, overrideKey, featureId) => {
  const bucket = overrides?.[overrideKey];
  if (!bucket || typeof bucket !== "object") return undefined;
  const entry = bucket?.[featureId];
  if (!entry || typeof entry !== "object") return undefined;
  if (typeof entry.tracked !== "boolean") return undefined;
  return entry.tracked;
};

export const setFeatureTrackedOverride = (overrides, overrideKey, featureId, tracked) => {
  const next = { ...(overrides || {}) };
  const bucket = { ...(next[overrideKey] || {}) };
  bucket[featureId] = { ...(bucket[featureId] || {}), tracked: Boolean(tracked) };
  next[overrideKey] = bucket;
  return next;
};

export const getFeatureHiddenOverride = (overrides, overrideKey, featureId) => {
  const bucket = overrides?.[overrideKey];
  if (!bucket || typeof bucket !== "object") return undefined;
  const entry = bucket?.[featureId];
  if (!entry || typeof entry !== "object") return undefined;
  if (typeof entry.hidden !== "boolean") return undefined;
  return entry.hidden;
};

export const setFeatureHiddenOverride = (overrides, overrideKey, featureId, hidden) => {
  const next = { ...(overrides || {}) };
  const bucket = { ...(next[overrideKey] || {}) };
  bucket[featureId] = { ...(bucket[featureId] || {}), hidden: Boolean(hidden) };
  next[overrideKey] = bucket;
  return next;
};
