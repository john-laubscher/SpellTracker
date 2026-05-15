import React, { useContext, useEffect } from "react";
import axios from 'axios';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { CharacterInfoContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"
import SpellCheckboxes from "./SpellCheckboxes";
import {PrepareSpellButton, togglePreparedSpellBtnStyle} from "./PrepareSpellButton";
import SpellAccordian from './SpellAccordian';
import { renderDailySpellsList } from './RacialSpellsList'
import PreparedSpellsStatus from "./PreparedSpellsStatus";
import PrepareMagicalSecretButton from "./PrepareMagicalSecretButton";
import PrepareSpiritSessionButton from "./PrepareSpiritSessionButton";
import PrepareArcanaInitiateCantripButton from "./PrepareArcanaInitiateCantripButton";
import PrepareReaperCantripButton from "./PrepareReaperCantripButton";
import PrepareAcolyteOfNatureCantripButton from "./PrepareAcolyteOfNatureCantripButton";
import DomainSpellSwapModal from "./DomainSpellSwapModal";

const spellLevelColors = {
  0: '#607d8b',
  1: '#1565c0',
  2: '#2e7d32',
  3: '#f9a825',
  4: '#ef6c00',
  5: '#c62828',
  6: '#6a1b9a',
  7: '#283593',
  8: '#4e342e',
  9: '#b71c1c',
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const emptyByLevel = () => ({
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
});

const normalizeCompareName = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const humanizeSpellIndex = (idx) => {
  const raw = String(idx || "")
    .replace(/^\/+/, "")
    .trim()
    .replace(/[_-]+/g, " ")
    .toLowerCase();
  if (!raw) return "Unknown Spell";
  const titled = raw.replace(/\b\w/g, (m) => m.toUpperCase());
  return titled
    .replace(/\bOf\b/g, "of")
    .replace(/\bThe\b/g, "the")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bTo\b/g, "to")
    .replace(/\bA\b/g, "a")
    .replace(/\bAn\b/g, "an");
};

const ARCANA_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, names: [["Detect Magic"], ["Magic Missile"]] },
  { clericLevel: 3, spellLevel: 2, names: [["Magic Weapon"], ["Nystul's Magic Aura", "Arcanist's Magic Aura"]] },
  { clericLevel: 5, spellLevel: 3, names: [["Dispel Magic"], ["Magic Circle"]] },
  { clericLevel: 7, spellLevel: 4, names: [["Arcane Eye"], ["Leomund's Secret Chest", "Secret Chest"]] },
  { clericLevel: 9, spellLevel: 5, names: [["Planar Binding"], ["Teleportation Circle"]] },
];

const DEATH_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["false-life", "ray-of-sickness"] },
  { clericLevel: 3, spellLevel: 2, spells: ["blindness-deafness", "ray-of-enfeeblement"] },
  { clericLevel: 5, spellLevel: 3, spells: ["animate-dead", "vampiric-touch"] },
  { clericLevel: 7, spellLevel: 4, spells: ["blight", "death-ward"] },
  { clericLevel: 9, spellLevel: 5, spells: ["antilife-shell", "cloudkill"] },
];

const FORGE_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["identify", "searing-smite"] },
  { clericLevel: 3, spellLevel: 2, spells: ["heat-metal", "magic-weapon"] },
  { clericLevel: 5, spellLevel: 3, spells: ["elemental-weapon", "protection-from-energy"] },
  { clericLevel: 7, spellLevel: 4, spells: ["fabricate", "wall-of-fire"] },
  { clericLevel: 9, spellLevel: 5, spells: ["animate-objects", "creation"] },
];

const GRAVE_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["bane", "false-life"] },
  { clericLevel: 3, spellLevel: 2, spells: ["gentle-repose", "ray-of-enfeeblement"] },
  { clericLevel: 5, spellLevel: 3, spells: ["revivify", "vampiric-touch"] },
  { clericLevel: 7, spellLevel: 4, spells: ["blight", "death-ward"] },
  { clericLevel: 9, spellLevel: 5, spells: ["antilife-shell", "raise-dead"] },
];

const KNOWLEDGE_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["command", "identify"] },
  { clericLevel: 3, spellLevel: 2, spells: ["augury", "suggestion"] },
  { clericLevel: 5, spellLevel: 3, spells: ["nondetection", "speak-with-dead"] },
  { clericLevel: 7, spellLevel: 4, spells: ["arcane-eye", "confusion"] },
  { clericLevel: 9, spellLevel: 5, spells: ["legend-lore", "scrying"] },
];

const LIFE_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["bless", "cure-wounds"] },
  { clericLevel: 3, spellLevel: 2, spells: ["lesser-restoration", "spiritual-weapon"] },
  { clericLevel: 5, spellLevel: 3, spells: ["beacon-of-hope", "revivify"] },
  { clericLevel: 7, spellLevel: 4, spells: ["death-ward", "guardian-of-faith"] },
  { clericLevel: 9, spellLevel: 5, spells: ["mass-cure-wounds", "raise-dead"] },
];

const LIGHT_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["burning-hands", "faerie-fire"] },
  { clericLevel: 3, spellLevel: 2, spells: ["flaming-sphere", "scorching-ray"] },
  { clericLevel: 5, spellLevel: 3, spells: ["daylight", "fireball"] },
  { clericLevel: 7, spellLevel: 4, spells: ["guardian-of-faith", "wall-of-fire"] },
  { clericLevel: 9, spellLevel: 5, spells: ["flame-strike", "scrying"] },
];

const NATURE_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["animal-friendship", "speak-with-animals"] },
  { clericLevel: 3, spellLevel: 2, spells: ["barkskin", "spike-growth"] },
  { clericLevel: 5, spellLevel: 3, spells: ["plant-growth", "wind-wall"] },
  { clericLevel: 7, spellLevel: 4, spells: ["dominate-beast", "grasping-vine"] },
  { clericLevel: 9, spellLevel: 5, spells: ["insect-plague", "tree-stride"] },
];

const ORDER_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["command", "heroism"] },
  { clericLevel: 3, spellLevel: 2, spells: ["hold-person", "zone-of-truth"] },
  { clericLevel: 5, spellLevel: 3, spells: ["mass-healing-word", "slow"] },
  { clericLevel: 7, spellLevel: 4, spells: ["compulsion", "locate-creature"] },
  { clericLevel: 9, spellLevel: 5, spells: ["commune", "dominate-person"] },
];

const PEACE_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, names: [["Heroism"], ["Sanctuary"]] },
  { clericLevel: 3, spellLevel: 2, names: [["Aid"], ["Warding Bond"]] },
  { clericLevel: 5, spellLevel: 3, names: [["Beacon of Hope"], ["Sending"]] },
  {
    clericLevel: 7,
    spellLevel: 4,
    names: [["Aura of Purity"], ["Otiluke's Resilient Sphere", "Otiluke’s Resilient Sphere"]],
  },
  {
    clericLevel: 9,
    spellLevel: 5,
    names: [["Greater Restoration"], ["Rary's Telepathic Bond", "Rary’s Telepathic Bond"]],
  },
];

const TEMPEST_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, names: [["Fog Cloud"], ["Thunderwave"]] },
  { clericLevel: 3, spellLevel: 2, names: [["Gust of Wind"], ["Shatter"]] },
  { clericLevel: 5, spellLevel: 3, names: [["Call Lightning"], ["Sleet Storm"]] },
  { clericLevel: 7, spellLevel: 4, names: [["Control Water"], ["Ice Storm"]] },
  { clericLevel: 9, spellLevel: 5, names: [["Destructive Wave"], ["Insect Plague"]] },
];

const TRICKERY_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["charm-person", "disguise-self"] },
  { clericLevel: 3, spellLevel: 2, spells: ["mirror-image", "pass-without-trace"] },
  { clericLevel: 5, spellLevel: 3, spells: ["blink", "dispel-magic"] },
  { clericLevel: 7, spellLevel: 4, spells: ["dimension-door", "polymorph"] },
  { clericLevel: 9, spellLevel: 5, spells: ["dominate-person", "modify-memory"] },
];

const LAND_CIRCLE_SPELLS_BY_TERRAIN = {
  arctic: [
    { druidLevel: 3, spellLevel: 2, spells: ["hold-person", "spike-growth"] },
    { druidLevel: 5, spellLevel: 3, spells: ["sleet-storm", "slow"] },
    { druidLevel: 7, spellLevel: 4, spells: ["freedom-of-movement", "ice-storm"] },
    { druidLevel: 9, spellLevel: 5, spells: ["commune-with-nature", "cone-of-cold"] },
  ],
  coast: [
    { druidLevel: 3, spellLevel: 2, spells: ["mirror-image", "misty-step"] },
    { druidLevel: 5, spellLevel: 3, spells: ["water-breathing", "water-walk"] },
    { druidLevel: 7, spellLevel: 4, spells: ["control-water", "freedom-of-movement"] },
    { druidLevel: 9, spellLevel: 5, spells: ["conjure-elemental", "scrying"] },
  ],
  desert: [
    { druidLevel: 3, spellLevel: 2, spells: ["blur", "silence"] },
    { druidLevel: 5, spellLevel: 3, spells: ["create-food-and-water", "protection-from-energy"] },
    { druidLevel: 7, spellLevel: 4, spells: ["blight", "hallucinatory-terrain"] },
    { druidLevel: 9, spellLevel: 5, spells: ["insect-plague", "wall-of-stone"] },
  ],
  forest: [
    { druidLevel: 3, spellLevel: 2, spells: ["barkskin", "spider-climb"] },
    { druidLevel: 5, spellLevel: 3, spells: ["call-lightning", "plant-growth"] },
    { druidLevel: 7, spellLevel: 4, spells: ["divination", "freedom-of-movement"] },
    { druidLevel: 9, spellLevel: 5, spells: ["commune-with-nature", "tree-stride"] },
  ],
  grassland: [
    { druidLevel: 3, spellLevel: 2, spells: ["invisibility", "pass-without-trace"] },
    { druidLevel: 5, spellLevel: 3, spells: ["daylight", "haste"] },
    { druidLevel: 7, spellLevel: 4, spells: ["divination", "freedom-of-movement"] },
    { druidLevel: 9, spellLevel: 5, spells: ["dream", "insect-plague"] },
  ],
  mountain: [
    { druidLevel: 3, spellLevel: 2, spells: ["spider-climb", "spike-growth"] },
    { druidLevel: 5, spellLevel: 3, spells: ["lightning-bolt", "meld-into-stone"] },
    { druidLevel: 7, spellLevel: 4, spells: ["stone-shape", "stoneskin"] },
    { druidLevel: 9, spellLevel: 5, spells: ["passwall", "wall-of-stone"] },
  ],
  swamp: [
    { druidLevel: 3, spellLevel: 2, spells: ["darkness", "acid-arrow"] },
    { druidLevel: 5, spellLevel: 3, spells: ["water-walk", "stinking-cloud"] },
    { druidLevel: 7, spellLevel: 4, spells: ["freedom-of-movement", "locate-creature"] },
    { druidLevel: 9, spellLevel: 5, spells: ["insect-plague", "scrying"] },
  ],
  underdark: [
    { druidLevel: 3, spellLevel: 2, spells: ["spider-climb", "web"] },
    { druidLevel: 5, spellLevel: 3, spells: ["gaseous-form", "stinking-cloud"] },
    { druidLevel: 7, spellLevel: 4, spells: ["greater-invisibility", "stone-shape"] },
    { druidLevel: 9, spellLevel: 5, spells: ["cloudkill", "insect-plague"] },
  ],
};

const REAPER_CANTRIP_TOOLTIP =
  "When you cast a necromancy cantrip that normally targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other.";

const ACOLYTE_OF_NATURE_CANTRIP_TOOLTIP =
  "Acolyte of Nature cantrip (counts as a cleric cantrip; does not count toward cantrips known).";

//**Needs to account for classFeatures like Bard's Magical Secrets that allows for additional spells added to spell list. Might be just a bard thing, but possibly more classes */

export const SpellList = (props) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const hasGuidingWhispers =
    characterInfo?.characterClass === "bard" &&
    characterInfo?.subclass === "spirits" &&
    Number(characterInfo?.characterLevel || 0) >= 3;

  const hasAdditionalMagicalSecrets =
    characterInfo?.characterClass === "bard" &&
    characterInfo?.subclass === "lore" &&
    Number(characterInfo?.characterLevel || 0) >= 6;

  const hasSpiritSession =
    characterInfo?.characterClass === "bard" &&
    characterInfo?.subclass === "spirits" &&
    Number(characterInfo?.characterLevel || 0) >= 6;

  const magicalSecrets = Array.isArray(characterInfo?.magicalSecretsPrepared)
    ? characterInfo.magicalSecretsPrepared
    : [];

  const spiritSessionSpells = Array.isArray(characterInfo?.spiritSessionPrepared)
    ? characterInfo.spiritSessionPrepared
    : [];

  const hasArcanaInitiate =
    characterInfo?.characterClass === "cleric" &&
    characterInfo?.subclass === "arcana" &&
    Number(characterInfo?.characterLevel || 0) >= 1;

  const hasArcaneMastery =
    characterInfo?.characterClass === "cleric" &&
    characterInfo?.subclass === "arcana" &&
    Number(characterInfo?.characterLevel || 0) >= 17;

  const hasReaper =
    characterInfo?.characterClass === "cleric" &&
    characterInfo?.subclass === "death" &&
    Number(characterInfo?.characterLevel || 0) >= 1;

  const hasCircleOfMortality =
    characterInfo?.characterClass === "cleric" &&
    characterInfo?.subclass === "grave" &&
    Number(characterInfo?.characterLevel || 0) >= 1;

  const hasLightBonusCantrip =
    characterInfo?.characterClass === "cleric" &&
    characterInfo?.subclass === "light" &&
    Number(characterInfo?.characterLevel || 0) >= 1;

  const hasAcolyteOfNature =
    characterInfo?.characterClass === "cleric" &&
    characterInfo?.subclass === "nature" &&
    Number(characterInfo?.characterLevel || 0) >= 1;

  const arcanaInitiateCantrips = Array.isArray(characterInfo?.arcanaInitiateCantrips)
    ? characterInfo.arcanaInitiateCantrips
    : [];

  const arcaneMasterySpells = Array.isArray(characterInfo?.arcaneMasterySpells)
    ? characterInfo.arcaneMasterySpells
    : [];

  const reaperCantrip = characterInfo?.reaperCantrip || null;
  const acolyteOfNatureCantrip = characterInfo?.acolyteOfNatureCantrip || null;
  const domainSpellSwaps = characterInfo?.domainSpellSwaps || {};
  const currentDomainKey = React.useMemo(() => {
    const cls = String(characterInfo?.characterClass || "");
    const sub = String(characterInfo?.subclass || "");
    const base = `${cls}:${sub}`;
    if (cls === "druid" && sub === "land") {
      const terrain = String(characterInfo?.druidLandType || "").trim() || "arctic";
      return `${base}:${terrain}`;
    }
    return base;
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.druidLandType]);

  const [arcanaDomainSpellsByLevel, setArcanaDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [deathDomainSpellsByLevel, setDeathDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [forgeDomainSpellsByLevel, setForgeDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [graveDomainSpellsByLevel, setGraveDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [knowledgeDomainSpellsByLevel, setKnowledgeDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [lifeDomainSpellsByLevel, setLifeDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [lightDomainSpellsByLevel, setLightDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [natureDomainSpellsByLevel, setNatureDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [orderDomainSpellsByLevel, setOrderDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [peaceDomainSpellsByLevel, setPeaceDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [tempestDomainSpellsByLevel, setTempestDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [trickeryDomainSpellsByLevel, setTrickeryDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [landCircleSpellsByLevel, setLandCircleSpellsByLevel] = React.useState(() => emptyByLevel());
  const [domainSwapModal, setDomainSwapModal] = React.useState({
    open: false,
    spellLevel: 0,
    domainKey: "",
    originalSpell: null,
  });

  const [spellListLoadStatus, setSpellListLoadStatus] = React.useState({
    0: { loading: false, error: '' },
    1: { loading: false, error: '' },
    2: { loading: false, error: '' },
    3: { loading: false, error: '' },
    4: { loading: false, error: '' },
    5: { loading: false, error: '' },
    6: { loading: false, error: '' },
    7: { loading: false, error: '' },
    8: { loading: false, error: '' },
    9: { loading: false, error: '' },
  });

  // is this doing anything usefull?
  useEffect(() => {
  }, [characterInfo]);

  // Spirit Session selection is soft-limited (UI warns when over limit).

  useEffect(() => {
    const hasGuidingWhispers =
      characterInfo?.characterClass === "bard" &&
      characterInfo?.subclass === "spirits" &&
      Number(characterInfo?.characterLevel || 0) >= 3;

    if (!hasGuidingWhispers) {
      setCharacterInfo((prev) => {
        const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
        const next = current.filter((s) => s?.index !== "guidance");
        if (next.length === current.length) return prev;
        return {
          ...prev,
          spellsPrepared: {
            ...prev.spellsPrepared,
            0: next,
          },
        };
      });
      return;
    }

    const currentCantrips = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];
    const alreadyHasGuidance = currentCantrips.some((s) => s?.index === "guidance");
    if (alreadyHasGuidance) return;

    let cancelled = false;
    axios
      .get("/singlespell/guidance")
      .then((res) => {
        if (cancelled) return;
        const guidanceSpell = res?.data;
        if (!guidanceSpell?.index) return;

        const guidance60ft = {
          ...guidanceSpell,
          range: "60 feet",
        };

        setCharacterInfo((prev) => {
          const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
          if (current.some((s) => s?.index === "guidance")) return prev;
          return {
            ...prev,
            spellsPrepared: {
              ...prev.spellsPrepared,
              0: [...current, guidance60ft],
            },
          };
        });
      })
      .catch(() => {
        // Silently ignore: backend might not be running yet.
      });

    return () => {
      cancelled = true;
    };
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const BONUS_TAG = "circle_of_mortality";
    const currentCantrips = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];

    if (!hasCircleOfMortality) {
      const hasBonusSpare = currentCantrips.some(
        (s) => s?.index === "spare-the-dying" && s?.spelltrackerBonus === BONUS_TAG
      );
      if (!hasBonusSpare) return;

      setCharacterInfo((prev) => {
        const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
        const next = current.filter(
          (s) => !(s?.index === "spare-the-dying" && s?.spelltrackerBonus === BONUS_TAG)
        );
        if (next.length === current.length) return prev;
        return {
          ...prev,
          spellsPrepared: {
            ...prev.spellsPrepared,
            0: next,
          },
        };
      });
      return;
    }

    const alreadyHasBonusSpare = currentCantrips.some(
      (s) => s?.index === "spare-the-dying" && s?.spelltrackerBonus === BONUS_TAG
    );
    if (alreadyHasBonusSpare) return;

    let cancelled = false;
    axios
      .get("/singlespell/spare-the-dying")
      .then((res) => {
        if (cancelled) return;
        const spell = res?.data;
        if (!spell?.index) return;

        const bonusSpare = {
          ...spell,
          range: "30 feet",
          casting_time: "1 Bonus Action",
          spelltrackerBonus: BONUS_TAG,
        };

        setCharacterInfo((prev) => {
          const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
          const hasAnySpare = current.some((s) => s?.index === "spare-the-dying");
          if (hasAnySpare) return prev;
          return {
            ...prev,
            spellsPrepared: {
              ...prev.spellsPrepared,
              0: [...current, bonusSpare],
            },
          };
        });
      })
      .catch(() => {
        // Silently ignore: backend might not be running yet.
      });

    return () => {
      cancelled = true;
    };
  }, [
    hasCircleOfMortality,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const BONUS_TAG = "light_domain_bonus_cantrip";
    const currentCantrips = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];

    if (!hasLightBonusCantrip) {
      const hasBonusLight = currentCantrips.some((s) => s?.index === "light" && s?.spelltrackerBonus === BONUS_TAG);
      if (!hasBonusLight) return;

      setCharacterInfo((prev) => {
        const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
        const next = current.filter((s) => !(s?.index === "light" && s?.spelltrackerBonus === BONUS_TAG));
        if (next.length === current.length) return prev;
        return {
          ...prev,
          spellsPrepared: {
            ...prev.spellsPrepared,
            0: next,
          },
        };
      });
      return;
    }

    const alreadyHasAnyLight = currentCantrips.some((s) => s?.index === "light");
    if (alreadyHasAnyLight) return;

    let cancelled = false;
    axios
      .get("/singlespell/light")
      .then((res) => {
        if (cancelled) return;
        const spell = res?.data;
        if (!spell?.index) return;

        const bonusLight = {
          ...spell,
          spelltrackerBonus: BONUS_TAG,
        };

        setCharacterInfo((prev) => {
          const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
          if (current.some((s) => s?.index === "light")) return prev;
          return {
            ...prev,
            spellsPrepared: {
              ...prev.spellsPrepared,
              0: [...current, bonusLight],
            },
          };
        });
      })
      .catch(() => {
        // Silently ignore: backend might not be running yet.
      });

    return () => {
      cancelled = true;
    };
  }, [
    hasLightBonusCantrip,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const isArcanaCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "arcana";
    if (!isArcanaCleric) {
      setArcanaDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = ARCANA_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setArcanaDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();

        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/allspells/${lvl}/wizard`).then((res) => ({ lvl, res })))
        );

        const wizardLists = new Map();
        responses.forEach(({ lvl, res }) => {
          wizardLists.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = wizardLists.get(spellLevel) || [];

          row.names.forEach((nameCandidates) => {
            const candidates = (nameCandidates || []).map((n) => String(n || "")).filter(Boolean);
            const found =
              all.find((s) => candidates.some((c) => String(s?.name || "").toLowerCase() === String(c).toLowerCase())) ||
              all.find((s) => candidates.some((c) => normalizeCompareName(s?.name) === normalizeCompareName(c))) ||
              null;

            if (found?.index) {
              const existing = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index)));
              if (!existing.has(String(found.index))) {
                byLevel[spellLevel] = [...(byLevel[spellLevel] || []), found];
              }
            }
          });
        });

        if (!cancelled) setArcanaDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setArcanaDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isLandDruid = characterInfo?.characterClass === "druid" && characterInfo?.subclass === "land";
    if (!isLandDruid) {
      setLandCircleSpellsByLevel(emptyByLevel());
      return;
    }

    const terrainKey = (String(characterInfo?.druidLandType || "").trim() || "arctic").toLowerCase();
    const rows = Array.isArray(LAND_CIRCLE_SPELLS_BY_TERRAIN?.[terrainKey])
      ? LAND_CIRCLE_SPELLS_BY_TERRAIN[terrainKey]
      : [];

    const druidLevel = (() => {
      const raw = characterInfo?.classLevels?.druid;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "druid") return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const active = rows.filter((row) => druidLevel >= Number(row?.druidLevel || 0));
    if (active.length === 0) {
      setLandCircleSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setLandCircleSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setLandCircleSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.druid,
    characterInfo?.druidLandType,
  ]);

  useEffect(() => {
    const isDeathCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "death";
    if (!isDeathCleric) {
      setDeathDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = DEATH_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setDeathDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) =>
            axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res }))
          )
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setDeathDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setDeathDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isForgeCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "forge";
    if (!isForgeCleric) {
      setForgeDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = FORGE_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setForgeDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) =>
            axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res }))
          )
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setForgeDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setForgeDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isGraveCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "grave";
    if (!isGraveCleric) {
      setGraveDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = GRAVE_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setGraveDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) =>
            axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res }))
          )
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setGraveDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setGraveDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isKnowledgeCleric =
      characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "knowledge";
    if (!isKnowledgeCleric) {
      setKnowledgeDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = KNOWLEDGE_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setKnowledgeDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setKnowledgeDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setKnowledgeDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isLifeCleric =
      characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "life";
    if (!isLifeCleric) {
      setLifeDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = LIFE_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setLifeDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setLifeDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setLifeDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
        cancelled = true;
      };
    }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isLightCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "light";
    if (!isLightCleric) {
      setLightDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = LIGHT_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setLightDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setLightDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setLightDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isNatureCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "nature";
    if (!isNatureCleric) {
      setNatureDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = NATURE_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setNatureDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setNatureDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setNatureDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isOrderCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "order";
    if (!isOrderCleric) {
      setOrderDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = ORDER_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setOrderDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setOrderDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setOrderDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isPeaceCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "peace";
    if (!isPeaceCleric) {
      setPeaceDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = PEACE_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setPeaceDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];

          (row.names || []).forEach((nameCandidates) => {
            const candidates = (nameCandidates || []).map((n) => String(n || "")).filter(Boolean);
            const found =
              all.find((s) => candidates.some((c) => String(s?.name || "").toLowerCase() === String(c).toLowerCase())) ||
              all.find((s) => candidates.some((c) => normalizeCompareName(s?.name) === normalizeCompareName(c))) ||
              null;

            if (found?.index) {
              const existing = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index)));
              if (!existing.has(String(found.index))) {
                byLevel[spellLevel] = [...(byLevel[spellLevel] || []), found];
              }
            }
          });
        });

        if (!cancelled) setPeaceDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setPeaceDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isTempestCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "tempest";
    if (!isTempestCleric) {
      setTempestDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = TEMPEST_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setTempestDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];

          (row.names || []).forEach((nameCandidates) => {
            const candidates = (nameCandidates || []).map((n) => String(n || "")).filter(Boolean);
            const found =
              all.find((s) => candidates.some((c) => String(s?.name || "").toLowerCase() === String(c).toLowerCase())) ||
              all.find((s) => candidates.some((c) => normalizeCompareName(s?.name) === normalizeCompareName(c))) ||
              null;

            if (found?.index) {
              const existing = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index)));
              if (!existing.has(String(found.index))) {
                byLevel[spellLevel] = [...(byLevel[spellLevel] || []), found];
              }
            }
          });
        });

        if (!cancelled) setTempestDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setTempestDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isTrickeryCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "trickery";
    if (!isTrickeryCleric) {
      setTrickeryDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = TRICKERY_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setTrickeryDomainSpellsByLevel(emptyByLevel());
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const byLevel = emptyByLevel();
        const uniqueSpellLevels = Array.from(new Set(active.map((r) => Number(r.spellLevel)))).filter((n) =>
          Number.isFinite(n)
        );

        const responses = await Promise.all(
          uniqueSpellLevels.map((lvl) => axios.get(`/spellsbylevel/${lvl}`).then((res) => ({ lvl, res })))
        );

        const listsByLevel = new Map();
        responses.forEach(({ lvl, res }) => {
          listsByLevel.set(Number(lvl), res?.data?.results || []);
        });

        active.forEach((row) => {
          const spellLevel = Number(row.spellLevel);
          const all = listsByLevel.get(spellLevel) || [];
          const seen = new Set((byLevel[spellLevel] || []).map((s) => String(s?.index || "")));

          (row.spells || []).forEach((spellIndex) => {
            const key = String(spellIndex || "").trim();
            if (!key) return;
            const found = all.find((s) => String(s?.index || "") === key) || null;
            const toAdd = found?.index
              ? found
              : {
                  index: key,
                  name: humanizeSpellIndex(key),
                };

            if (toAdd?.index && !seen.has(String(toAdd.index))) {
              seen.add(String(toAdd.index));
              byLevel[spellLevel] = [...(byLevel[spellLevel] || []), toAdd];
            }
          });
        });

        if (!cancelled) setTrickeryDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setTrickeryDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  const toggleModal = (numericalSpellLevel) => {
    setSpells(spells => ({
      ...spells,
      [numericalSpellLevel]: {
        ...spells[numericalSpellLevel],
        showModal: !spells[numericalSpellLevel].showModal
      }
    }));
    console.log('true/false', spells[numericalSpellLevel].showModal)
  };

  const [spells, setSpells] = React.useState({
    0: {showModal: false, classSpells: []},
    1: {showModal: false, classSpells:[]},
    2: {showModal: false, classSpells:[]},
    3: {showModal: false, classSpells:[]},
    4: {showModal: false, classSpells:[]},
    5: {showModal: false, classSpells:[]},
    6: {showModal: false, classSpells:[]},
    7: {showModal: false, classSpells:[]},
    8: {showModal: false, classSpells:[]},
    9: {showModal: false, classSpells:[]},
  })

  useEffect(() => {
    setSpells((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = { ...next[k], classSpells: [] };
      });
      return next;
    });
    setSpellListLoadStatus({
      0: { loading: false, error: '' },
      1: { loading: false, error: '' },
      2: { loading: false, error: '' },
      3: { loading: false, error: '' },
      4: { loading: false, error: '' },
      5: { loading: false, error: '' },
      6: { loading: false, error: '' },
      7: { loading: false, error: '' },
      8: { loading: false, error: '' },
      9: { loading: false, error: '' },
    });
  }, [characterInfo.characterClass]);

  const loadClassSpellsForLevel = (numericalSpellLevel) => {
    if (spellListLoadStatus[numericalSpellLevel]?.loading) return;

    setSpellListLoadStatus((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: '' },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/${characterInfo.characterClass}`)
      .then((res) => {
        const fetchedSpellsArr = res.data?.results || [];
        setSpells((prevSpells) => ({
          ...prevSpells,
          [numericalSpellLevel]: {
            ...prevSpells[numericalSpellLevel],
            classSpells: fetchedSpellsArr,
          },
        }));
        setSpellListLoadStatus((prev) => ({
          ...prev,
          [numericalSpellLevel]: { loading: false, error: '' },
        }));
      })
      .catch((error) => {
        console.log('Error fetching spells:', error);
        setSpellListLoadStatus((prev) => ({
          ...prev,
          [numericalSpellLevel]: {
            loading: false,
            error: 'Failed to load spells. Is the backend running on port 3001?',
          },
        }));
      });
  };

  const showClassSpellsButton = (numericalSpellLevel) => {
    const isCantrips = Number(numericalSpellLevel) === 0;

    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const isOpening = !spells[numericalSpellLevel].showModal;
            toggleModal(numericalSpellLevel);
            if (isOpening && spells[numericalSpellLevel].classSpells.length === 0) {
              loadClassSpellsForLevel(numericalSpellLevel);
            }
          }}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            fontFamily: "'Cinzel', serif",
            color: '#5d4037',
            borderColor: 'rgba(139,69,19,0.4)',
            '&:hover': { borderColor: '#8B4513', backgroundColor: 'rgba(139,69,19,0.06)' },
          }}
        >
          {spells[numericalSpellLevel].showModal
            ? (isCantrips ? 'Close Cantrip List' : 'Close Spell List')
            : (isCantrips ? 'Learn more cantrips' : 'Prepare more spells')}
        </Button>
        {spells[numericalSpellLevel].showModal ? <AddSpellModal
          isModalOpen={spells[numericalSpellLevel].showModal}
          onClose={() => toggleModal(numericalSpellLevel)}
          numericalSpellLevel={numericalSpellLevel}
          spells={spells[numericalSpellLevel].classSpells}
          spellsLoading={spellListLoadStatus[numericalSpellLevel]?.loading}
          spellsError={spellListLoadStatus[numericalSpellLevel]?.error}
        /> : null}
      </div>
    )
  }

  const renderSpellModal = (numericalSpellLevel) => {
    return (
      <div>
        {showClassSpellsButton(numericalSpellLevel)}
      </div>
    )
  }

  const unprepareAllSpells = () => {
    setCharacterInfo((prevCharacterInfo) => ({
      ...prevCharacterInfo,
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
      },
    }));
  };

  const classes = togglePreparedSpellBtnStyle();
  // ***NEED FEATURE--CRITICAL--*** some subrace spells are not in the api, so will need a condition that instead shows a message saying that the description is not available
  //***NEED SPECIAL CONDITION*** for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const renderPCSpells = (textualSpellLevel, numericalSpellLevel) => {
    const classKey = characterInfo?.characterClass;
    const classMeta = ClassesData?.[classKey];
    if (!classMeta) return null;

    if (classMeta.isSpellCaster === "nonCaster") {
      return null;
    }

    const levelKey = Number(characterInfo?.characterLevel) || 0;
    const tableRow = spellTables?.[classKey]?.[levelKey];
    if (!tableRow) return null;

    const slotCount = Number(tableRow?.[textualSpellLevel]) || 0;
    if (slotCount === 0) return null;
      const levelColor = spellLevelColors[numericalSpellLevel] || '#607d8b';
      const isCantrips = textualSpellLevel === 'cantrips';
      const heading = isCantrips
        ? `Cantrips Known: ${slotCount}`
        : `${capitalize(textualSpellLevel)} Level Spell Slots`;

      return (
        <Box
          sx={{
            borderLeft: `4px solid ${levelColor}`,
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.45)',
            mb: 1.5,
            px: 1.5,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: '15px',
                color: levelColor,
              }}>
                {heading}
              </Typography>
              {isCantrips && hasGuidingWhispers ? (
                <Tooltip
                  arrow
                  title="Guidance is granted by Guiding Whispers and doesn’t count against cantrips known."
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7, color: levelColor }} />
                </Tooltip>
              ) : null}
               {isCantrips && hasCircleOfMortality ? (
                 <Tooltip
                   arrow
                   title="Spare the Dying is granted by Circle of Mortality and doesnâ€™t count against cantrips known."
                 >
                   <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7, color: levelColor }} />
                 </Tooltip>
               ) : null}
              {isCantrips && hasLightBonusCantrip ? (
                <Tooltip
                  arrow
                  title="Light is granted by Bonus Cantrip and doesn’t count against cantrips known."
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7, color: levelColor }} />
                </Tooltip>
              ) : null}
             </Box>
             {!isCantrips && (
               <SpellCheckboxes textualSpellLevel={textualSpellLevel} slotCount={slotCount} />
             )}
          </Box>
           {renderMagicalSecretsForLevel(numericalSpellLevel)}
           {renderSpiritSessionForLevel(numericalSpellLevel)}
           {renderArcanaInitiateCantripsForLevel(numericalSpellLevel)}
           {renderAcolyteOfNatureCantripForLevel(numericalSpellLevel)}
           {renderReaperCantripForLevel(numericalSpellLevel)}
           {renderDomainSpellsForLevel(numericalSpellLevel)}
           {renderPreparedSpells(numericalSpellLevel)}
           <Box sx={{ mt: 0.5 }}>
             {renderSpellModal(numericalSpellLevel)}
          </Box>
        </Box>
      );
  };



  const renderPreparedSpells = (numericalSpellLevel) => {
    const prepared = Array.isArray(characterInfo?.spellsPrepared?.[numericalSpellLevel])
      ? characterInfo.spellsPrepared[numericalSpellLevel]
      : [];

    const LIGHT_BONUS_TAG = "light_domain_bonus_cantrip";

    return (
      <div>
        {prepared.map((spell, index) => (
          <div key={spell.index}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              leadingControl={
                numericalSpellLevel === 0 &&
                spell?.index === "spare-the-dying" &&
                spell?.spelltrackerBonus === "circle_of_mortality" ? (
                  <Tooltip
                    arrow
                    title="Circle of Mortality cantrip (does not count toward cantrips known)."
                  >
                    <Chip
                      size="small"
                      label="CoM"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(21, 101, 192, 0.85)",
                        border: "1px solid rgba(21, 101, 192, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : numericalSpellLevel === 0 &&
                  spell?.index === "light" &&
                  spell?.spelltrackerBonus === LIGHT_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Light Domain bonus cantrip (does not count toward cantrips known)."
                  >
                    <Chip
                      size="small"
                      label="LD"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(239, 108, 0, 0.90)",
                        border: "1px solid rgba(239, 108, 0, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : null
              }
              actionButton={
                <PrepareSpellButton
                  numericalSpellLevel={numericalSpellLevel}
                  spell={spell}
                  index={index}
                />
              }
            />
          </div>
        ))}
      </div>
    );
  };

  const renderMagicalSecretsForLevel = (numericalSpellLevel) => {
    if (!hasAdditionalMagicalSecrets) return null;

    const secretsAtLevel = magicalSecrets.filter((spell) => {
      const lvl = Number(spell?.level);
      const key = Number.isFinite(lvl) ? lvl : 0;
      return key === Number(numericalSpellLevel);
    });

    if (secretsAtLevel.length === 0) return null;

    const isOver = magicalSecrets.length > 2;

    return (
      <Box sx={{ mb: 0.5 }}>
        {secretsAtLevel.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title="Additional Magical Secret (does not count toward prepared spells)."
                >
                  <Chip
                    size="small"
                    label="MS"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: 0.55,
                      backgroundColor: "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(62, 39, 35, 0.72)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(62, 39, 35, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={<PrepareMagicalSecretButton spell={spell} index={idx} />}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const renderSpiritSessionForLevel = (numericalSpellLevel) => {
    if (!hasSpiritSession) return null;

    const isOver = spiritSessionSpells.length > 1;

    const spellsAtLevel = spiritSessionSpells.filter((spell) => {
      const lvl = Number(spell?.level);
      const key = Number.isFinite(lvl) ? lvl : 0;
      return key === Number(numericalSpellLevel);
    });

    if (spellsAtLevel.length === 0) return null;

    return (
      <Box sx={{ mb: 0.5 }}>
        {spellsAtLevel.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title={
                    isOver
                      ? "Spirit Session spell (over limit — only 1 allowed)."
                      : "Spirit Session spell (does not count toward prepared spells)."
                  }
                >
                  <Chip
                    size="small"
                    label="SS"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: isOver ? 0.9 : 0.55,
                      backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(15, 118, 110, 0.85)",
                      border: isOver
                        ? "1px solid rgba(183, 28, 28, 0.30)"
                        : "1px solid rgba(15, 118, 110, 0.22)",
                      "@keyframes spiritSessionOverPulse": isOver
                        ? {
                            "0%": { transform: "translateY(0px) scale(1)" },
                            "100%": { transform: "translateY(-1px) scale(1.02)" },
                          }
                        : undefined,
                      animation: isOver
                        ? "spiritSessionOverPulse 1.6s ease-in-out infinite alternate"
                        : undefined,
                    }}
                  />
                </Tooltip>
              }
              actionButton={<PrepareSpiritSessionButton spell={spell} index={idx} />}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const renderArcanaInitiateCantripsForLevel = (numericalSpellLevel) => {
    if (!hasArcanaInitiate) return null;
    if (Number(numericalSpellLevel) !== 0) return null;
    if (arcanaInitiateCantrips.length === 0) return null;

    const isOver = arcanaInitiateCantrips.length > 2;

    return (
      <Box sx={{ mb: 0.5 }}>
        {arcanaInitiateCantrips.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title={
                    isOver
                      ? "Arcana Initiate cantrip (over limit — only 2 allowed)."
                      : "Arcana Initiate cantrip (does not count toward cantrips known)."
                  }
                >
                  <Chip
                    size="small"
                    label="AI"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: isOver ? 0.9 : 0.55,
                      backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(7, 89, 133, 0.85)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(7, 89, 133, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={<PrepareArcanaInitiateCantripButton spell={spell} index={idx} />}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const renderAcolyteOfNatureCantripForLevel = (numericalSpellLevel) => {
    if (!hasAcolyteOfNature) return null;
    if (Number(numericalSpellLevel) !== 0) return null;
    if (!acolyteOfNatureCantrip?.index) return null;

    return (
      <Box sx={{ mb: 0.5 }}>
        <Box sx={{ py: 0.2 }}>
          <SpellAccordian
            numericalSpellLevel={0}
            spell={acolyteOfNatureCantrip}
            leadingControl={
              <Tooltip arrow title={ACOLYTE_OF_NATURE_CANTRIP_TOOLTIP}>
                <Chip
                  size="small"
                  label="AoN"
                  sx={{
                    height: 18,
                    fontSize: "11px",
                    fontWeight: 800,
                    opacity: 0.7,
                    backgroundColor: "rgba(0,0,0,0.06)",
                    color: "rgba(2, 132, 199, 0.95)",
                    border: "1px solid rgba(2, 132, 199, 0.22)",
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              </Tooltip>
            }
            actionButton={<PrepareAcolyteOfNatureCantripButton spell={acolyteOfNatureCantrip} index={0} />}
          />
        </Box>
      </Box>
    );
  };

  const renderReaperCantripForLevel = (numericalSpellLevel) => {
    if (!hasReaper) return null;
    if (Number(numericalSpellLevel) !== 0) return null;
    if (!reaperCantrip?.index) return null;

    return (
      <Box sx={{ mb: 0.5 }}>
        <Box sx={{ py: 0.2 }}>
          <SpellAccordian
            numericalSpellLevel={0}
            spell={reaperCantrip}
            leadingControl={
              <Tooltip arrow title={REAPER_CANTRIP_TOOLTIP}>
                <Chip
                  size="small"
                  label="R"
                  sx={{
                    height: 18,
                    fontSize: "11px",
                    fontWeight: 800,
                    opacity: 0.7,
                    backgroundColor: "rgba(0,0,0,0.06)",
                    color: "rgba(46, 125, 50, 0.90)",
                    border: "1px solid rgba(46, 125, 50, 0.22)",
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              </Tooltip>
            }
            actionButton={<PrepareReaperCantripButton spell={reaperCantrip} index={0} />}
          />
        </Box>
      </Box>
    );
  };

  const renderDomainSpellsForLevel = (numericalSpellLevel) => {
    const arcanaAtLevel = Array.isArray(arcanaDomainSpellsByLevel?.[numericalSpellLevel])
      ? arcanaDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const deathAtLevel = Array.isArray(deathDomainSpellsByLevel?.[numericalSpellLevel])
      ? deathDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const forgeAtLevel = Array.isArray(forgeDomainSpellsByLevel?.[numericalSpellLevel])
      ? forgeDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const graveAtLevel = Array.isArray(graveDomainSpellsByLevel?.[numericalSpellLevel])
      ? graveDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const knowledgeAtLevel = Array.isArray(knowledgeDomainSpellsByLevel?.[numericalSpellLevel])
      ? knowledgeDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const lifeAtLevel = Array.isArray(lifeDomainSpellsByLevel?.[numericalSpellLevel])
      ? lifeDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const lightAtLevel = Array.isArray(lightDomainSpellsByLevel?.[numericalSpellLevel])
      ? lightDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const natureAtLevel = Array.isArray(natureDomainSpellsByLevel?.[numericalSpellLevel])
      ? natureDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const orderAtLevel = Array.isArray(orderDomainSpellsByLevel?.[numericalSpellLevel])
      ? orderDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const peaceAtLevel = Array.isArray(peaceDomainSpellsByLevel?.[numericalSpellLevel])
      ? peaceDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const tempestAtLevel = Array.isArray(tempestDomainSpellsByLevel?.[numericalSpellLevel])
      ? tempestDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const trickeryAtLevel = Array.isArray(trickeryDomainSpellsByLevel?.[numericalSpellLevel])
      ? trickeryDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const landCircleAtLevelRaw = Array.isArray(landCircleSpellsByLevel?.[numericalSpellLevel])
      ? landCircleSpellsByLevel[numericalSpellLevel]
      : [];

    const landCircleAtLevel = landCircleAtLevelRaw.map((s) => ({
      ...(s || {}),
      spelltrackerAlwaysPreparedKind: "circle_spell",
    }));

    const domainAtLevel = [
      ...arcanaAtLevel,
      ...deathAtLevel,
      ...forgeAtLevel,
      ...graveAtLevel,
      ...knowledgeAtLevel,
      ...lifeAtLevel,
      ...lightAtLevel,
      ...natureAtLevel,
      ...orderAtLevel,
      ...peaceAtLevel,
      ...tempestAtLevel,
      ...trickeryAtLevel,
      ...landCircleAtLevel,
    ];
    const swapsForCurrentDomain = domainSpellSwaps?.[currentDomainKey] || {};
    const domainSlotsAtLevel = domainAtLevel.map((original) => {
      const originalIndex = String(original?.index || "");
      const swapped = originalIndex ? swapsForCurrentDomain?.[originalIndex] : null;
      return {
        original,
        spell: swapped?.index ? swapped : original,
      };
    });

    const masteryAtLevel = hasArcaneMastery
      ? arcaneMasterySpells.filter((s) => Number(s?.level) === Number(numericalSpellLevel))
      : [];

    const domainSeen = new Set();
    const uniqueDomain = domainSlotsAtLevel.filter(({ spell }) => {
      const key = String(spell?.index || "");
      if (!key || domainSeen.has(key)) return false;
      domainSeen.add(key);
      return true;
    });

    const masterySeen = new Set(domainSeen);
    const uniqueMastery = masteryAtLevel.filter((s) => {
      const key = String(s?.index || "");
      if (!key || masterySeen.has(key)) return false;
      masterySeen.add(key);
      return true;
    });

    if (uniqueDomain.length === 0 && uniqueMastery.length === 0) return null;

    return (
      <Box sx={{ mb: 0.5 }}>
        {uniqueDomain.map(({ original, spell }) => {
          const kind =
            String(original?.spelltrackerAlwaysPreparedKind || spell?.spelltrackerAlwaysPreparedKind || "") ||
            "domain_spell";
          const isCircleSpell = kind === "circle_spell";
          const chipLabel = isCircleSpell ? "CS" : "DS";
          const chipTooltip = isCircleSpell
            ? "Circle Spell (always prepared; does not count toward prepared spells)."
            : "Domain Spell (always prepared; does not count toward prepared spells).";

          return (
          <Box key={`ds:${spell.index}`} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              leadingControl={
                <Tooltip arrow title={chipTooltip}>
                  <Chip
                    size="small"
                    label={chipLabel}
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: 0.55,
                      backgroundColor: "rgba(0,0,0,0.06)",
                      color: "rgba(62, 39, 35, 0.72)",
                      border: "1px solid rgba(62, 39, 35, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={
                <Tooltip arrow title="Swap this always-prepared spell (class/custom only).">
	                  <IconButton
                    size="small"
                    aria-label="Swap domain spell"
                    onClick={() =>
                      setDomainSwapModal({
                        open: true,
                        spellLevel: Number(numericalSpellLevel),
                        domainKey: currentDomainKey,
                        originalSpell: original || spell,
                      })
                    }
                    sx={{
                      p: 0.25,
                      color: "rgba(7, 89, 133, 0.95)",
                      border: "1px solid rgba(7, 89, 133, 0.22)",
                      backgroundColor: "rgba(2, 132, 199, 0.08)",
                      "&:hover": { backgroundColor: "rgba(2, 132, 199, 0.12)" },
                    }}
                  >
                    <SwapHorizIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              }
            />
          </Box>
          );
        })}

        {uniqueMastery.map((spell) => (
          <Box key={`am:${spell.index}`} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              leadingControl={
                <Tooltip arrow title="Arcane Mastery (always prepared; does not count toward prepared spells).">
                  <Chip
                    size="small"
                    label="AM"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: 0.55,
                      backgroundColor: "rgba(0,0,0,0.06)",
                      color: "rgba(62, 39, 35, 0.72)",
                      border: "1px solid rgba(62, 39, 35, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
            />
          </Box>
        ))}
      </Box>
    );
  };

  return (
      <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <PreparedSpellsStatus label="Spell Tracker" />
        <Button
          className={classes.prepareButton}
          variant="contained"
          size="small"
          onClick={unprepareAllSpells}
          sx={{ textTransform: 'none', fontSize: '11px' }}
        >
          Unprepare All
        </Button>
      </Box>
      {renderPCSpells("cantrips", 0)}
      {renderPCSpells("first", 1)}
      {renderPCSpells("second", 2)}
      {renderPCSpells("third", 3)}
      {renderPCSpells("fourth", 4)}
      {renderPCSpells("fifth", 5)}
      {renderPCSpells("sixth", 6)}
      {renderPCSpells("seventh", 7)}
      {renderPCSpells("eighth", 8)}
      {renderPCSpells("ninth", 9)}
      {renderDailySpellsList(characterInfo, setCharacterInfo)}

	      <DomainSpellSwapModal
	        open={domainSwapModal.open}
	        numericalSpellLevel={domainSwapModal.spellLevel}
	        domainKey={domainSwapModal.domainKey || currentDomainKey}
	        originalSpell={domainSwapModal.originalSpell}
	        spellClassKey={String(characterInfo?.characterClass || "cleric")}
	        onClose={() =>
	          setDomainSwapModal((s) => ({ ...s, open: false, originalSpell: null }))
	        }
	      />
    </Box>
  );
};

export default SpellList;
