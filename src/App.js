import "./App.css";
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route } from "react-router-dom";
import MainUI from "./components/mainUI/index.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext, CharacterInfoContext, ClassSpellsDetailsContext } from "./Contexts/Context";
import ThemeConfig, { BackgroundWrapper, CharCreationBGPic } from "./components/ThemeConfig";

const loadPreparedSpellsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_spellsPrepared");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadMagicalSecretsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_magicalSecretsPrepared");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadSpiritSessionFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_spiritSessionPrepared");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadArcanaInitiateFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_arcanaInitiateCantrips");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadArcaneMasteryFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_arcaneMasterySpells");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadReaperCantripFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_reaperCantrip");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.index || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadAcolyteOfNatureCantripFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_acolyteOfNatureCantrip");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.index || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadDomainSpellSwapsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_domainSpellSwaps");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
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

  const [characterInfo, setCharacterInfo] = useState(() => {
    const persistedPrepared = loadPreparedSpellsFromStorage();
    const persistedMagicalSecrets = loadMagicalSecretsFromStorage();
    const persistedSpiritSession = loadSpiritSessionFromStorage();
    const persistedArcanaInitiate = loadArcanaInitiateFromStorage();
    const persistedArcaneMastery = loadArcaneMasteryFromStorage();
    const persistedReaperCantrip = loadReaperCantripFromStorage();
    const persistedAcolyteOfNatureCantrip = loadAcolyteOfNatureCantripFromStorage();
    const persistedDomainSpellSwaps = loadDomainSpellSwapsFromStorage();
    return {
      characterName: "Garetjax",
      race: "Dwarf",
      subrace: "Hill",
      draconicAncestry: "",
      druidLandType: "",
      fightingStyle: "Defense",
      // default characterClass should be "noClass" rather than empty string
      characterClass: "fighter",
      subclass: "champion",
      characterLevel: 17,
      proficiencyMod: 6,
      hp: 0,
      ac: 10,
      weapons: [
        {
          name: "Longsword",
          dmgType: "slashing",
          mod: 1,
          statMod: "str",
          proficient: true,
        },
      ],
      spellcastingMod: 2,
      wizardSpellCountMod: 2,
      stats: {
        str: { value: 8, mod: -1 },
        dex: { value: 10, mod: 0 },
        con: { value: 11, mod: 0 },
        int: { value: 13, mod: 1 },
        wis: { value: 15, mod: 2 },
        cha: { value: 17, mod: 3 },
      },
      spellsPrepared: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        ...(persistedPrepared || {}),
      },
      magicalSecretsPrepared: Array.isArray(persistedMagicalSecrets) ? persistedMagicalSecrets : [],
      spiritSessionPrepared: Array.isArray(persistedSpiritSession) ? persistedSpiritSession : [],
      arcanaInitiateCantrips: Array.isArray(persistedArcanaInitiate) ? persistedArcanaInitiate : [],
      arcaneMasterySpells: Array.isArray(persistedArcaneMastery) ? persistedArcaneMastery : [],
      reaperCantrip: persistedReaperCantrip || null,
      acolyteOfNatureCantrip: persistedAcolyteOfNatureCantrip || null,
      domainSpellSwaps: persistedDomainSpellSwaps || {},
    };
  });

  const [classSpellsDetails, setClassSpellsDetails] = useState({
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
  })

  useEffect(() => {
    if (!auth.token || auth.user) return;
    axios
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => {
        const user = res.data?.user || null;
        setAuth((a) => ({ ...a, user }));
        localStorage.setItem("spelltracker_user", JSON.stringify(user));
      })
      .catch(() => {
        setAuth({ token: null, user: null });
        localStorage.removeItem("spelltracker_token");
        localStorage.removeItem("spelltracker_user");
      });
  }, [auth.token, auth.user]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_spellsPrepared",
        JSON.stringify(characterInfo.spellsPrepared || {})
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.spellsPrepared]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_magicalSecretsPrepared",
        JSON.stringify(characterInfo.magicalSecretsPrepared || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.magicalSecretsPrepared]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_spiritSessionPrepared",
        JSON.stringify(characterInfo.spiritSessionPrepared || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.spiritSessionPrepared]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_arcanaInitiateCantrips",
        JSON.stringify(characterInfo.arcanaInitiateCantrips || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.arcanaInitiateCantrips]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_arcaneMasterySpells",
        JSON.stringify(characterInfo.arcaneMasterySpells || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.arcaneMasterySpells]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_reaperCantrip",
        JSON.stringify(characterInfo.reaperCantrip || null)
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.reaperCantrip]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_acolyteOfNatureCantrip",
        JSON.stringify(characterInfo.acolyteOfNatureCantrip || null)
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.acolyteOfNatureCantrip]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_domainSpellSwaps",
        JSON.stringify(characterInfo.domainSpellSwaps || {})
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.domainSpellSwaps]);

  return (
    <div className="App">
       <ThemeConfig>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
            <ClassSpellsDetailsContext.Provider value={{ classSpellsDetails, setClassSpellsDetails }}>
              <Routes>
                <Route path="/" element={
                  <BackgroundWrapper bgImage={CharCreationBGPic}>
                      <CharacterCreationForm />
                  </BackgroundWrapper>
                }></Route>

                <Route path="/mainUI" element={<MainUI />}></Route>
              </Routes>
            </ClassSpellsDetailsContext.Provider>
          </CharacterInfoContext.Provider>
        </AuthContext.Provider>
       </ThemeConfig>
    </div>
  );
}

export default App;
