export const ACTIVE_CHARACTER_STORAGE_KEY = "spelltracker_active_character_id";

export const getActiveCharacterIdFromStorage = () => {
  if (typeof window === "undefined") return "";
  return String(window.localStorage.getItem(ACTIVE_CHARACTER_STORAGE_KEY) || "").trim();
};

export const setActiveCharacterIdInStorage = (characterId) => {
  if (typeof window === "undefined") return;
  const normalized = String(characterId || "").trim();
  if (!normalized) {
    window.localStorage.removeItem(ACTIVE_CHARACTER_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(ACTIVE_CHARACTER_STORAGE_KEY, normalized);
};

export const getScopedStorageKey = (baseKey, characterId) => {
  const normalizedId = String(characterId || "").trim();
  if (!normalizedId) return baseKey;
  return `${baseKey}__${normalizedId}`;
};
