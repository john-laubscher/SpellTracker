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
import PrepareBlessedWarriorCantripButton from "./PrepareBlessedWarriorCantripButton";
import PrepareDruidicWarriorCantripButton from "./PrepareDruidicWarriorCantripButton";
import PrepareReaperCantripButton from "./PrepareReaperCantripButton";
import PrepareAcolyteOfNatureCantripButton from "./PrepareAcolyteOfNatureCantripButton";
import DomainSpellSwapModal from "./DomainSpellSwapModal";
import PsionicSpellSwapModal from "./PsionicSpellSwapModal";
import BlessedWarriorCantripSwapModal from "./BlessedWarriorCantripSwapModal";
import BlessedWarriorCantripsModal from "./BlessedWarriorCantripsModal";
import DruidicWarriorCantripSwapModal from "./DruidicWarriorCantripSwapModal";
import DruidicWarriorCantripsModal from "./DruidicWarriorCantripsModal";
import BattleMasterManeuversModal from "./BattleMasterManeuversModal";
import ManeuverAccordian from "./ManeuverAccordian";
import SwordIcon from "./SwordIcon";
import BowIcon from "./BowIcon";
import MonkKiUsesPanel from "./MonkKiUsesPanel";
import SoulknifePsionicEnergyDieUsesPanel from "./SoulknifePsionicEnergyDieUsesPanel";

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

const PALADIN_OATH_SPELL_LEVEL_BY_PALADIN_LEVEL = {
  3: 1,
  5: 2,
  9: 3,
  13: 4,
  17: 5,
};

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

const TWILIGHT_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["faerie-fire", "sleep"] },
  { clericLevel: 3, spellLevel: 2, spells: ["moonbeam", "see-invisibility"] },
  { clericLevel: 5, spellLevel: 3, spells: ["aura-of-vitality", "leomunds-tiny-hut"] },
  { clericLevel: 7, spellLevel: 4, spells: ["aura-of-life", "greater-invisibility"] },
  { clericLevel: 9, spellLevel: 5, spells: ["circle-of-power", "mislead"] },
];

const WAR_DOMAIN_SPELLS = [
  { clericLevel: 1, spellLevel: 1, spells: ["divine-favor", "shield-of-faith"] },
  { clericLevel: 3, spellLevel: 2, spells: ["magic-weapon", "spiritual-weapon"] },
  { clericLevel: 5, spellLevel: 3, spells: ["crusaders-mantle", "spirit-guardians"] },
  { clericLevel: 7, spellLevel: 4, spells: ["freedom-of-movement", "stoneskin"] },
  { clericLevel: 9, spellLevel: 5, spells: ["flame-strike", "hold-monster"] },
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

const SPORES_CIRCLE_SPELLS = [
  { druidLevel: 2, spellLevel: 0, spells: ["chill-touch"] },
  { druidLevel: 3, spellLevel: 2, spells: ["blindness-deafness", "gentle-repose"] },
  { druidLevel: 5, spellLevel: 3, spells: ["animate-dead", "gaseous-form"] },
  { druidLevel: 7, spellLevel: 4, spells: ["blight", "confusion"] },
  { druidLevel: 9, spellLevel: 5, spells: ["cloudkill", "contagion"] },
];

const STARS_CIRCLE_SPELLS = [
  { druidLevel: 2, spellLevel: 0, spells: ["guidance"] },
  { druidLevel: 2, spellLevel: 1, spells: ["guiding-bolt"] },
];

const WILDFIRE_CIRCLE_SPELLS = [
  { druidLevel: 2, spellLevel: 1, spells: ["burning-hands", "cure-wounds"] },
  { druidLevel: 3, spellLevel: 2, spells: ["flaming-sphere", "scorching-ray"] },
  { druidLevel: 5, spellLevel: 3, spells: ["plant-growth", "revivify"] },
  { druidLevel: 7, spellLevel: 4, spells: ["aura-of-life", "fire-shield"] },
  { druidLevel: 9, spellLevel: 5, spells: ["flame-strike", "mass-cure-wounds"] },
];

const REAPER_CANTRIP_TOOLTIP =
  "When you cast a necromancy cantrip that normally targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other.";

const ACOLYTE_OF_NATURE_CANTRIP_TOOLTIP =
  "Acolyte of Nature cantrip (counts as a cleric cantrip; does not count toward cantrips known).";

const THOUSAND_FORMS_TOOLTIP =
  "Thousand Forms: Alter Self can be cast at will (doesn't cost spell slots).";

//**Needs to account for classFeatures like Bard's Magical Secrets that allows for additional spells added to spell list. Might be just a bard thing, but possibly more classes */

export const SpellList = (props) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const rawClassKey = characterInfo?.characterClass;
  const classKey = rawClassKey === "sorceror" ? "sorcerer" : rawClassKey;
  const classMeta = ClassesData?.[classKey] || ClassesData?.[rawClassKey] || null;
  const isNonCaster = classMeta?.isSpellCaster === "nonCaster" || classMeta?.spellcastingAbility === "nonCaster";
  const subclassMeta = classMeta?.subclasses?.[characterInfo?.subclass] || null;
  const subclassSpellcasting = subclassMeta?.spellcasting || null;
  const characterLevel = Number(characterInfo?.characterLevel) || 0;
  const showSoulknifePsionicUses =
    classKey === "rogue" && characterInfo?.subclass === "soulknife" && characterLevel >= 9;
  const hasSubclassSpellcasting =
    Boolean(subclassSpellcasting) && characterLevel >= Number(subclassSpellcasting?.startsAtLevel || 1);
  const spellTableKey = hasSubclassSpellcasting ? String(subclassSpellcasting?.spellTableKey || "") : String(classKey || "");
  const spellListClassKey = hasSubclassSpellcasting
    ? String(subclassSpellcasting?.spellListClassKey || "")
    : String(classKey || "");
  const effectiveIsNonCaster = isNonCaster && !hasSubclassSpellcasting;
  const isFighter = String(characterInfo?.characterClass || "") === "fighter";
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

  const druidLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.druid;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterInfo?.characterClass === "druid") {
      return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
    }
    return 0;
  }, [characterInfo?.classLevels?.druid, characterInfo?.characterClass, characterInfo?.characterLevel]);

  const fighterLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.fighter;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterInfo?.characterClass === "fighter") {
      return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
    }
    return 0;
  }, [characterInfo?.classLevels?.fighter, characterInfo?.characterClass, characterInfo?.characterLevel]);

  const isBattleMaster =
    characterInfo?.characterClass === "fighter" &&
    characterInfo?.subclass === "battleMaster" &&
    fighterLevel >= 3;

  const showManeuversInSpellTracker = Boolean(characterInfo?.showManeuversInSpellTracker);

  const selectedBattleMasterManeuvers = Array.isArray(characterInfo?.battleMasterManeuvers)
    ? characterInfo.battleMasterManeuvers
    : [];

  const [battleMasterManeuversModalOpen, setBattleMasterManeuversModalOpen] = React.useState(false);

  const hideFighterSpellSection =
    effectiveIsNonCaster && isFighter && !(isBattleMaster && showManeuversInSpellTracker);

  const isMonk = String(characterInfo?.characterClass || "") === "monk";

  const hasThousandForms =
    characterInfo?.characterClass === "druid" &&
    characterInfo?.subclass === "moon" &&
    druidLevel >= 14;

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

  const hasBlessedWarrior =
    characterInfo?.characterClass === "paladin" &&
    String(characterInfo?.fightingStyle || "") === "Blessed Warrior" &&
    Number(characterInfo?.characterLevel || 0) >= 2;

  const hasDruidicWarrior =
    characterInfo?.characterClass === "ranger" &&
    String(characterInfo?.fightingStyle || "") === "Druidic Warrior" &&
    Number(characterInfo?.characterLevel || 0) >= 2;

  const hasDraconicGift =
    characterInfo?.characterClass === "ranger" &&
    characterInfo?.subclass === "drakewarden" &&
    Number(characterInfo?.characterLevel || 0) >= 3;

  const hasArcaneTrickster =
    characterInfo?.characterClass === "rogue" &&
    String(characterInfo?.subclass || "") === "arcaneTrickster" &&
    Number(characterInfo?.characterLevel || 0) >= 3;

  const hasSwarmkeeperMagic =
    characterInfo?.characterClass === "ranger" &&
    (String(characterInfo?.subclass || "") === "swarmKeeper" || String(characterInfo?.subclass || "") === "swarmkeeper") &&
    Number(characterInfo?.characterLevel || 0) >= 3;

  const arcanaInitiateCantrips = Array.isArray(characterInfo?.arcanaInitiateCantrips)
    ? characterInfo.arcanaInitiateCantrips
    : [];

  const blessedWarriorCantrips = Array.isArray(characterInfo?.blessedWarriorCantrips)
    ? characterInfo.blessedWarriorCantrips
    : [];

  const druidicWarriorCantrips = Array.isArray(characterInfo?.druidicWarriorCantrips)
    ? characterInfo.druidicWarriorCantrips
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
  const [sporesCircleSpellsByLevel, setSporesCircleSpellsByLevel] = React.useState(() => emptyByLevel());
  const [starsCircleSpellsByLevel, setStarsCircleSpellsByLevel] = React.useState(() => emptyByLevel());
  const [wildfireCircleSpellsByLevel, setWildfireCircleSpellsByLevel] = React.useState(() => emptyByLevel());
  const [twilightDomainSpellsByLevel, setTwilightDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [warDomainSpellsByLevel, setWarDomainSpellsByLevel] = React.useState(() => emptyByLevel());
  const [oathSpellsByLevel, setOathSpellsByLevel] = React.useState(() => emptyByLevel());
  const [domainSwapModal, setDomainSwapModal] = React.useState({
    open: false,
    spellLevel: 0,
    domainKey: "",
    originalSpell: null,
  });

  const [psionicSwapModal, setPsionicSwapModal] = React.useState({
    open: false,
    spellLevel: 0,
    psionicKey: "",
    originalSpell: null,
  });

  const [bwSwapModal, setBwSwapModal] = React.useState({
    open: false,
    originalSpell: null,
  });

  const [bwPickerModalOpen, setBwPickerModalOpen] = React.useState(false);

  const [dwSwapModal, setDwSwapModal] = React.useState({
    open: false,
    originalSpell: null,
  });

  const [dwPickerModalOpen, setDwPickerModalOpen] = React.useState(false);

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
    const BONUS_TAG = "draconic_gift_thaumaturgy";
    const currentCantrips = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];

    if (!hasDraconicGift) {
      const hasBonusThaum = currentCantrips.some(
        (s) => s?.index === "thaumaturgy" && s?.spelltrackerBonus === BONUS_TAG
      );
      if (!hasBonusThaum) return;

      setCharacterInfo((prev) => {
        const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
        const next = current.filter((s) => !(s?.index === "thaumaturgy" && s?.spelltrackerBonus === BONUS_TAG));
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

    const alreadyHasAnyThaumaturgy = currentCantrips.some((s) => s?.index === "thaumaturgy");
    if (alreadyHasAnyThaumaturgy) return;

    let cancelled = false;
    axios
      .get("/singlespell/thaumaturgy")
      .then((res) => {
        if (cancelled) return;
        const spell = res?.data;
        if (!spell?.index) return;

        const bonusThaumaturgy = {
          ...spell,
          spelltrackerBonus: BONUS_TAG,
        };

        setCharacterInfo((prev) => {
          const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
          if (current.some((s) => s?.index === "thaumaturgy")) return prev;
          return {
            ...prev,
            spellsPrepared: {
              ...prev.spellsPrepared,
              0: [...current, bonusThaumaturgy],
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
  }, [hasDraconicGift, characterInfo?.spellsPrepared, setCharacterInfo]);

  useEffect(() => {
    const BONUS_TAG = "arcane_trickster_mage_hand";
    const currentCantrips = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];

    const rogueLevel = (() => {
      const raw = characterInfo?.classLevels?.rogue;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "rogue") {
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      }
      return 0;
    })();

    const shouldHaveArcaneTricksterMageHand = hasArcaneTrickster && rogueLevel >= 3;
    const arcaneTricksterMageHandOptOut = Boolean(characterInfo?.arcaneTricksterMageHandOptOut);

    if (!shouldHaveArcaneTricksterMageHand) {
      const hasTaggedMageHand = currentCantrips.some(
        (s) => s?.index === "mage-hand" && s?.spelltrackerBonus === BONUS_TAG
      );
      if (!hasTaggedMageHand) return;

      setCharacterInfo((prev) => {
        const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
        const next = current.filter(
          (s) => !(s?.index === "mage-hand" && s?.spelltrackerBonus === BONUS_TAG)
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

    if (arcaneTricksterMageHandOptOut) return;

    const alreadyHasAnyMageHand = currentCantrips.some((s) => s?.index === "mage-hand");
    if (alreadyHasAnyMageHand) return;

    let cancelled = false;
    axios
      .get("/singlespell/mage-hand")
      .then((res) => {
        if (cancelled) return;
        const spell = res?.data;
        if (!spell?.index) return;

        const arcaneTricksterMageHand = {
          ...spell,
          spelltrackerBonus: BONUS_TAG,
        };

        setCharacterInfo((prev) => {
          const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
          if (current.some((s) => s?.index === "mage-hand")) return prev;
          return {
            ...prev,
            spellsPrepared: {
              ...prev.spellsPrepared,
              0: [...current, arcaneTricksterMageHand],
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
  }, [hasArcaneTrickster, characterInfo?.arcaneTricksterMageHandOptOut, characterInfo?.classLevels?.rogue, characterInfo?.characterClass, characterInfo?.characterLevel, characterInfo?.spellsPrepared, setCharacterInfo]);

  useEffect(() => {
    const FEY_WANDERER_MAGIC_BONUS_TAG = "fey_wanderer_magic_bonus_spell";
    const FEY_REINFORCEMENTS_BONUS_TAG = "fey_reinforcements_bonus_spell";

    const isFeyWanderer =
      characterInfo?.characterClass === "ranger" && String(characterInfo?.subclass || "") === "feyWanderer";

    const rangerLevel = (() => {
      const raw = characterInfo?.classLevels?.ranger;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "ranger")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const magicTable = [
      { rangerLevel: 3, spellLevel: 1, index: "charm-person" },
      { rangerLevel: 5, spellLevel: 2, index: "misty-step" },
      { rangerLevel: 9, spellLevel: 3, index: "dispel-magic" },
      { rangerLevel: 13, spellLevel: 4, index: "dimension-door" },
      { rangerLevel: 17, spellLevel: 5, index: "mislead" },
    ];

    const reinforcements = [{ rangerLevel: 11, spellLevel: 3, index: "summon-fey" }];

    const activeMagic = isFeyWanderer ? magicTable.filter((row) => rangerLevel >= row.rangerLevel) : [];
    const activeReinforcements = isFeyWanderer ? reinforcements.filter((row) => rangerLevel >= row.rangerLevel) : [];

    setCharacterInfo((prev) => {
      const current = prev?.spellsPrepared && typeof prev.spellsPrepared === "object" ? prev.spellsPrepared : {};
      const next = { ...current };

      let changed = false;

      // Remove any Fey Wanderer bonus spells when subclass/level no longer qualifies.
      const allowedMagic = new Map(activeMagic.map((r) => [String(r.index), r]));
      const allowedReinforcements = new Map(activeReinforcements.map((r) => [String(r.index), r]));

      Object.keys(next).forEach((levelKey) => {
        const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];
        const filtered = list.filter((s) => {
          const tag = String(s?.spelltrackerBonus || "");
          if (tag === FEY_WANDERER_MAGIC_BONUS_TAG) return allowedMagic.has(String(s?.index || ""));
          if (tag === FEY_REINFORCEMENTS_BONUS_TAG) return allowedReinforcements.has(String(s?.index || ""));
          return true;
        });

        if (filtered.length !== list.length) {
          changed = true;
          next[levelKey] = filtered;
        }
      });

      if (isFeyWanderer) {
        const ensureSpell = (row, tag) => {
          const levelKey = String(row.spellLevel);
          const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];

          const existingIdx = list.findIndex((s) => String(s?.index || "") === row.index);
          if (existingIdx !== -1) {
            const existing = list[existingIdx] || null;
            const needsTag =
              String(existing?.spelltrackerBonus || "") !== tag || existing?.spelltrackerDoesNotCount !== true;
            if (!needsTag) return;

            changed = true;
            const updated = {
              ...existing,
              name: existing?.name || humanizeSpellIndex(row.index),
              spelltrackerBonus: tag,
              spelltrackerDoesNotCount: true,
            };
            next[levelKey] = list.map((s, idx) => (idx === existingIdx ? updated : s));
            return;
          }

          changed = true;
          next[levelKey] = [
            ...list,
            {
              index: row.index,
              name: humanizeSpellIndex(row.index),
              spelltrackerBonus: tag,
              spelltrackerDoesNotCount: true,
            },
          ];
        };

        activeMagic.forEach((row) => ensureSpell(row, FEY_WANDERER_MAGIC_BONUS_TAG));
        activeReinforcements.forEach((row) => ensureSpell(row, FEY_REINFORCEMENTS_BONUS_TAG));
      }

      if (!changed) return prev;
      return { ...prev, spellsPrepared: next };
    });
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.ranger,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const GLOOM_STALKER_MAGIC_BONUS_TAG = "gloom_stalker_magic_bonus_spell";

    const isGloomStalker =
      characterInfo?.characterClass === "ranger" && String(characterInfo?.subclass || "") === "gloomStalker";

    const rangerLevel = (() => {
      const raw = characterInfo?.classLevels?.ranger;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "ranger")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const magicTable = [
      { rangerLevel: 3, spellLevel: 1, index: "disguise-self" },
      { rangerLevel: 5, spellLevel: 2, index: "rope-trick" },
      { rangerLevel: 9, spellLevel: 3, index: "fear" },
      { rangerLevel: 13, spellLevel: 4, index: "greater-invisibility" },
      { rangerLevel: 17, spellLevel: 5, index: "seeming" },
    ];

    const activeMagic = isGloomStalker ? magicTable.filter((row) => rangerLevel >= row.rangerLevel) : [];

    setCharacterInfo((prev) => {
      const current = prev?.spellsPrepared && typeof prev.spellsPrepared === "object" ? prev.spellsPrepared : {};
      const next = { ...current };

      let changed = false;

      // Remove any Gloom Stalker bonus spells when subclass/level no longer qualifies.
      const allowedMagic = new Map(activeMagic.map((r) => [String(r.index), r]));

      Object.keys(next).forEach((levelKey) => {
        const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];
        const filtered = list.filter((s) => {
          const tag = String(s?.spelltrackerBonus || "");
          if (tag === GLOOM_STALKER_MAGIC_BONUS_TAG) return allowedMagic.has(String(s?.index || ""));
          return true;
        });

        if (filtered.length !== list.length) {
          changed = true;
          next[levelKey] = filtered;
        }
      });

      if (isGloomStalker) {
        const ensureSpell = (row) => {
          const levelKey = String(row.spellLevel);
          const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];

          const existingIdx = list.findIndex((s) => String(s?.index || "") === row.index);
          if (existingIdx !== -1) {
            const existing = list[existingIdx] || null;
            const needsTag =
              String(existing?.spelltrackerBonus || "") !== GLOOM_STALKER_MAGIC_BONUS_TAG ||
              existing?.spelltrackerDoesNotCount !== true;
            if (!needsTag) return;

            changed = true;
            const updated = {
              ...existing,
              name: existing?.name || humanizeSpellIndex(row.index),
              spelltrackerBonus: GLOOM_STALKER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            };
            next[levelKey] = list.map((s, idx) => (idx === existingIdx ? updated : s));
            return;
          }

          changed = true;
          next[levelKey] = [
            ...list,
            {
              index: row.index,
              name: humanizeSpellIndex(row.index),
              spelltrackerBonus: GLOOM_STALKER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            },
          ];
        };

        activeMagic.forEach((row) => ensureSpell(row));
      }

      if (!changed) return prev;
      return { ...prev, spellsPrepared: next };
    });
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.ranger,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const PSIONIC_SPELL_BONUS_TAG = "aberrant_mind_psionic_spell";

    const isAberrantMind =
      characterInfo?.characterClass === "sorcerer" && String(characterInfo?.subclass || "") === "aberrantMind";

    const sorcererLevel = (() => {
      const raw = characterInfo?.classLevels?.sorcerer;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "sorcerer")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const psionicKey = "sorcerer:aberrantMind";
    const swapsForPsionics = characterInfo?.psionicSpellSwaps?.[psionicKey] || {};

    const psionicTable = [
      { sorcererLevel: 1, spellLevel: 0, originalIndex: "mind-sliver" },
      { sorcererLevel: 1, spellLevel: 1, originalIndex: "arms-of-hadar" },
      { sorcererLevel: 1, spellLevel: 1, originalIndex: "dissonant-whispers" },
      { sorcererLevel: 3, spellLevel: 2, originalIndex: "calm-emotions" },
      { sorcererLevel: 3, spellLevel: 2, originalIndex: "detect-thoughts" },
      { sorcererLevel: 5, spellLevel: 3, originalIndex: "hunger-of-hadar" },
      { sorcererLevel: 5, spellLevel: 3, originalIndex: "sending" },
      { sorcererLevel: 7, spellLevel: 4, originalIndex: "evards-black-tentacles" },
      { sorcererLevel: 7, spellLevel: 4, originalIndex: "summon-aberration" },
      { sorcererLevel: 9, spellLevel: 5, originalIndex: "rarys-telepathic-bond" },
      { sorcererLevel: 9, spellLevel: 5, originalIndex: "telekinesis" },
    ];

    const active = isAberrantMind ? psionicTable.filter((row) => sorcererLevel >= row.sorcererLevel) : [];

    setCharacterInfo((prev) => {
      const current = prev?.spellsPrepared && typeof prev.spellsPrepared === "object" ? prev.spellsPrepared : {};
      const next = { ...current };

      let changed = false;

      const allowedByOrigin = new Map(active.map((r) => [String(r.originalIndex), r]));

      // Remove any Aberrant Mind psionic bonus spells when subclass/level no longer qualifies.
      Object.keys(next).forEach((levelKey) => {
        const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];
        const filtered = list.filter((s) => {
          const tag = String(s?.spelltrackerBonus || "");
          if (tag !== PSIONIC_SPELL_BONUS_TAG) return true;
          const origin = String(s?.spelltrackerOrigin || "");
          return Boolean(origin && allowedByOrigin.has(origin));
        });

        if (filtered.length !== list.length) {
          changed = true;
          next[levelKey] = filtered;
        }
      });

      if (isAberrantMind) {
        const ensureSpell = (row) => {
          const levelKey = String(row.spellLevel);
          const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];

          const swapped = row.originalIndex ? swapsForPsionics?.[row.originalIndex] : null;
          const desiredIndex = String(swapped?.index || row.originalIndex || "").trim();
          if (!desiredIndex) return;

          const existingIdx = list.findIndex((s) => String(s?.index || "") === desiredIndex);
          if (existingIdx !== -1) {
            const existing = list[existingIdx] || null;
            const needsTag =
              String(existing?.spelltrackerBonus || "") !== PSIONIC_SPELL_BONUS_TAG ||
              existing?.spelltrackerDoesNotCount !== true ||
              String(existing?.spelltrackerOrigin || "") !== String(row.originalIndex || "");

            if (!needsTag) return;

            changed = true;
            const updated = {
              ...existing,
              name: existing?.name || swapped?.name || humanizeSpellIndex(desiredIndex),
              spelltrackerBonus: PSIONIC_SPELL_BONUS_TAG,
              spelltrackerOrigin: String(row.originalIndex || ""),
              spelltrackerDoesNotCount: true,
            };
            next[levelKey] = list.map((s, idx) => (idx === existingIdx ? updated : s));
            return;
          }

          changed = true;
          next[levelKey] = [
            ...list,
            {
              index: desiredIndex,
              name: swapped?.name || humanizeSpellIndex(desiredIndex),
              spelltrackerBonus: PSIONIC_SPELL_BONUS_TAG,
              spelltrackerOrigin: String(row.originalIndex || ""),
              spelltrackerDoesNotCount: true,
            },
          ];
        };

        active.forEach((row) => ensureSpell(row));
      }

      if (!changed) return prev;
      return { ...prev, spellsPrepared: next };
    });
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.sorcerer,
    characterInfo?.spellsPrepared,
    characterInfo?.psionicSpellSwaps,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const HORIZON_WALKER_MAGIC_BONUS_TAG = "horizon_walker_magic_bonus_spell";

    const isHorizonWalker =
      characterInfo?.characterClass === "ranger" && String(characterInfo?.subclass || "") === "horizonWalker";

    const rangerLevel = (() => {
      const raw = characterInfo?.classLevels?.ranger;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "ranger")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const magicTable = [
      { rangerLevel: 3, spellLevel: 1, index: "protection-from-evil-and-good" },
      { rangerLevel: 5, spellLevel: 2, index: "misty-step" },
      { rangerLevel: 9, spellLevel: 3, index: "haste" },
      { rangerLevel: 13, spellLevel: 4, index: "banishment" },
      { rangerLevel: 17, spellLevel: 5, index: "teleportation-circle" },
    ];

    const activeMagic = isHorizonWalker ? magicTable.filter((row) => rangerLevel >= row.rangerLevel) : [];

    setCharacterInfo((prev) => {
      const current = prev?.spellsPrepared && typeof prev.spellsPrepared === "object" ? prev.spellsPrepared : {};
      const next = { ...current };

      let changed = false;

      // Remove any Horizon Walker bonus spells when subclass/level no longer qualifies.
      const allowedMagic = new Map(activeMagic.map((r) => [String(r.index), r]));

      Object.keys(next).forEach((levelKey) => {
        const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];
        const filtered = list.filter((s) => {
          const tag = String(s?.spelltrackerBonus || "");
          if (tag === HORIZON_WALKER_MAGIC_BONUS_TAG) return allowedMagic.has(String(s?.index || ""));
          return true;
        });

        if (filtered.length !== list.length) {
          changed = true;
          next[levelKey] = filtered;
        }
      });

      if (isHorizonWalker) {
        const ensureSpell = (row) => {
          const levelKey = String(row.spellLevel);
          const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];

          const existingIdx = list.findIndex((s) => String(s?.index || "") === row.index);
          if (existingIdx !== -1) {
            const existing = list[existingIdx] || null;
            const needsTag =
              String(existing?.spelltrackerBonus || "") !== HORIZON_WALKER_MAGIC_BONUS_TAG ||
              existing?.spelltrackerDoesNotCount !== true;
            if (!needsTag) return;

            changed = true;
            const updated = {
              ...existing,
              name: existing?.name || humanizeSpellIndex(row.index),
              spelltrackerBonus: HORIZON_WALKER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            };
            next[levelKey] = list.map((s, idx) => (idx === existingIdx ? updated : s));
            return;
          }

          changed = true;
          next[levelKey] = [
            ...list,
            {
              index: row.index,
              name: humanizeSpellIndex(row.index),
              spelltrackerBonus: HORIZON_WALKER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            },
          ];
        };

        activeMagic.forEach((row) => ensureSpell(row));
      }

      if (!changed) return prev;
      return { ...prev, spellsPrepared: next };
    });
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.ranger,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const MONSTER_SLAYER_MAGIC_BONUS_TAG = "monster_slayer_magic_bonus_spell";

    const isMonsterSlayer =
      characterInfo?.characterClass === "ranger" && String(characterInfo?.subclass || "") === "monsterSlayer";

    const rangerLevel = (() => {
      const raw = characterInfo?.classLevels?.ranger;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "ranger")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const magicTable = [
      { rangerLevel: 3, spellLevel: 1, index: "protection-from-evil-and-good" },
      { rangerLevel: 5, spellLevel: 2, index: "zone-of-truth" },
      { rangerLevel: 9, spellLevel: 3, index: "magic-circle" },
      { rangerLevel: 13, spellLevel: 4, index: "banishment" },
      { rangerLevel: 17, spellLevel: 5, index: "hold-monster" },
    ];

    const activeMagic = isMonsterSlayer ? magicTable.filter((row) => rangerLevel >= row.rangerLevel) : [];

    setCharacterInfo((prev) => {
      const current = prev?.spellsPrepared && typeof prev.spellsPrepared === "object" ? prev.spellsPrepared : {};
      const next = { ...current };

      let changed = false;

      // Remove any Monster Slayer bonus spells when subclass/level no longer qualifies.
      const allowedMagic = new Map(activeMagic.map((r) => [String(r.index), r]));

      Object.keys(next).forEach((levelKey) => {
        const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];
        const filtered = list.filter((s) => {
          const tag = String(s?.spelltrackerBonus || "");
          if (tag === MONSTER_SLAYER_MAGIC_BONUS_TAG) return allowedMagic.has(String(s?.index || ""));
          return true;
        });

        if (filtered.length !== list.length) {
          changed = true;
          next[levelKey] = filtered;
        }
      });

      if (isMonsterSlayer) {
        const ensureSpell = (row) => {
          const levelKey = String(row.spellLevel);
          const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];

          const existingIdx = list.findIndex((s) => String(s?.index || "") === row.index);
          if (existingIdx !== -1) {
            const existing = list[existingIdx] || null;
            const needsTag =
              String(existing?.spelltrackerBonus || "") !== MONSTER_SLAYER_MAGIC_BONUS_TAG ||
              existing?.spelltrackerDoesNotCount !== true;
            if (!needsTag) return;

            changed = true;
            const updated = {
              ...existing,
              name: existing?.name || humanizeSpellIndex(row.index),
              spelltrackerBonus: MONSTER_SLAYER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            };
            next[levelKey] = list.map((s, idx) => (idx === existingIdx ? updated : s));
            return;
          }

          changed = true;
          next[levelKey] = [
            ...list,
            {
              index: row.index,
              name: humanizeSpellIndex(row.index),
              spelltrackerBonus: MONSTER_SLAYER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            },
          ];
        };

        activeMagic.forEach((row) => ensureSpell(row));
      }

      if (!changed) return prev;
      return { ...prev, spellsPrepared: next };
    });
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.ranger,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const SWARMKEEPER_MAGIC_BONUS_TAG = "swarmkeeper_magic_bonus_spell";

    const isSwarmkeeper =
      characterInfo?.characterClass === "ranger" &&
      (String(characterInfo?.subclass || "") === "swarmKeeper" || String(characterInfo?.subclass || "") === "swarmkeeper");

    const rangerLevel = (() => {
      const raw = characterInfo?.classLevels?.ranger;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "ranger")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const magicTable = [
      { rangerLevel: 3, spellLevel: 0, index: "mage-hand" },
      { rangerLevel: 3, spellLevel: 1, index: "faerie-fire" },
      { rangerLevel: 5, spellLevel: 2, index: "web" },
      { rangerLevel: 9, spellLevel: 3, index: "gaseous-form" },
      { rangerLevel: 13, spellLevel: 4, index: "arcane-eye" },
      { rangerLevel: 17, spellLevel: 5, index: "insect-plague" },
    ];

    const activeMagic = isSwarmkeeper ? magicTable.filter((row) => rangerLevel >= row.rangerLevel) : [];

    setCharacterInfo((prev) => {
      const current = prev?.spellsPrepared && typeof prev.spellsPrepared === "object" ? prev.spellsPrepared : {};
      const next = { ...current };

      let changed = false;

      // Remove any Swarmkeeper Magic bonus spells when subclass/level no longer qualifies.
      const allowedMagic = new Map(activeMagic.map((r) => [String(r.index), r]));

      Object.keys(next).forEach((levelKey) => {
        const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];
        const filtered = list.filter((s) => {
          const tag = String(s?.spelltrackerBonus || "");
          if (tag === SWARMKEEPER_MAGIC_BONUS_TAG) return allowedMagic.has(String(s?.index || ""));
          return true;
        });

        if (filtered.length !== list.length) {
          changed = true;
          next[levelKey] = filtered;
        }
      });

      if (isSwarmkeeper) {
        const ensureSpell = (row) => {
          const levelKey = String(row.spellLevel);
          const list = Array.isArray(next[levelKey]) ? next[levelKey] : [];

          const existingIdx = list.findIndex((s) => String(s?.index || "") === row.index);
          if (existingIdx !== -1) {
            const existing = list[existingIdx] || null;
            const needsTag =
              String(existing?.spelltrackerBonus || "") !== SWARMKEEPER_MAGIC_BONUS_TAG ||
              existing?.spelltrackerDoesNotCount !== true;
            if (!needsTag) return;

            changed = true;
            const updated = {
              ...existing,
              name: existing?.name || humanizeSpellIndex(row.index),
              spelltrackerBonus: SWARMKEEPER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            };
            next[levelKey] = list.map((s, idx) => (idx === existingIdx ? updated : s));
            return;
          }

          changed = true;
          next[levelKey] = [
            ...list,
            {
              index: row.index,
              name: humanizeSpellIndex(row.index),
              spelltrackerBonus: SWARMKEEPER_MAGIC_BONUS_TAG,
              spelltrackerDoesNotCount: true,
            },
          ];
        };

        activeMagic.forEach((row) => ensureSpell(row));
      }

      if (!changed) return prev;
      return { ...prev, spellsPrepared: next };
    });
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.classLevels?.ranger,
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
    const isPaladin = characterInfo?.characterClass === "paladin";
    if (!isPaladin) {
      setOathSpellsByLevel(emptyByLevel());
      return;
    }

    const subclassKey = String(characterInfo?.subclass || "").trim();
    const subclassMeta = ClassesData?.paladin?.subclasses?.[subclassKey] || null;
    const subclassRowsRaw = Array.isArray(subclassMeta?.subclassSpells) ? subclassMeta.subclassSpells : [];
    if (subclassRowsRaw.length === 0) {
      setOathSpellsByLevel(emptyByLevel());
      return;
    }

    const paladinLevel = (() => {
      const raw = characterInfo?.classLevels?.paladin;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "paladin")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const subclassRows = subclassRowsRaw
      .map((row) => {
        const rowLevel = Math.trunc(Number(row?.level) || 0);
        const spellLevel = PALADIN_OATH_SPELL_LEVEL_BY_PALADIN_LEVEL[rowLevel];
        const spells = Array.isArray(row?.spells)
          ? row.spells.map((s) => String(s || "").trim().replace(/_/g, "-")).filter(Boolean)
          : [];

        return {
          paladinLevel: rowLevel,
          spellLevel,
          spells,
        };
      })
      .filter((row) => Number.isFinite(Number(row?.paladinLevel)) && Number.isFinite(Number(row?.spellLevel)));

    const active = subclassRows.filter((row) => paladinLevel >= Number(row?.paladinLevel || 0));
    if (active.length === 0) {
      setOathSpellsByLevel(emptyByLevel());
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

        if (!cancelled) setOathSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setOathSpellsByLevel(emptyByLevel());
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
    characterInfo?.classLevels?.paladin,
  ]);

  useEffect(() => {
    const isSporesDruid = characterInfo?.characterClass === "druid" && characterInfo?.subclass === "spores";
    if (!isSporesDruid) {
      setSporesCircleSpellsByLevel(emptyByLevel());
      return;
    }

    const druidLevel = (() => {
      const raw = characterInfo?.classLevels?.druid;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "druid")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const active = SPORES_CIRCLE_SPELLS.filter((row) => druidLevel >= Number(row?.druidLevel || 0));
    if (active.length === 0) {
      setSporesCircleSpellsByLevel(emptyByLevel());
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

        if (!cancelled) setSporesCircleSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setSporesCircleSpellsByLevel(emptyByLevel());
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
  ]);

  useEffect(() => {
    const isStarsDruid = characterInfo?.characterClass === "druid" && characterInfo?.subclass === "star";
    if (!isStarsDruid) {
      setStarsCircleSpellsByLevel(emptyByLevel());
      return;
    }

    const druidLevel = (() => {
      const raw = characterInfo?.classLevels?.druid;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "druid")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const active = STARS_CIRCLE_SPELLS.filter((row) => druidLevel >= Number(row?.druidLevel || 0));
    if (active.length === 0) {
      setStarsCircleSpellsByLevel(emptyByLevel());
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

        if (!cancelled) setStarsCircleSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setStarsCircleSpellsByLevel(emptyByLevel());
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
  ]);

  useEffect(() => {
    const isWildfireDruid = characterInfo?.characterClass === "druid" && characterInfo?.subclass === "wildfire";
    if (!isWildfireDruid) {
      setWildfireCircleSpellsByLevel(emptyByLevel());
      return;
    }

    const druidLevel = (() => {
      const raw = characterInfo?.classLevels?.druid;
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
      if (characterInfo?.characterClass === "druid")
        return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
      return 0;
    })();

    const active = WILDFIRE_CIRCLE_SPELLS.filter((row) => druidLevel >= Number(row?.druidLevel || 0));
    if (active.length === 0) {
      setWildfireCircleSpellsByLevel(emptyByLevel());
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

        if (!cancelled) setWildfireCircleSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setWildfireCircleSpellsByLevel(emptyByLevel());
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

  useEffect(() => {
    const isTwilightCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "twilight";
    if (!isTwilightCleric) {
      setTwilightDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = TWILIGHT_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setTwilightDomainSpellsByLevel(emptyByLevel());
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

        if (!cancelled) setTwilightDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setTwilightDomainSpellsByLevel(emptyByLevel());
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [characterInfo?.characterClass, characterInfo?.subclass, characterInfo?.characterLevel]);

  useEffect(() => {
    const isWarCleric = characterInfo?.characterClass === "cleric" && characterInfo?.subclass === "war";
    if (!isWarCleric) {
      setWarDomainSpellsByLevel(emptyByLevel());
      return;
    }

    const clericLevel = Number(characterInfo?.characterLevel || 0);
    const active = WAR_DOMAIN_SPELLS.filter((row) => clericLevel >= row.clericLevel);
    if (active.length === 0) {
      setWarDomainSpellsByLevel(emptyByLevel());
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

        if (!cancelled) setWarDomainSpellsByLevel(byLevel);
      } catch {
        if (!cancelled) setWarDomainSpellsByLevel(emptyByLevel());
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
  }, [spellListClassKey]);

  const loadClassSpellsForLevel = (numericalSpellLevel) => {
    if (spellListLoadStatus[numericalSpellLevel]?.loading) return;

    setSpellListLoadStatus((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: '' },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/${spellListClassKey}`)
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

  const renderBattleMasterManeuvers = () => {
    if (!isBattleMaster) return null;
    if (!showManeuversInSpellTracker) return null;

    const allowed =
      fighterLevel < 3
        ? 0
        : 3 + (fighterLevel >= 7 ? 2 : 0) + (fighterLevel >= 10 ? 2 : 0) + (fighterLevel >= 15 ? 2 : 0);

    const all = ClassesData?.fighter?.subclasses?.battleMaster?.maneuvers || [];
    const maneuvers = Array.isArray(all) ? all : [];
    const byId = new Map(maneuvers.map((m) => [m?.id, m]));

    const selected = selectedBattleMasterManeuvers
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));

    const selectedCount = selectedBattleMasterManeuvers.length;
    const isOver = allowed > 0 && selectedCount > allowed;
    const isUnder = allowed > 0 && selectedCount < allowed;

    return (
      <Box
        sx={{
          borderLeft: `4px solid ${isOver ? "#b71c1c" : "#7c2d12"}`,
          borderRadius: "6px",
          backgroundColor: "rgba(255,255,255,0.45)",
          mb: 1.5,
          px: 1.5,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Typography
            sx={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "15px",
              color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#7c2d12",
            }}
          >
            Maneuvers ({selectedCount}/{allowed})
          </Typography>

          <Tooltip arrow title="Choose maneuvers">
            <IconButton
              size="small"
              aria-label="Choose maneuvers"
              onClick={() => setBattleMasterManeuversModalOpen(true)}
              sx={{
                p: 0.25,
                color: isOver ? "#b71c1c" : isUnder ? "#075985" : "rgba(124, 45, 18, 0.95)",
                border: "1px solid rgba(124, 45, 18, 0.22)",
                backgroundColor: "rgba(124, 45, 18, 0.06)",
                "&:hover": { backgroundColor: "rgba(124, 45, 18, 0.10)" },
              }}
            >
              <SwordIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>

        {selected.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            <em>No maneuvers selected yet.</em>
          </Typography>
        ) : (
          selected.map((maneuver) => (
            <Box key={`maneuver:${maneuver.id}`} sx={{ py: 0.2 }}>
              <ManeuverAccordian maneuver={maneuver} />
            </Box>
          ))
        )}
      </Box>
    );
  };

  const classes = togglePreparedSpellBtnStyle();
  // ***NEED FEATURE--CRITICAL--*** some subrace spells are not in the api, so will need a condition that instead shows a message saying that the description is not available
  //***NEED SPECIAL CONDITION*** for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const renderPCSpells = (textualSpellLevel, numericalSpellLevel) => {
    const classKey = characterInfo?.characterClass;
    const classMeta = ClassesData?.[classKey];
    if (!classMeta) return null;

    if (effectiveIsNonCaster) {
      return null;
    }

    const levelKey = Number(characterInfo?.characterLevel) || 0;
    const tableRow = spellTables?.[spellTableKey]?.[levelKey];
    if (!tableRow) return null;

    const slotCount = Number(tableRow?.[textualSpellLevel]) || 0;
    const isCantrips = textualSpellLevel === "cantrips";
    const preparedAtLevel = Array.isArray(characterInfo?.spellsPrepared?.[numericalSpellLevel])
      ? characterInfo.spellsPrepared[numericalSpellLevel]
      : [];
    const shouldRenderBonusCantripSection = isCantrips && slotCount === 0 && preparedAtLevel.length > 0;
    const shouldRenderFeatureCantripSection =
      isCantrips &&
      slotCount === 0 &&
      (shouldRenderBonusCantripSection ||
        hasDruidicWarrior ||
        hasBlessedWarrior ||
        hasArcanaInitiate ||
        hasAcolyteOfNature ||
        hasReaper ||
        hasCircleOfMortality ||
        hasLightBonusCantrip ||
        hasGuidingWhispers);
    if (slotCount === 0 && !shouldRenderFeatureCantripSection) return null;

    const levelColor = spellLevelColors[numericalSpellLevel] || '#607d8b';

    const cantripFeatureSources = [];
    if (hasDruidicWarrior) cantripFeatureSources.push("Druidic Warrior");
    if (hasBlessedWarrior) cantripFeatureSources.push("Blessed Warrior");
    if (hasDraconicGift) cantripFeatureSources.push("Draconic Gift");
    if (hasSwarmkeeperMagic) cantripFeatureSources.push("Swarmkeeper Magic");
    if (hasArcanaInitiate) cantripFeatureSources.push("Arcana Initiate");
    if (hasGuidingWhispers) cantripFeatureSources.push("Guiding Whispers");
    if (hasCircleOfMortality) cantripFeatureSources.push("Circle of Mortality");
    if (hasLightBonusCantrip) cantripFeatureSources.push("Bonus Cantrip");
    if (hasReaper) cantripFeatureSources.push("Reaper");
    if (hasAcolyteOfNature) cantripFeatureSources.push("Acolyte of Nature");

    const druidicSelectedCount = druidicWarriorCantrips.length;
    const blessedSelectedCount = blessedWarriorCantrips.length;

    const cantripHeading = (() => {
      if (slotCount > 0) {
        if (hasArcaneTrickster) return `Cantrips Known: ${slotCount} (includes Mage Hand)`;
        return `Cantrips Known: ${slotCount}`;
      }
      const hasPreparedCantrips = preparedAtLevel.length > 0;
      const hasExtraPreparedCantrips = (() => {
        if (!hasPreparedCantrips) return false;
        if (cantripFeatureSources.length === 0) return false;
        if (hasDraconicGift && !hasDruidicWarrior && !hasBlessedWarrior) {
          // Draconic Gift adds thaumaturgy into prepared cantrips; don't treat that as a second source.
          return preparedAtLevel.some((s) => s?.index && s.index !== "thaumaturgy");
        }
        return true;
      })();

      const hasMultipleSources = cantripFeatureSources.length > 1 || hasExtraPreparedCantrips;
      if (!hasMultipleSources && cantripFeatureSources.length <= 1) {
        if (hasDruidicWarrior) return `Druidic Warrior Cantrips (${druidicSelectedCount}/2)`;
        if (hasBlessedWarrior) return `Blessed Warrior Cantrips (${blessedSelectedCount}/2)`;
        if (hasDraconicGift) return "Draconic Gift Cantrips";
        if (hasSwarmkeeperMagic) return "Swarmkeeper Magic Cantrips";
      }
      return "Cantrips";
    })();

    const heading = isCantrips ? cantripHeading : `${capitalize(textualSpellLevel)} Level Spell Slots`;

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
              {isCantrips && hasDruidicWarrior ? (
                <Tooltip arrow title="Choose Druidic Warrior cantrips (druid spell list)">
                  <IconButton
                    size="small"
                    aria-label="Choose Druidic Warrior cantrips"
                    onClick={() => setDwPickerModalOpen(true)}
                    sx={{
                      p: 0.25,
                      color: "rgba(93, 64, 55, 0.92)",
                      border: "1px solid rgba(93, 64, 55, 0.22)",
                      backgroundColor: "rgba(93, 64, 55, 0.06)",
                      "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                    }}
                  >
                    <BowIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              ) : null}
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
           {renderBlessedWarriorCantripsInline(numericalSpellLevel)}
           {isCantrips && hasBlessedWarrior ? (
             <Box sx={{ mb: 0.5 }}>
               <Tooltip arrow title="Choose Blessed Warrior cantrips (cleric spell list)">
                 <Button
                   size="small"
                   variant="outlined"
                   onClick={() => setBwPickerModalOpen(true)}
                   sx={{ textTransform: "none", fontSize: "12px" }}
                 >
                   Choose Blessed Warrior cantrips
                 </Button>
               </Tooltip>
             </Box>
           ) : null}
           {renderAcolyteOfNatureCantripForLevel(numericalSpellLevel)}
           {renderReaperCantripForLevel(numericalSpellLevel)}
           {renderDomainSpellsForLevel(numericalSpellLevel)}
           {renderThousandFormsForLevel(numericalSpellLevel)}
            {renderPreparedSpells(numericalSpellLevel)}
            {renderDruidicWarriorCantripsInline(numericalSpellLevel)}
            {!shouldRenderBonusCantripSection ? (
              <Box sx={{ mt: 0.5 }}>
                {renderSpellModal(numericalSpellLevel)}
             </Box>
            ) : null}
        </Box>
      );
  };



  const renderPreparedSpells = (numericalSpellLevel) => {
    const prepared = Array.isArray(characterInfo?.spellsPrepared?.[numericalSpellLevel])
      ? characterInfo.spellsPrepared[numericalSpellLevel]
      : [];

    const LIGHT_BONUS_TAG = "light_domain_bonus_cantrip";
    const DRACONIC_GIFT_BONUS_TAG = "draconic_gift_thaumaturgy";
    const ABERRANT_MIND_PSIONIC_SPELL_BONUS_TAG = "aberrant_mind_psionic_spell";
    const FEY_WANDERER_MAGIC_BONUS_TAG = "fey_wanderer_magic_bonus_spell";
    const FEY_REINFORCEMENTS_BONUS_TAG = "fey_reinforcements_bonus_spell";
    const GLOOM_STALKER_MAGIC_BONUS_TAG = "gloom_stalker_magic_bonus_spell";
    const HORIZON_WALKER_MAGIC_BONUS_TAG = "horizon_walker_magic_bonus_spell";
    const MONSTER_SLAYER_MAGIC_BONUS_TAG = "monster_slayer_magic_bonus_spell";
    const SWARMKEEPER_MAGIC_BONUS_TAG = "swarmkeeper_magic_bonus_spell";

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
                ) : numericalSpellLevel === 0 &&
                  spell?.index === "thaumaturgy" &&
                  spell?.spelltrackerBonus === DRACONIC_GIFT_BONUS_TAG ? (
                   <Tooltip
                     arrow
                     title="Draconic Gift cantrip (counts as a ranger spell)."
                  >
                    <Chip
                      size="small"
                      label="DG"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(106, 27, 154, 0.85)",
                        border: "1px solid rgba(106, 27, 154, 0.22)",
                       "&:hover": { opacity: 0.85 },
                     }}
                   />
                 </Tooltip>
                ) : spell?.spelltrackerBonus === ABERRANT_MIND_PSIONIC_SPELL_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Psionic Spell (always known; does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="PS"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(74, 20, 140, 0.86)",
                        border: "1px solid rgba(74, 20, 140, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : spell?.spelltrackerBonus === FEY_WANDERER_MAGIC_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Fey Wanderer Magic spell (does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="FW"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(0, 105, 92, 0.90)",
                        border: "1px solid rgba(0, 105, 92, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : spell?.spelltrackerBonus === FEY_REINFORCEMENTS_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Fey Reinforcements spell (does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="FR"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(123, 31, 162, 0.85)",
                        border: "1px solid rgba(123, 31, 162, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : spell?.spelltrackerBonus === GLOOM_STALKER_MAGIC_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Gloom Stalker Magic spell (does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="GS"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(40, 53, 147, 0.92)",
                        border: "1px solid rgba(40, 53, 147, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : spell?.spelltrackerBonus === HORIZON_WALKER_MAGIC_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Horizon Walker Magic spell (does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="HW"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(106, 27, 154, 0.85)",
                        border: "1px solid rgba(106, 27, 154, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : spell?.spelltrackerBonus === MONSTER_SLAYER_MAGIC_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Monster Slayer Magic spell (does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="MS"
                      sx={{
                        height: 18,
                        fontSize: "11px",
                        fontWeight: 800,
                        opacity: 0.7,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        color: "rgba(198, 40, 40, 0.88)",
                        border: "1px solid rgba(198, 40, 40, 0.22)",
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  </Tooltip>
                ) : spell?.spelltrackerBonus === SWARMKEEPER_MAGIC_BONUS_TAG ? (
                  <Tooltip
                    arrow
                    title="Swarmkeeper Magic spell (does not count against spells known)."
                  >
                    <Chip
                      size="small"
                      label="SK"
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
                ) : null
              }
              actionButton={
                spell?.spelltrackerBonus === ABERRANT_MIND_PSIONIC_SPELL_BONUS_TAG ? (
                  <Tooltip arrow title="Swap this psionic spell (does not change spells known).">
                    <IconButton
                      size="small"
                      aria-label="Swap psionic spell"
                      onClick={() => {
                        const origin = String(spell?.spelltrackerOrigin || spell?.index || "").trim();
                        setPsionicSwapModal({
                          open: true,
                          spellLevel: Number(numericalSpellLevel),
                          psionicKey: "sorcerer:aberrantMind",
                          originalSpell: origin
                            ? { index: origin, name: humanizeSpellIndex(origin) }
                            : spell,
                        });
                      }}
                      sx={{
                        p: 0.25,
                        color: "rgba(74, 20, 140, 0.92)",
                        border: "1px solid rgba(74, 20, 140, 0.22)",
                        backgroundColor: "rgba(74, 20, 140, 0.06)",
                        "&:hover": { backgroundColor: "rgba(74, 20, 140, 0.10)" },
                      }}
                    >
                      <SwapHorizIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <PrepareSpellButton
                    numericalSpellLevel={numericalSpellLevel}
                    spell={spell}
                    index={index}
                  />
                )
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

  /*
  Deprecated: cantrips now render in a single unified cantrip section.
  const renderDruidicWarriorCantripsForLevel = (numericalSpellLevel) => {
    if (!hasDruidicWarrior) return null;
    if (Number(numericalSpellLevel) !== 0) return null;

    const isOver = druidicWarriorCantrips.length > 2;
    const selectedCount = druidicWarriorCantrips.length;

    return (
      <Box
        sx={{
          borderLeft: `4px solid ${isOver ? "#b71c1c" : "#5d4037"}`,
          borderRadius: "6px",
          backgroundColor: "rgba(255,255,255,0.45)",
          mb: 1,
          px: 1.5,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: "15px",
                color: isOver ? "#b71c1c" : "#5d4037",
              }}
            >
              Druidic Warrior Cantrips ({selectedCount}/2)
            </Typography>
            <Tooltip arrow title="Choose Druidic Warrior cantrips (druid spell list)">
              <IconButton
                size="small"
                aria-label="Choose Druidic Warrior cantrips"
                onClick={() => setDwPickerModalOpen(true)}
                sx={{
                  p: 0.25,
                  color: isOver ? "#b71c1c" : "rgba(93, 64, 55, 0.92)",
                  border: "1px solid rgba(93, 64, 55, 0.22)",
                  backgroundColor: "rgba(93, 64, 55, 0.06)",
                  "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                }}
              >
                <BowIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {druidicWarriorCantrips.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No Druidic Warrior cantrips chosen yet.
          </Typography>
        ) : null}

        {druidicWarriorCantrips.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title={
                    isOver
                      ? "Druidic Warrior cantrip (over limit — only 2 allowed)."
                      : "Druidic Warrior cantrip (counts as a ranger spell)."
                  }
                >
                  <Chip
                    size="small"
                    label="DW"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: isOver ? 0.9 : 0.65,
                      backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(93, 64, 55, 0.90)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(93, 64, 55, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip arrow title="Swap cantrip (Druidic Warrior)">
                    <IconButton
                      size="small"
                      aria-label="Swap Druidic Warrior cantrip"
                      onClick={() => setDwSwapModal({ open: true, originalSpell: spell })}
                      sx={{
                        p: 0.25,
                        color: isOver ? "#b71c1c" : "rgba(93, 64, 55, 0.90)",
                        border: "1px solid rgba(93, 64, 55, 0.22)",
                        backgroundColor: "rgba(93, 64, 55, 0.06)",
                        "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                      }}
                    >
                      <SwapHorizIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <PrepareDruidicWarriorCantripButton spell={spell} index={idx} />
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
    );
  };
  */

  const renderDruidicWarriorCantripsInline = (numericalSpellLevel) => {
    if (!hasDruidicWarrior) return null;
    if (Number(numericalSpellLevel) !== 0) return null;

    const isOver = druidicWarriorCantrips.length > 2;

    return (
      <Box sx={{ mb: 0.5 }}>
        {druidicWarriorCantrips.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            <em>No Druidic Warrior cantrips chosen yet.</em>
          </Typography>
        ) : null}

        {druidicWarriorCantrips.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title={
                    isOver
                      ? "Druidic Warrior cantrip (over limit â€” only 2 allowed)."
                      : "Druidic Warrior cantrip (counts as a ranger spell)."
                  }
                >
                  <Chip
                    size="small"
                    label="DW"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: isOver ? 0.9 : 0.65,
                      backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(93, 64, 55, 0.90)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(93, 64, 55, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip arrow title="Swap cantrip (Druidic Warrior)">
                    <IconButton
                      size="small"
                      aria-label="Swap Druidic Warrior cantrip"
                      onClick={() => setDwSwapModal({ open: true, originalSpell: spell })}
                      sx={{
                        p: 0.25,
                        color: isOver ? "#b71c1c" : "rgba(93, 64, 55, 0.90)",
                        border: "1px solid rgba(93, 64, 55, 0.22)",
                        backgroundColor: "rgba(93, 64, 55, 0.06)",
                        "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                      }}
                    >
                      <SwapHorizIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <PrepareDruidicWarriorCantripButton spell={spell} index={idx} />
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
    );
  };

  /*
  Deprecated: cantrips now render in a single unified cantrip section.
  const renderBlessedWarriorCantripsForLevel = (numericalSpellLevel) => {
    if (!hasBlessedWarrior) return null;
    if (Number(numericalSpellLevel) !== 0) return null;

    const isOver = blessedWarriorCantrips.length > 2;
    const selectedCount = blessedWarriorCantrips.length;

    return (
      <Box
        sx={{
          borderLeft: `4px solid ${isOver ? "#b71c1c" : "#5d4037"}`,
          borderRadius: "6px",
          backgroundColor: "rgba(255,255,255,0.45)",
          mb: 1,
          px: 1.5,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: "15px",
                color: isOver ? "#b71c1c" : "#5d4037",
              }}
            >
              Blessed Warrior Cantrips ({selectedCount}/2)
            </Typography>
            <Tooltip arrow title="Choose Blessed Warrior cantrips (cleric spell list)">
              <IconButton
                size="small"
                aria-label="Choose Blessed Warrior cantrips"
                onClick={() => setBwPickerModalOpen(true)}
                sx={{
                  p: 0.25,
                  color: isOver ? "#b71c1c" : "rgba(93, 64, 55, 0.92)",
                  border: "1px solid rgba(93, 64, 55, 0.22)",
                  backgroundColor: "rgba(93, 64, 55, 0.06)",
                  "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                }}
              >
                <ThorHammerIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {blessedWarriorCantrips.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No Blessed Warrior cantrips chosen yet.
          </Typography>
        ) : null}

        {blessedWarriorCantrips.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title={
                    isOver
                      ? "Blessed Warrior cantrip (over limit — only 2 allowed)."
                      : "Blessed Warrior cantrip (counts as a paladin spell)."
                  }
                >
                  <Chip
                    size="small"
                    label="BW"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: isOver ? 0.9 : 0.65,
                      backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(93, 64, 55, 0.90)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(93, 64, 55, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip arrow title="Swap cantrip (Blessed Warrior)">
                    <IconButton
                      size="small"
                      aria-label="Swap Blessed Warrior cantrip"
                      onClick={() => setBwSwapModal({ open: true, originalSpell: spell })}
                      sx={{
                        p: 0.25,
                        color: isOver ? "#b71c1c" : "rgba(93, 64, 55, 0.90)",
                        border: "1px solid rgba(93, 64, 55, 0.22)",
                        backgroundColor: "rgba(93, 64, 55, 0.06)",
                        "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                      }}
                    >
                      <SwapHorizIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <PrepareBlessedWarriorCantripButton spell={spell} index={idx} />
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
    );
  };
  */

  const renderBlessedWarriorCantripsInline = (numericalSpellLevel) => {
    if (!hasBlessedWarrior) return null;
    if (Number(numericalSpellLevel) !== 0) return null;

    const isOver = blessedWarriorCantrips.length > 2;

    return (
      <Box sx={{ mb: 0.5 }}>
        {blessedWarriorCantrips.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            <em>No Blessed Warrior cantrips chosen yet.</em>
          </Typography>
        ) : null}

        {blessedWarriorCantrips.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title={
                    isOver
                      ? "Blessed Warrior cantrip (over limit â€” only 2 allowed)."
                      : "Blessed Warrior cantrip (counts as a paladin spell)."
                  }
                >
                  <Chip
                    size="small"
                    label="BW"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: isOver ? 0.9 : 0.65,
                      backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(93, 64, 55, 0.90)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(93, 64, 55, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip arrow title="Swap cantrip (Blessed Warrior)">
                    <IconButton
                      size="small"
                      aria-label="Swap Blessed Warrior cantrip"
                      onClick={() => setBwSwapModal({ open: true, originalSpell: spell })}
                      sx={{
                        p: 0.25,
                        color: isOver ? "#b71c1c" : "rgba(93, 64, 55, 0.90)",
                        border: "1px solid rgba(93, 64, 55, 0.22)",
                        backgroundColor: "rgba(93, 64, 55, 0.06)",
                        "&:hover": { backgroundColor: "rgba(93, 64, 55, 0.10)" },
                      }}
                    >
                      <SwapHorizIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <PrepareBlessedWarriorCantripButton spell={spell} index={idx} />
                </Box>
              }
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

  const renderThousandFormsForLevel = (numericalSpellLevel) => {
    if (!hasThousandForms) return null;
    if (Number(numericalSpellLevel) !== 2) return null;

    const alterSelf = {
      index: "alter-self",
      name: "Alter Self",
      spelltrackerAlwaysPreparedKind: "thousand_forms",
    };

    return (
      <Box sx={{ mb: 0.5 }}>
        <Box sx={{ py: 0.2 }}>
          <SpellAccordian
            numericalSpellLevel={numericalSpellLevel}
            spell={alterSelf}
            leadingControl={
              <Tooltip arrow title={THOUSAND_FORMS_TOOLTIP}>
                <Chip
                  size="small"
                  label="TF"
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

    const twilightAtLevel = Array.isArray(twilightDomainSpellsByLevel?.[numericalSpellLevel])
      ? twilightDomainSpellsByLevel[numericalSpellLevel]
      : [];

    const oathAtLevelRaw = Array.isArray(oathSpellsByLevel?.[numericalSpellLevel])
      ? oathSpellsByLevel[numericalSpellLevel]
      : [];

    const oathAtLevel = oathAtLevelRaw.map((s) => ({
      ...(s || {}),
      spelltrackerAlwaysPreparedKind: "oath_spell",
    }));

    const landCircleAtLevelRaw = Array.isArray(landCircleSpellsByLevel?.[numericalSpellLevel])
      ? landCircleSpellsByLevel[numericalSpellLevel]
      : [];

    const landCircleAtLevel = landCircleAtLevelRaw.map((s) => ({
      ...(s || {}),
      spelltrackerAlwaysPreparedKind: "circle_spell",
    }));

    const sporesCircleAtLevelRaw = Array.isArray(sporesCircleSpellsByLevel?.[numericalSpellLevel])
      ? sporesCircleSpellsByLevel[numericalSpellLevel]
      : [];

    const sporesCircleAtLevel = sporesCircleAtLevelRaw.map((s) => ({
      ...(s || {}),
      spelltrackerAlwaysPreparedKind: "circle_spell",
    }));

    const starsCircleAtLevelRaw = Array.isArray(starsCircleSpellsByLevel?.[numericalSpellLevel])
      ? starsCircleSpellsByLevel[numericalSpellLevel]
      : [];

    const starsCircleAtLevel = starsCircleAtLevelRaw.map((s) => ({
      ...(s || {}),
      spelltrackerAlwaysPreparedKind: "circle_spell",
    }));

    const wildfireCircleAtLevelRaw = Array.isArray(wildfireCircleSpellsByLevel?.[numericalSpellLevel])
      ? wildfireCircleSpellsByLevel[numericalSpellLevel]
      : [];

    const wildfireCircleAtLevel = wildfireCircleAtLevelRaw.map((s) => ({
      ...(s || {}),
      spelltrackerAlwaysPreparedKind: "circle_spell",
    }));

    const warAtLevel = Array.isArray(warDomainSpellsByLevel?.[numericalSpellLevel])
      ? warDomainSpellsByLevel[numericalSpellLevel]
      : [];

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
      ...twilightAtLevel,
      ...warAtLevel,
      ...oathAtLevel,
      ...landCircleAtLevel,
      ...sporesCircleAtLevel,
      ...starsCircleAtLevel,
      ...wildfireCircleAtLevel,
    ];
    const swapsForCurrentDomain = domainSpellSwaps?.[currentDomainKey] || {};
    const domainSlotsAtLevel = domainAtLevel.map((original) => {
      const kind = String(original?.spelltrackerAlwaysPreparedKind || "");
      if (kind === "oath_spell") {
        return { original, spell: original };
      }
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
          const isOathSpell = kind === "oath_spell";
          const chipLabel = isOathSpell ? "OS" : isCircleSpell ? "CS" : "DS";
          const chipTooltip = isOathSpell
            ? "Oath Spell (always prepared; does not count toward prepared spells)."
            : isCircleSpell
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
              actionButton={!isOathSpell ? (
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
              ) : null}
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

  if (hideFighterSpellSection) return null;
  if (isMonk) return <MonkKiUsesPanel />;

  return (
      <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        {effectiveIsNonCaster && isFighter ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#3e2723",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Maneuvers
            </Typography>
            {isBattleMaster ? (
              <Tooltip arrow title="Choose maneuvers">
                <IconButton
                  size="small"
                  aria-label="Choose maneuvers"
                  onClick={() => setBattleMasterManeuversModalOpen(true)}
                  sx={{
                    p: 0.25,
                    color: "rgba(124, 45, 18, 0.95)",
                    border: "1px solid rgba(124, 45, 18, 0.22)",
                    backgroundColor: "rgba(124, 45, 18, 0.06)",
                    "&:hover": { backgroundColor: "rgba(124, 45, 18, 0.10)" },
                  }}
                >
                  <SwordIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>
        ) : (
          <PreparedSpellsStatus label={showSoulknifePsionicUses ? "Psionic Energy Die Uses" : "Spell Tracker"} />
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {!effectiveIsNonCaster ? (
            <Button
              className={classes.prepareButton}
              variant="contained"
              size="small"
              onClick={unprepareAllSpells}
              sx={{ textTransform: 'none', fontSize: '11px' }}
            >
              Unprepare All
            </Button>
          ) : null}
        </Box>
      </Box>
      {showSoulknifePsionicUses ? (
        <SoulknifePsionicEnergyDieUsesPanel />
      ) : (
        <>
          {renderBattleMasterManeuvers()}
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
        </>
      )}
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

        <PsionicSpellSwapModal
          open={psionicSwapModal.open}
          numericalSpellLevel={psionicSwapModal.spellLevel}
          psionicKey={psionicSwapModal.psionicKey || "sorcerer:aberrantMind"}
          originalSpell={psionicSwapModal.originalSpell}
          onClose={() => setPsionicSwapModal((s) => ({ ...s, open: false, originalSpell: null }))}
        />

        <BlessedWarriorCantripSwapModal
          open={bwSwapModal.open}
          originalSpell={bwSwapModal.originalSpell}
          onClose={() => setBwSwapModal({ open: false, originalSpell: null })}
        />

        <BlessedWarriorCantripsModal
          open={bwPickerModalOpen}
          onClose={() => setBwPickerModalOpen(false)}
        />

        <DruidicWarriorCantripSwapModal
          open={dwSwapModal.open}
          originalSpell={dwSwapModal.originalSpell}
          onClose={() => setDwSwapModal({ open: false, originalSpell: null })}
        />

        <DruidicWarriorCantripsModal
          open={dwPickerModalOpen}
          onClose={() => setDwPickerModalOpen(false)}
        />

        <BattleMasterManeuversModal
          open={battleMasterManeuversModalOpen}
          onClose={() => setBattleMasterManeuversModalOpen(false)}
        />
    </Box>
  );
};

export default SpellList;
