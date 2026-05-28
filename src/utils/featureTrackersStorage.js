const STORAGE_KEY = "spelltracker_featureTrackers_v1";

export const loadFeatureTrackersFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

export const saveFeatureTrackersToStorage = (trackers) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackers || {}));
  } catch {
    // ignore write errors
  }
};

export const FEATURE_TRACKERS_STORAGE_KEY = STORAGE_KEY;

