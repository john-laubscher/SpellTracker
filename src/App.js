import "./App.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import CharacterCreationForm from "./components/characterCreationForm";
import CharacterSelectionScreen from "./components/CharacterSelectionScreen";
import MainUI from "./components/mainUI/index.js";
import ThemeConfig, { BackgroundWrapper, CharCreationBGPic } from "./components/ThemeConfig";
import {
  AuthContext,
  CharacterInfoContext,
  CharacterSessionContext,
  ClassSpellsDetailsContext,
  FeatureOverridesContext,
  FeatureTrackersContext,
  SoulknifeCustomUsesContext,
  UntrackedFeatureChoicesContext,
} from "./Contexts/Context";
import { normalizeCharacterProfile } from "./utils/characterProfile";
import { loadFeatureTrackersFromStorage, saveFeatureTrackersToStorage } from "./utils/featureTrackersStorage";
import { loadFeatureOverrides, saveFeatureOverrides } from "./utils/featureOverrides";
import { getActiveCharacterIdFromStorage, getScopedStorageKey, setActiveCharacterIdInStorage } from "./utils/scopedStorage";
import { loadUntrackedFeatureChoices, saveUntrackedFeatureChoices } from "./utils/untrackedFeatureChoices";

const CHARACTER_INFO_STORAGE_KEY = "spelltracker_characterInfo_v2";
const SOULKNIFE_CUSTOM_USES_STORAGE_KEY = "spelltracker_soulknife_psionicDieUses_custom_v1";

const createEmptyClassSpellDetails = () => ({
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
});

const normalizeSoulknifeCustomUses = (value) =>
  Array.isArray(value)
    ? value
        .map((entry) => ({
          id: String(entry?.id || "").trim(),
          title: String(entry?.title || "").trim(),
          description: String(entry?.description || ""),
        }))
        .filter((entry) => entry.id && entry.title)
    : [];

const loadJsonFromStorage = (baseKey, characterId = "") => {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(baseKey, characterId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveJsonToStorage = (baseKey, value, characterId = "") => {
  try {
    localStorage.setItem(getScopedStorageKey(baseKey, characterId), JSON.stringify(value));
  } catch {
    // ignore write errors
  }
};

const loadSoulknifeCustomUsesFromStorage = (characterId = "") =>
  normalizeSoulknifeCustomUses(loadJsonFromStorage(SOULKNIFE_CUSTOM_USES_STORAGE_KEY, characterId));

const saveSoulknifeCustomUsesToStorage = (uses, characterId = "") => {
  saveJsonToStorage(SOULKNIFE_CUSTOM_USES_STORAGE_KEY, normalizeSoulknifeCustomUses(uses), characterId);
};

const loadProfileFromLocalStorage = (characterId = "") =>
  normalizeCharacterProfile({
    characterInfo: loadJsonFromStorage(CHARACTER_INFO_STORAGE_KEY, characterId),
    featureTrackers: loadFeatureTrackersFromStorage(characterId),
    featureOverrides: loadFeatureOverrides(characterId),
    untrackedFeatureChoices: loadUntrackedFeatureChoices(characterId),
    soulknifeCustomUses: loadSoulknifeCustomUsesFromStorage(characterId),
  });

const saveProfileToLocalStorage = (characterId, profile) => {
  saveJsonToStorage(CHARACTER_INFO_STORAGE_KEY, profile.characterInfo, characterId);
  saveFeatureTrackersToStorage(profile.featureTrackers, characterId);
  saveFeatureOverrides(profile.featureOverrides, characterId);
  saveUntrackedFeatureChoices(profile.untrackedFeatureChoices, characterId);
  saveSoulknifeCustomUsesToStorage(profile.soulknifeCustomUses, characterId);
};

const sortCharacters = (characters) =>
  [...(characters || [])].sort(
    (a, b) =>
      Number(b?.lastUsedAt || b?.updatedAt || b?.createdAt || 0) -
      Number(a?.lastUsedAt || a?.updatedAt || a?.createdAt || 0)
  );

function App() {
  const storedCharacterId = getActiveCharacterIdFromStorage();
  const initialProfile = loadProfileFromLocalStorage(storedCharacterId);

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("spelltracker_token");
    const userRaw = localStorage.getItem("spelltracker_user");
    let user = null;
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
      user = null;
    }
    return { token: token || null, user };
  });
  const [characters, setCharacters] = useState([]);
  const [activeCharacterId, setActiveCharacterId] = useState(storedCharacterId);
  const [isCharactersLoading, setIsCharactersLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [characterError, setCharacterError] = useState("");

  const [characterInfo, setCharacterInfo] = useState(initialProfile.characterInfo);
  const [featureTrackers, setFeatureTrackers] = useState(initialProfile.featureTrackers);
  const [featureOverrides, setFeatureOverrides] = useState(initialProfile.featureOverrides);
  const [untrackedFeatureChoices, setUntrackedFeatureChoices] = useState(initialProfile.untrackedFeatureChoices);
  const [soulknifeCustomUses, setSoulknifeCustomUses] = useState(initialProfile.soulknifeCustomUses);
  const [classSpellsDetails, setClassSpellsDetails] = useState(createEmptyClassSpellDetails);

  const skipNextProfileSaveRef = useRef(true);
  const profileSaveTimeoutRef = useRef(null);

  const applyNormalizedProfile = useCallback((profile) => {
    const normalized = normalizeCharacterProfile(profile);
    setCharacterInfo(normalized.characterInfo);
    setFeatureTrackers(normalized.featureTrackers);
    setFeatureOverrides(normalized.featureOverrides);
    setUntrackedFeatureChoices(normalized.untrackedFeatureChoices);
    setSoulknifeCustomUses(normalized.soulknifeCustomUses);
    skipNextProfileSaveRef.current = true;
  }, []);

  const currentProfile = useMemo(
    () => ({
      characterInfo,
      featureTrackers,
      featureOverrides,
      untrackedFeatureChoices,
      soulknifeCustomUses,
    }),
    [characterInfo, featureOverrides, featureTrackers, soulknifeCustomUses, untrackedFeatureChoices]
  );

  const activeCharacter = useMemo(
    () => characters.find((character) => character.id === activeCharacterId) || null,
    [activeCharacterId, characters]
  );

  const loadGuestProfile = useCallback(() => {
    applyNormalizedProfile(loadProfileFromLocalStorage(""));
    setActiveCharacterId("");
    setActiveCharacterIdInStorage("");
  }, [applyNormalizedProfile]);

  const switchCharacter = useCallback(
    async (characterId) => {
      if (!auth?.token || !characterId) return null;
      setIsProfileLoading(true);
      setCharacterError("");
      try {
        const res = await axios.get(`/characters/${characterId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const character = res.data?.character || null;
        if (!character?.id) throw new Error("Missing character");

        setActiveCharacterId(character.id);
        setActiveCharacterIdInStorage(character.id);
        applyNormalizedProfile(character.profile || {});
        saveProfileToLocalStorage(character.id, normalizeCharacterProfile(character.profile || {}));
        setCharacters((prev) => {
          const next = [...(prev || []).filter((entry) => entry.id !== character.id), character];
          return sortCharacters(next);
        });
        return character;
      } finally {
        setIsProfileLoading(false);
      }
    },
    [applyNormalizedProfile, auth?.token]
  );

  const hydrateCharactersWithProfiles = useCallback(
    async (characterList) => {
      if (!auth?.token) return sortCharacters(characterList);

      const results = await Promise.all(
        (characterList || []).map(async (character) => {
          if (character?.profile?.characterInfo) return character;
          try {
            const res = await axios.get(`/characters/${character.id}`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            });
            return res.data?.character || character;
          } catch {
            return character;
          }
        })
      );

      return sortCharacters(results);
    },
    [auth?.token]
  );

  const createCharacter = useCallback(
    async (name) => {
      if (!auth?.token) throw new Error("Not authenticated");
      const normalizedName = String(name || "").trim();
      const profile = normalizeCharacterProfile({
        characterInfo: { characterName: normalizedName || "New Character" },
        featureTrackers: {},
        featureOverrides: {},
        untrackedFeatureChoices: {},
        soulknifeCustomUses: [],
      });

      const res = await axios.post(
        "/characters",
        { name: normalizedName, profile },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      const created = res.data?.character || null;
      if (created?.id) {
        setCharacters((prev) => sortCharacters([...(prev || []), created]));
        saveProfileToLocalStorage(created.id, profile);
      }
      return created;
    },
    [auth?.token]
  );

  useEffect(() => {
    if (!auth.token || auth.user) return;
    axios
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => {
        const user = res.data?.user || null;
        setAuth((prev) => ({ ...prev, user }));
        localStorage.setItem("spelltracker_user", JSON.stringify(user));
      })
      .catch(() => {
        setAuth({ token: null, user: null });
        localStorage.removeItem("spelltracker_token");
        localStorage.removeItem("spelltracker_user");
        loadGuestProfile();
      });
  }, [auth.token, auth.user, loadGuestProfile]);

  useEffect(() => {
    if (!auth.token) {
      setCharacters([]);
      setCharacterError("");
      setIsCharactersLoading(false);
      loadGuestProfile();
      return;
    }

    let cancelled = false;
    setIsCharactersLoading(true);
    setCharacterError("");

    axios
      .get("/characters", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(async (res) => {
        if (cancelled) return;
        const nextCharacters = await hydrateCharactersWithProfiles(res.data?.results || []);
        if (cancelled) return;
        setCharacters(nextCharacters);

        const storedId = getActiveCharacterIdFromStorage();
        const preferredId =
          nextCharacters.some((character) => character.id === activeCharacterId)
            ? activeCharacterId
            : nextCharacters.some((character) => character.id === storedId)
              ? storedId
              : nextCharacters[0]?.id || "";

        if (preferredId) {
          await switchCharacter(preferredId);
        } else {
          setActiveCharacterId("");
          setActiveCharacterIdInStorage("");
          applyNormalizedProfile(
            normalizeCharacterProfile({
              characterInfo: { characterName: "New Character" },
              featureTrackers: {},
              featureOverrides: {},
              untrackedFeatureChoices: {},
              soulknifeCustomUses: [],
            })
          );
        }
      })
      .catch(() => {
        if (cancelled) return;
        setCharacters([]);
        setCharacterError("Unable to load saved characters right now.");
      })
      .finally(() => {
        if (!cancelled) setIsCharactersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCharacterId, applyNormalizedProfile, auth.token, hydrateCharactersWithProfiles, loadGuestProfile, switchCharacter]);

  useEffect(() => {
    saveProfileToLocalStorage(activeCharacterId, currentProfile);
  }, [activeCharacterId, currentProfile]);

  useEffect(() => {
    if (!auth.token || !activeCharacterId || isProfileLoading) return undefined;

    if (skipNextProfileSaveRef.current) {
      skipNextProfileSaveRef.current = false;
      return undefined;
    }

    if (profileSaveTimeoutRef.current) clearTimeout(profileSaveTimeoutRef.current);
    profileSaveTimeoutRef.current = window.setTimeout(() => {
      axios
        .put(
          `/characters/${activeCharacterId}`,
          {
            name: String(characterInfo?.characterName || activeCharacter?.name || "New Character").trim() || "New Character",
            profile: currentProfile,
          },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        )
        .then((res) => {
          const updated = res.data?.character || null;
          if (!updated?.id) return;
          setCharacters((prev) => {
            const next = [...(prev || []).filter((entry) => entry.id !== updated.id), updated];
            return sortCharacters(next);
          });
        })
        .catch(() => {
          // Keep local state intact even if sync fails; next edit will retry.
        });
    }, 500);

    return () => {
      if (profileSaveTimeoutRef.current) clearTimeout(profileSaveTimeoutRef.current);
    };
  }, [activeCharacter, activeCharacterId, auth.token, characterInfo, currentProfile, isProfileLoading]);

  useEffect(() => {
    try {
      localStorage.removeItem("spelltracker_celestialLightOptOut");
      localStorage.removeItem("spelltracker_celestialSacredFlameOptOut");
    } catch {
      // ignore write errors
    }
  }, []);

  const canManageCharacters = Boolean(auth.token);
  const canCreateCharacter = Boolean(auth.token) && characters.length < 5;

  const characterSessionValue = useMemo(
    () => ({
      characters,
      activeCharacterId,
      activeCharacter,
      isCharactersLoading,
      isProfileLoading,
      characterError,
      switchCharacter,
      createCharacter,
      canManageCharacters,
      canCreateCharacter,
      maxCharacters: 5,
    }),
    [
      activeCharacter,
      activeCharacterId,
      canCreateCharacter,
      canManageCharacters,
      characterError,
      characters,
      createCharacter,
      isCharactersLoading,
      isProfileLoading,
      switchCharacter,
    ]
  );

  return (
    <div className="App">
      <ThemeConfig>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <CharacterSessionContext.Provider value={characterSessionValue}>
            <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
              <FeatureTrackersContext.Provider value={{ featureTrackers, setFeatureTrackers }}>
                <FeatureOverridesContext.Provider value={{ featureOverrides, setFeatureOverrides }}>
                  <UntrackedFeatureChoicesContext.Provider
                    value={{ untrackedFeatureChoices, setUntrackedFeatureChoices }}
                  >
                    <SoulknifeCustomUsesContext.Provider
                      value={{
                        soulknifeCustomUses,
                        setSoulknifeCustomUses,
                      }}
                    >
                      <ClassSpellsDetailsContext.Provider value={{ classSpellsDetails, setClassSpellsDetails }}>
                        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                          <Box sx={{ flex: "1 0 auto" }}>
                            <Routes>
                              <Route
                                path="/"
                                element={
                                  auth.token ? (
                                    <Navigate to={activeCharacterId ? "/mainUI" : "/characters"} replace />
                                  ) : (
                                    <BackgroundWrapper bgImage={CharCreationBGPic}>
                                      <CharacterCreationForm key="guest-character" />
                                    </BackgroundWrapper>
                                  )
                                }
                              />
                              <Route
                                path="/characters"
                                element={
                                  auth.token ? (
                                    <BackgroundWrapper bgImage={CharCreationBGPic}>
                                      <CharacterSelectionScreen />
                                    </BackgroundWrapper>
                                  ) : (
                                    <Navigate to="/" replace />
                                  )
                                }
                              />
                              <Route
                                path="/character"
                                element={
                                  auth.token && !activeCharacterId ? (
                                    <Navigate to="/characters" replace />
                                  ) : (
                                    <BackgroundWrapper bgImage={CharCreationBGPic}>
                                      <CharacterCreationForm key={activeCharacterId || "guest-edit"} />
                                    </BackgroundWrapper>
                                  )
                                }
                              />
                              <Route
                                path="/mainUI"
                                element={
                                  auth.token && !activeCharacterId ? (
                                    <Navigate to="/characters" replace />
                                  ) : (
                                    <MainUI key={activeCharacterId || "guest-main"} />
                                  )
                                }
                              />
                            </Routes>
                          </Box>

                          <Box
                            component="footer"
                            sx={{
                              flexShrink: 0,
                              px: 2,
                              py: 1,
                              textAlign: "center",
                              fontFamily: "'Cinzel', serif",
                              fontSize: "11px",
                              color: "#f5e6cf",
                              backgroundColor: "rgba(35, 20, 8, 0.88)",
                            }}
                          >
                            Genie Lamp icon by{" "}
                            <a
                              href="https://icons8.com"
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#f0c36b", fontWeight: 700 }}
                            >
                              Icons8
                            </a>
                          </Box>
                        </Box>
                      </ClassSpellsDetailsContext.Provider>
                    </SoulknifeCustomUsesContext.Provider>
                  </UntrackedFeatureChoicesContext.Provider>
                </FeatureOverridesContext.Provider>
              </FeatureTrackersContext.Provider>
            </CharacterInfoContext.Provider>
          </CharacterSessionContext.Provider>
        </AuthContext.Provider>
      </ThemeConfig>
    </div>
  );
}

export default App;
