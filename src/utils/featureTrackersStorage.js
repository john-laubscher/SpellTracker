import { getScopedStorageKey } from "./scopedStorage";

const STORAGE_KEY = "spelltracker_featureTrackers_v1";

export const loadFeatureTrackersFromStorage = (characterId = "") => {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(STORAGE_KEY, characterId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

export const saveFeatureTrackersToStorage = (trackers, characterId = "") => {
  try {
    localStorage.setItem(getScopedStorageKey(STORAGE_KEY, characterId), JSON.stringify(trackers || {}));
  } catch {
    // ignore write errors
  }
};

export const FEATURE_TRACKERS_STORAGE_KEY = STORAGE_KEY;
