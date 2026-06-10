import "./App.css";
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route } from "react-router-dom";
import MainUI from "./components/mainUI/index.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext, CharacterInfoContext, ClassSpellsDetailsContext, FeatureTrackersContext } from "./Contexts/Context";
import ThemeConfig, { BackgroundWrapper, CharCreationBGPic } from "./components/ThemeConfig";
import { loadFeatureTrackersFromStorage, saveFeatureTrackersToStorage } from "./utils/featureTrackersStorage";
import { Box } from "@mui/material";

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

const loadWizardSpellbookFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_wizardSpellbook");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadWizardSpellMasteryFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_wizardSpellMastery");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadWizardSignatureSpellsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_wizardSignatureSpells");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadWizardScribesMasterScrivinerFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_wizardScribesMasterScriviner");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadWizardScribesLostSpellsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_wizardScribesLostSpells");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadWizardScribesLostSpellRestCountFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_wizardScribesLostSpellRestCount");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const asNum = Number(parsed);
    if (!Number.isFinite(asNum)) return null;
    return Math.max(0, Math.min(6, Math.trunc(asNum)));
  } catch {
    return null;
  }
};

const loadBlessedWarriorCantripsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_blessedWarriorCantrips");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadDruidicWarriorCantripsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_druidicWarriorCantrips");
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

const loadArcaneArcherLoreCantripFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_arcaneArcherLoreCantrip");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.index || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadArcaneShotOptionsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_arcaneShotOptions");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x) => typeof x === "string" && x.trim().length > 0);
  } catch {
    return null;
  }
};

const loadArcaneShotBonusOptionsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_arcaneShotBonusOptions");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const asNum = Number(parsed);
    if (!Number.isFinite(asNum)) return null;
    return Math.max(0, Math.trunc(asNum));
  } catch {
    return null;
  }
};

const loadMetamagicOptionsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_metamagicOptions");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x) => typeof x === "string" && x.trim().length > 0);
  } catch {
    return null;
  }
};

const loadBattleMasterManeuversFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_battleMasterManeuvers");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x) => typeof x === "string" && x.trim().length > 0);
  } catch {
    return null;
  }
};

const loadAdditionalFightingStyleFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_additionalFightingStyle");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "string") return null;
    const trimmed = parsed.trim();
    if (!trimmed) return null;
    return trimmed;
  } catch {
    return null;
  }
};

const loadShowManeuversInSpellTrackerFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_showManeuversInSpellTracker");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "boolean") return null;
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

const loadWarlockInvocationsFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_warlockInvocations");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x) => typeof x === "string" && x.trim().length > 0);
  } catch {
    return null;
  }
};

const loadWarlockPactBoonFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_warlockPactBoon");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "string") return null;
    const trimmed = parsed.trim();
    return trimmed || null;
  } catch {
    return null;
  }
};

const loadWarlockMysticArcanumFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_warlockMysticArcanum");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((entry) => entry && typeof entry === "object" && entry.index && entry.name);
  } catch {
    return null;
  }
};

const loadFourElementsDisciplinesFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_fourElementsDisciplines");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x) => typeof x === "string" && x.trim().length > 0);
  } catch {
    return null;
  }
};

const loadArcaneTricksterMageHandOptOutFromStorage = () => {
  try {
    const raw = localStorage.getItem("spelltracker_arcaneTricksterMageHandOptOut");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "boolean") return null;
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

  const [featureTrackers, setFeatureTrackers] = useState(() => loadFeatureTrackersFromStorage());

  const [characterInfo, setCharacterInfo] = useState(() => {
    const persistedPrepared = loadPreparedSpellsFromStorage();
    const persistedWizardSpellbook = loadWizardSpellbookFromStorage();
    const persistedWizardSpellMastery = loadWizardSpellMasteryFromStorage();
    const persistedWizardSignatureSpells = loadWizardSignatureSpellsFromStorage();
    const persistedWizardScribesMasterScriviner = loadWizardScribesMasterScrivinerFromStorage();
    const persistedWizardScribesLostSpells = loadWizardScribesLostSpellsFromStorage();
    const persistedWizardScribesLostSpellRestCount = loadWizardScribesLostSpellRestCountFromStorage();
    const persistedMagicalSecrets = loadMagicalSecretsFromStorage();
    const persistedSpiritSession = loadSpiritSessionFromStorage();
    const persistedArcanaInitiate = loadArcanaInitiateFromStorage();
    const persistedBlessedWarriorCantrips = loadBlessedWarriorCantripsFromStorage();
    const persistedDruidicWarriorCantrips = loadDruidicWarriorCantripsFromStorage();
    const persistedArcaneMastery = loadArcaneMasteryFromStorage();
    const persistedReaperCantrip = loadReaperCantripFromStorage();
    const persistedAcolyteOfNatureCantrip = loadAcolyteOfNatureCantripFromStorage();
    const persistedArcaneArcherLoreCantrip = loadArcaneArcherLoreCantripFromStorage();
    const persistedArcaneShotOptions = loadArcaneShotOptionsFromStorage();
    const persistedArcaneShotBonusOptions = loadArcaneShotBonusOptionsFromStorage();
    const persistedBattleMasterManeuvers = loadBattleMasterManeuversFromStorage();
    const persistedWarlockInvocations = loadWarlockInvocationsFromStorage();
    const persistedWarlockPactBoon = loadWarlockPactBoonFromStorage();
    const persistedWarlockMysticArcanum = loadWarlockMysticArcanumFromStorage();
    const persistedMetamagicOptions = loadMetamagicOptionsFromStorage();
    const persistedAdditionalFightingStyle = loadAdditionalFightingStyleFromStorage();
    const persistedShowManeuversInSpellTracker = loadShowManeuversInSpellTrackerFromStorage();
    const persistedDomainSpellSwaps = loadDomainSpellSwapsFromStorage();
    const persistedFourElementsDisciplines = loadFourElementsDisciplinesFromStorage();
    const persistedArcaneTricksterMageHandOptOut = loadArcaneTricksterMageHandOptOutFromStorage();
    const emptySpellLevels = {
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
    };
    const wizardSpellbookFallback = persistedWizardSpellbook || persistedPrepared || {};
    return {
      characterName: "Garetjax",
      race: "Dwarf",
      subrace: "Hill",
      draconicAncestry: "",
      genieKind: "",
      druidLandType: "",
      fightingStyle: "Defense",
      additionalFightingStyle:
        typeof persistedAdditionalFightingStyle === "string" &&
        persistedAdditionalFightingStyle &&
        persistedAdditionalFightingStyle !== "Defense"
          ? persistedAdditionalFightingStyle
          : "",
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
          diceCount: 1,
          diceSize: 8,
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
      spellsPrepared: { ...emptySpellLevels, ...(persistedPrepared || {}) },
      wizardSpellbook: { ...emptySpellLevels, ...wizardSpellbookFallback },
      wizardSpellMastery: {
        1: persistedWizardSpellMastery?.[1] || persistedWizardSpellMastery?.first || null,
        2: persistedWizardSpellMastery?.[2] || persistedWizardSpellMastery?.second || null,
      },
      wizardSignatureSpells: Array.isArray(persistedWizardSignatureSpells) ? persistedWizardSignatureSpells : [],
      wizardScribesMasterScriviner: Array.isArray(persistedWizardScribesMasterScriviner)
        ? persistedWizardScribesMasterScriviner
        : [],
      wizardScribesLostSpells: Array.isArray(persistedWizardScribesLostSpells) ? persistedWizardScribesLostSpells : [],
      wizardScribesLostSpellRestCount: Number.isFinite(persistedWizardScribesLostSpellRestCount)
        ? persistedWizardScribesLostSpellRestCount
        : 0,
      magicalSecretsPrepared: Array.isArray(persistedMagicalSecrets) ? persistedMagicalSecrets : [],
      spiritSessionPrepared: Array.isArray(persistedSpiritSession) ? persistedSpiritSession : [],
      arcanaInitiateCantrips: Array.isArray(persistedArcanaInitiate) ? persistedArcanaInitiate : [],
      blessedWarriorCantrips: Array.isArray(persistedBlessedWarriorCantrips) ? persistedBlessedWarriorCantrips : [],
      druidicWarriorCantrips: Array.isArray(persistedDruidicWarriorCantrips) ? persistedDruidicWarriorCantrips : [],
      arcaneMasterySpells: Array.isArray(persistedArcaneMastery) ? persistedArcaneMastery : [],
      reaperCantrip: persistedReaperCantrip || null,
      acolyteOfNatureCantrip: persistedAcolyteOfNatureCantrip || null,
      arcaneArcherLoreCantrip: persistedArcaneArcherLoreCantrip || null,
      arcaneShotOptions: Array.isArray(persistedArcaneShotOptions) ? persistedArcaneShotOptions : [],
      arcaneShotBonusOptions: Number.isFinite(persistedArcaneShotBonusOptions) ? persistedArcaneShotBonusOptions : 0,
      battleMasterManeuvers: Array.isArray(persistedBattleMasterManeuvers) ? persistedBattleMasterManeuvers : [],
      warlockInvocations: Array.isArray(persistedWarlockInvocations) ? persistedWarlockInvocations : [],
      warlockPactBoon: typeof persistedWarlockPactBoon === "string" ? persistedWarlockPactBoon : "",
      warlockMysticArcanum: Array.isArray(persistedWarlockMysticArcanum) ? persistedWarlockMysticArcanum : [],
      metamagicOptions: Array.isArray(persistedMetamagicOptions) ? persistedMetamagicOptions : [],
      showManeuversInSpellTracker: typeof persistedShowManeuversInSpellTracker === "boolean" ? persistedShowManeuversInSpellTracker : false,
      domainSpellSwaps: persistedDomainSpellSwaps || {},
      fourElementsDisciplines: Array.isArray(persistedFourElementsDisciplines) ? persistedFourElementsDisciplines : [],
      arcaneTricksterMageHandOptOut: typeof persistedArcaneTricksterMageHandOptOut === "boolean" ? persistedArcaneTricksterMageHandOptOut : false,
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
    saveFeatureTrackersToStorage(featureTrackers);
  }, [featureTrackers]);

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
        "spelltracker_wizardSpellbook",
        JSON.stringify(characterInfo.wizardSpellbook || {})
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.wizardSpellbook]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_wizardSpellMastery",
        JSON.stringify(characterInfo.wizardSpellMastery || {})
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.wizardSpellMastery]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_wizardSignatureSpells",
        JSON.stringify(characterInfo.wizardSignatureSpells || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.wizardSignatureSpells]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_wizardScribesMasterScriviner",
        JSON.stringify(characterInfo.wizardScribesMasterScriviner || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.wizardScribesMasterScriviner]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_wizardScribesLostSpells",
        JSON.stringify(characterInfo.wizardScribesLostSpells || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.wizardScribesLostSpells]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_wizardScribesLostSpellRestCount",
        JSON.stringify(Number(characterInfo.wizardScribesLostSpellRestCount) || 0)
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.wizardScribesLostSpellRestCount]);

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
        "spelltracker_blessedWarriorCantrips",
        JSON.stringify(characterInfo.blessedWarriorCantrips || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.blessedWarriorCantrips]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_druidicWarriorCantrips",
        JSON.stringify(characterInfo.druidicWarriorCantrips || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.druidicWarriorCantrips]);

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
        "spelltracker_arcaneArcherLoreCantrip",
        JSON.stringify(characterInfo.arcaneArcherLoreCantrip || null)
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.arcaneArcherLoreCantrip]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_arcaneShotOptions",
        JSON.stringify(characterInfo.arcaneShotOptions || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.arcaneShotOptions]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_arcaneShotBonusOptions",
        JSON.stringify(Number(characterInfo.arcaneShotBonusOptions) || 0)
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.arcaneShotBonusOptions]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_battleMasterManeuvers",
        JSON.stringify(characterInfo.battleMasterManeuvers || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.battleMasterManeuvers]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_warlockInvocations",
        JSON.stringify(characterInfo.warlockInvocations || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.warlockInvocations]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_warlockPactBoon",
        JSON.stringify(String(characterInfo.warlockPactBoon || ""))
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.warlockPactBoon]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_warlockMysticArcanum",
        JSON.stringify(characterInfo.warlockMysticArcanum || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.warlockMysticArcanum]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_metamagicOptions",
        JSON.stringify(characterInfo.metamagicOptions || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.metamagicOptions]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_additionalFightingStyle",
        JSON.stringify(String(characterInfo.additionalFightingStyle || ""))
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.additionalFightingStyle]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_showManeuversInSpellTracker",
        JSON.stringify(Boolean(characterInfo.showManeuversInSpellTracker))
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.showManeuversInSpellTracker]);

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

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_fourElementsDisciplines",
        JSON.stringify(characterInfo.fourElementsDisciplines || [])
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.fourElementsDisciplines]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spelltracker_arcaneTricksterMageHandOptOut",
        JSON.stringify(Boolean(characterInfo.arcaneTricksterMageHandOptOut))
      );
    } catch {
      // ignore write errors
    }
  }, [characterInfo.arcaneTricksterMageHandOptOut]);

  useEffect(() => {
    try {
      localStorage.removeItem("spelltracker_celestialLightOptOut");
      localStorage.removeItem("spelltracker_celestialSacredFlameOptOut");
    } catch {
      // ignore write errors
    }
  }, []);

  const monkMartialArtsDieSizeForLevel = (level) => {
    const l = Math.max(0, Math.min(20, Math.trunc(Number(level) || 0)));
    if (l >= 17) return 10;
    if (l >= 11) return 8;
    if (l >= 5) return 6;
    return 4;
  };

  const normalizeOptionalNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };

  useEffect(() => {
    const isSunSoulMonk = characterInfo.characterClass === "monk" && String(characterInfo.subclass || "") === "sunSoul";
    const level = Math.max(0, Math.trunc(Number(characterInfo.characterLevel) || 0));

    if (!isSunSoulMonk || level < 3) return;

    setCharacterInfo((prev) => {
      const stillSunSoulMonk = prev.characterClass === "monk" && String(prev.subclass || "") === "sunSoul";
      const prevLevel = Math.max(0, Math.trunc(Number(prev.characterLevel) || 0));
      if (!stillSunSoulMonk || prevLevel < 3) return prev;

      const desiredDieSize = monkMartialArtsDieSizeForLevel(prevLevel);
      const desiredId = "radiant_sun_bolt";
      const desiredName = "Radiant Sun Bolt";

      const existingWeapons = Array.isArray(prev.weapons) ? prev.weapons : [];
      const nextWeapons = [...existingWeapons];

      const byIdIndex = nextWeapons.findIndex((w) => String(w?.id || "") === desiredId);
      const byNameIndex = nextWeapons.findIndex(
        (w) => String(w?.name || "").trim().toLowerCase() === desiredName.toLowerCase()
      );
      const idx = byIdIndex >= 0 ? byIdIndex : byNameIndex;

      const desiredWeapon = {
        id: desiredId,
        name: desiredName,
        dmgType: "radiant",
        diceCount: 1,
        diceSize: desiredDieSize,
        statMod: "dex",
        proficient: true,
        isRanged: true,
        rangeNormalFt: 30,
        rangeLongFt: null,
        notes: "Ranged spell attack (30 ft). Use DEX for attack & damage. Damage die scales with Martial Arts.",
      };

      if (idx < 0) {
        return { ...prev, weapons: [...nextWeapons, desiredWeapon] };
      }

      const current = nextWeapons[idx] || {};
      const next = {
        ...current,
        id: desiredId,
        dmgType: desiredWeapon.dmgType,
        diceCount: desiredWeapon.diceCount,
        diceSize: desiredWeapon.diceSize,
        statMod: desiredWeapon.statMod,
        proficient: desiredWeapon.proficient,
        isRanged: desiredWeapon.isRanged,
        rangeNormalFt: desiredWeapon.rangeNormalFt,
        rangeLongFt: desiredWeapon.rangeLongFt,
        notes: desiredWeapon.notes,
      };

      const isSame =
        String(current?.id || "") === next.id &&
        String(current?.dmgType || "") === next.dmgType &&
        Number(current?.diceCount) === next.diceCount &&
        Number(current?.diceSize) === next.diceSize &&
        String(current?.statMod || "") === next.statMod &&
        Boolean(current?.proficient) === next.proficient &&
        Boolean(current?.isRanged) === Boolean(next.isRanged) &&
        normalizeOptionalNumber(current?.rangeNormalFt) === normalizeOptionalNumber(next.rangeNormalFt) &&
        normalizeOptionalNumber(current?.rangeLongFt) === normalizeOptionalNumber(next.rangeLongFt) &&
        String(current?.notes || "") === next.notes;

      if (isSame) return prev;

      nextWeapons[idx] = next;
      return { ...prev, weapons: nextWeapons };
    });
  }, [characterInfo.characterClass, characterInfo.subclass, characterInfo.characterLevel, characterInfo.weapons, setCharacterInfo]);

  return (
    <div className="App">
       <ThemeConfig>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
            <FeatureTrackersContext.Provider value={{ featureTrackers, setFeatureTrackers }}>
              <ClassSpellsDetailsContext.Provider value={{ classSpellsDetails, setClassSpellsDetails }}>
                <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ flex: "1 0 auto" }}>
                    <Routes>
                      <Route path="/" element={
                        <BackgroundWrapper bgImage={CharCreationBGPic}>
                            <CharacterCreationForm />
                        </BackgroundWrapper>
                      }></Route>

                      <Route path="/mainUI" element={<MainUI />}></Route>
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
            </FeatureTrackersContext.Provider>
          </CharacterInfoContext.Provider>
        </AuthContext.Provider>
       </ThemeConfig>
    </div>
  );
}

export default App;
