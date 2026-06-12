import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterInfoContext } from "../Contexts/Context";
import ClassesData from "./ClassesData";
import { Races, Subraces, getDragonbornAncestryOptions, HalfElfVersatilityArr } from "./RacesData"
import { WeaponManager } from "./mainUI/WeaponManager"
import { proficiencyBonus } from "../components/mainUI/header";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import AuthControls from "./AuthControls";
import CharacterSwitcherMenu from "./CharacterSwitcherMenu";
import BlessedWarriorCantripsModal from "./mainUI/BlessedWarriorCantripsModal";
import DruidicWarriorCantripsModal from "./mainUI/DruidicWarriorCantripsModal";
import { GENIE_KIND_OPTIONS } from "../utils/genieData";
import spellTables from "./spellTables";

export const CharacterCreationForm = (props) => {
  const NO_RACE = "noRace";
  const NO_SUBRACE = "noSubrace";
  const NO_CLASS = "noClass";
  const NO_SUBCLASS = "noSubclass";

  const characterClasses = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard"];

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  //I get errors if characterClass starts out as an empty string due to the object.keys functions I'm using. This solution works, but idk if it's ideal to have a starting class in state and connecting subclass in data set.
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  // const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  const navigate = useNavigate();
  const [continueAttempted, setContinueAttempted] = React.useState(false);
  const [animateMissing, setAnimateMissing] = React.useState(false);
  const [blessedWarriorModalOpen, setBlessedWarriorModalOpen] = React.useState(false);
  const [druidicWarriorModalOpen, setDruidicWarriorModalOpen] = React.useState(false);
  const [markOfWardingWarningOpen, setMarkOfWardingWarningOpen] = React.useState(false);
  const [pendingNonCasterClass, setPendingNonCasterClass] = React.useState("");
  const [animateMarkOfWardingClassWarning, setAnimateMarkOfWardingClassWarning] = React.useState(false);

  const isMissingRace = !characterInfo.race || characterInfo.race === NO_RACE;
  const isMissingSubrace = !characterInfo.subrace || characterInfo.subrace === NO_SUBRACE;
  const isMissingClass = !characterInfo.characterClass || characterInfo.characterClass === NO_CLASS;
  const isMissingSubclass = !characterInfo.subclass || characterInfo.subclass === NO_SUBCLASS;

  const missingFieldSx = (shouldHighlight) => {
    if (!shouldHighlight) return null;
    return {
      "@keyframes missingFieldShake": {
        "0%": { transform: "translateX(0px)" },
        "20%": { transform: "translateX(-4px)" },
        "40%": { transform: "translateX(4px)" },
        "60%": { transform: "translateX(-3px)" },
        "80%": { transform: "translateX(3px)" },
        "100%": { transform: "translateX(0px)" },
      },
      ...(animateMissing ? { animation: "missingFieldShake 420ms ease-in-out 0s 1" } : null),
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#b71c1c" },
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#b71c1c" },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#b71c1c" },
      "& .MuiInputLabel-root": { color: "#b71c1c" },
    };
  };

  const spellLevels = React.useMemo(
    () => ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"],
    []
  );

  const hasRaceSpellListWarning = React.useCallback(
    (raceName, subraceName) =>
      (raceName === "Dwarf" && subraceName === "Mark of Warding") ||
      (raceName === "Elf" && subraceName === "Mark of Shadow"),
    []
  );

  const markOfWardingClassWarningSx = animateMarkOfWardingClassWarning
    ? {
        "@keyframes markOfWardingClassShake": {
          "0%": { transform: "translateX(0px)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
          "100%": { transform: "translateX(0px)" },
        },
        animation: "markOfWardingClassShake 420ms ease-in-out 0s 1",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d97706" },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d97706" },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#d97706" },
        "& .MuiInputLabel-root": { color: "#d97706" },
      }
    : null;

  const hasSpellcastingSlots = React.useCallback(
    (tableRow) =>
      spellLevels.some((levelKey) => Number(tableRow?.[levelKey] || 0) > 0) || Number(tableRow?.spellSlots || 0) > 0,
    [spellLevels]
  );

  const isActiveSpellcasterSelection = React.useCallback(
    ({ classKey, subclassKey }) => {
      const normalizedClassKey = classKey === "sorceror" ? "sorcerer" : classKey;
      const meta = ClassesData?.[normalizedClassKey] || ClassesData?.[classKey] || null;
      if (!meta) return false;

      const level = Math.max(1, Math.trunc(Number(characterInfo?.characterLevel) || 1));
      const subclassMeta = meta?.subclasses?.[subclassKey] || null;
      const subclassSpellcasting = subclassMeta?.spellcasting || null;

      if (subclassSpellcasting && level >= Number(subclassSpellcasting?.startsAtLevel || 1)) {
        const subclassTable = spellTables?.[String(subclassSpellcasting?.spellTableKey || "")]?.[level] || null;
        return hasSpellcastingSlots(subclassTable);
      }

      if (meta?.isSpellCaster === "nonCaster" || meta?.spellcastingAbility === "nonCaster") {
        return false;
      }

      const baseTable = spellTables?.[normalizedClassKey]?.[level] || null;
      return hasSpellcastingSlots(baseTable);
    },
    [characterInfo?.characterLevel, hasSpellcastingSlots]
  );

  useEffect(() => {
    setCharacterInfo((prev) => ({
      ...prev,
      proficiencyMod: proficiencyBonus[prev.characterLevel] || 2, // Fallback to 2 for safety
    }));
  }, [characterInfo.characterLevel, setCharacterInfo]);

  const dragonbornAncestryOptions = React.useMemo(() => {
    return getDragonbornAncestryOptions(characterInfo.subrace);
  }, [characterInfo.subrace]);

  const halfElfVersatilityOptions = React.useMemo(() => {
    return Object.keys(HalfElfVersatilityArr || {});
  }, []);

  const landDruidTypeOptions = React.useMemo(
    () => ["arctic", "coast", "desert", "forest", "grassland", "mountain", "swamp", "underdark"],
    []
  );

  const genieKindOptions = React.useMemo(() => GENIE_KIND_OPTIONS, []);

  const fighterFightingStyleOptions = React.useMemo(() => {
    const raw = ClassesData?.fighter?.fightingStyleOptions || [];
    return Array.isArray(raw) ? raw : [];
  }, []);

  const paladinFightingStyleOptions = React.useMemo(() => {
    const raw = ClassesData?.paladin?.fightingStyleOptions || [];
    return Array.isArray(raw) ? raw : [];
  }, []);

  const rangerFightingStyleOptions = React.useMemo(() => {
    const raw = ClassesData?.ranger?.fightingStyleOptions || [];
    return Array.isArray(raw) ? raw : [];
  }, []);

  useEffect(() => {
    if (characterInfo.race === "Dragonborn") {
      if (!dragonbornAncestryOptions.includes(characterInfo.draconicAncestry) && dragonbornAncestryOptions.length > 0) {
        setCharacterInfo((prev) => ({ ...prev, draconicAncestry: dragonbornAncestryOptions[0] }));
      }
    } else if (characterInfo.draconicAncestry) {
      setCharacterInfo((prev) => ({ ...prev, draconicAncestry: "" }));
    }
  }, [characterInfo.race, characterInfo.draconicAncestry, dragonbornAncestryOptions, setCharacterInfo]);

  useEffect(() => {
    if (characterInfo.race === "Half Elf" && characterInfo.subrace === "Standard Half Elf") {
      if (!characterInfo.halfElfVersatility && halfElfVersatilityOptions.length > 0) {
        setCharacterInfo((prev) => ({ ...prev, halfElfVersatility: halfElfVersatilityOptions[0] }));
      }
    } else if (characterInfo.halfElfVersatility) {
      setCharacterInfo((prev) => ({ ...prev, halfElfVersatility: "" }));
    }
  }, [
    characterInfo.race,
    characterInfo.subrace,
    characterInfo.halfElfVersatility,
    halfElfVersatilityOptions,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const isLandDruid = characterInfo.characterClass === "druid" && characterInfo.subclass === "land";
    if (isLandDruid) {
      if (!characterInfo.druidLandType && landDruidTypeOptions.length > 0) {
        setCharacterInfo((prev) => ({ ...prev, druidLandType: landDruidTypeOptions[0] }));
      }
      return;
    }

    if (characterInfo.druidLandType) {
      setCharacterInfo((prev) => ({ ...prev, druidLandType: "" }));
    }
  }, [characterInfo.characterClass, characterInfo.subclass, characterInfo.druidLandType, landDruidTypeOptions, setCharacterInfo]);

  useEffect(() => {
    const isGenieWarlock =
      characterInfo.characterClass === "warlock" && String(characterInfo.subclass || "") === "genie";

    if (isGenieWarlock) {
      if (!characterInfo.genieKind && genieKindOptions.length > 0) {
        setCharacterInfo((prev) => ({ ...prev, genieKind: genieKindOptions[0].id }));
      }
      return;
    }

    if (characterInfo.genieKind) {
      setCharacterInfo((prev) => ({ ...prev, genieKind: "" }));
    }
  }, [
    characterInfo.characterClass,
    characterInfo.subclass,
    characterInfo.genieKind,
    genieKindOptions,
    setCharacterInfo,
  ]);

  useEffect(() => {
    if (characterInfo.characterClass === "fighter") {
      if (!characterInfo.fightingStyle && fighterFightingStyleOptions.length > 0) {
        setCharacterInfo((prev) => ({ ...prev, fightingStyle: fighterFightingStyleOptions[0] }));
      }
      return;
    }

    if (characterInfo.characterClass === "paladin") {
      if (!characterInfo.fightingStyle && paladinFightingStyleOptions.length > 0) {
        const preferred = paladinFightingStyleOptions.includes("Defense")
          ? "Defense"
          : paladinFightingStyleOptions[0];
        setCharacterInfo((prev) => ({ ...prev, fightingStyle: preferred }));
      }
      return;
    }

    if (characterInfo.characterClass === "ranger") {
      if (!characterInfo.fightingStyle && rangerFightingStyleOptions.length > 0) {
        const preferred = rangerFightingStyleOptions.includes("Archery")
          ? "Archery"
          : rangerFightingStyleOptions[0];
        setCharacterInfo((prev) => ({ ...prev, fightingStyle: preferred }));
      }
      return;
    }

    if (characterInfo.fightingStyle || characterInfo.additionalFightingStyle) {
      setCharacterInfo((prev) => ({ ...prev, fightingStyle: "", additionalFightingStyle: "" }));
    }
  }, [
    characterInfo.characterClass,
    characterInfo.fightingStyle,
    characterInfo.additionalFightingStyle,
    fighterFightingStyleOptions,
    paladinFightingStyleOptions,
    rangerFightingStyleOptions,
    setCharacterInfo,
  ]);

  useEffect(() => {
    const allowedSubraces = Subraces?.[characterInfo.race] || [];
    if (characterInfo.race === NO_RACE) {
      if (characterInfo.subrace !== NO_SUBRACE) {
        setCharacterInfo((prev) => ({ ...prev, subrace: NO_SUBRACE }));
      }
      return;
    }

    if (allowedSubraces.length === 0) return;
    if (!allowedSubraces.includes(characterInfo.subrace)) {
      setCharacterInfo((prev) => ({ ...prev, subrace: NO_SUBRACE }));
    }
  }, [characterInfo.race, characterInfo.subrace, setCharacterInfo]);

  useEffect(() => {
    if (characterInfo.characterClass === NO_CLASS) {
      if (characterInfo.subclass !== NO_SUBCLASS) {
        setCharacterInfo((prev) => ({ ...prev, subclass: NO_SUBCLASS }));
      }
      return;
    }

    const subclasses = ClassesData?.[characterInfo.characterClass]?.subclasses || {};
    const allowedSubclassKeys = Object.keys(subclasses);
    if (allowedSubclassKeys.length === 0) return;
    if (!allowedSubclassKeys.includes(characterInfo.subclass)) {
      setCharacterInfo((prev) => ({ ...prev, subclass: NO_SUBCLASS }));
    }
  }, [characterInfo.characterClass, characterInfo.subclass, setCharacterInfo]);

  //due to issues with the .keys method, "noClass" is the default class (found in ClassesData.js)

  //easier to use logic/for loop, or to create this datastructure?
  const characterLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const applyFieldChange = React.useCallback((name, value) => {
    setCharacterInfo((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "race") {
        next.subrace = NO_SUBRACE;
        next.draconicAncestry = "";
        next.halfElfVersatility = "";
      }

      if (name === "subrace" && prev.race === "Dragonborn") {
        next.draconicAncestry = "";
      }

	      if (name === "characterClass") {
	        next.subclass = NO_SUBCLASS;
          next.fightingStyle = "";
          next.additionalFightingStyle = "";
          next.genieKind = "";
	      }

	      if (name === "subclass") {
	        // Subclass-specific options reset when swapping subclasses.
	        next.druidLandType = "";
          next.additionalFightingStyle = "";
          next.divineSoulAffinity = "";
          next.lunarEmbodimentPhase = "";
          next.genieKind = "";
	      }

        if (name === "fightingStyle" && value && value === prev.additionalFightingStyle) {
          next.additionalFightingStyle = "";
        }

      return next;
    });
  }, [setCharacterInfo]);

	  const handleChange = (event) => {
	    const { name, value } = event.target;

    if (
      name === "characterClass" &&
      hasRaceSpellListWarning(characterInfo?.race, characterInfo?.subrace) &&
      value !== NO_CLASS &&
      !isActiveSpellcasterSelection({ classKey: value, subclassKey: NO_SUBCLASS })
    ) {
      setPendingNonCasterClass(String(value || ""));
      setMarkOfWardingWarningOpen(true);
      setAnimateMarkOfWardingClassWarning(true);
      window.setTimeout(() => setAnimateMarkOfWardingClassWarning(false), 500);
      return;
    }

    applyFieldChange(name, value);

    if (
      name === "fightingStyle" &&
      String(value || "") === "Blessed Warrior" &&
      String(characterInfo?.characterClass || "") === "paladin"
    ) {
      setBlessedWarriorModalOpen(true);
    }

    if (
      name === "fightingStyle" &&
      String(value || "") === "Druidic Warrior" &&
      String(characterInfo?.characterClass || "") === "ranger"
    ) {
      setDruidicWarriorModalOpen(true);
    }
	  };

  const handleContinue = () => {
    const missingAny = isMissingRace || isMissingSubrace || isMissingClass || isMissingSubclass;
    if (!missingAny) {
      navigate("/mainUI");
      return;
    }

    setContinueAttempted(true);
    setAnimateMissing(true);
    window.setTimeout(() => setAnimateMissing(false), 500);
  };

  const handleStatChange = (statName, newValue) => {
    setCharacterInfo((prev) => {
      const newStats = {
        ...prev.stats,
        [statName]: {
          ...prev.stats[statName],
          value: newValue, // Update only the value of the stat
          mod: Math.floor((newValue - 10) / 2), // Recalculate the mod based on the new value
        },
      };
      return {
        ...prev,
        stats: newStats,
      };
    });
  };



  const sectionStyle = {
    mb: 2.5,
  };

  const sectionLabelStyle = {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: "16px",
    color: "#3e2723",
    mb: 1,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>

      <Box
        sx={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CharacterSwitcherMenu />
        <AuthControls />
      </Box>

      {/* Character Name */}
      <Box sx={{ ...sectionStyle, maxWidth: "180px", width: "100%" }}>
        <TextField
          id="character-name"
          label="Character Name"
          value={characterInfo.characterName}
          variant="outlined"
          name="characterName"
          onChange={handleChange}
          fullWidth
          size="small"
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(139,69,19,0.3)", mb: 2, width: "100%" }} />

      {/* Race & Class Row */}
      <Typography sx={sectionLabelStyle}>Race & Class</Typography>
      <Box sx={{ ...sectionStyle, maxWidth: "340px", width: "100%" }}>
        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small" error={continueAttempted && isMissingRace} sx={missingFieldSx(continueAttempted && isMissingRace)}>
              <InputLabel id="race-select-label">Race</InputLabel>
              <Select labelId="race-select-label" id="race-select" value={characterInfo.race} label="Race" name="race" onChange={handleChange}>
                <MenuItem value={NO_RACE} disabled>
                  Select a race
                </MenuItem>
                {Races.map((race) => (
                  <MenuItem key={race} value={race}>{race}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              size="small"
              disabled={characterInfo.race === NO_RACE}
              error={continueAttempted && isMissingSubrace}
              sx={missingFieldSx(continueAttempted && isMissingSubrace)}
            >
              <InputLabel id="subrace-select-label">Subrace</InputLabel>
              <Select
                labelId="subrace-select-label"
                id="subrace-select"
                value={characterInfo.subrace}
                label="Subrace"
                name="subrace"
                onChange={handleChange}
              >
                <MenuItem value={NO_SUBRACE} disabled>
                  Select a subrace
                </MenuItem>
                {(Subraces?.[characterInfo.race] || []).map((subrace) => (
                  <MenuItem key={subrace} value={subrace}>
                    {subrace}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              size="small"
              error={continueAttempted && isMissingClass}
              sx={[missingFieldSx(continueAttempted && isMissingClass), markOfWardingClassWarningSx]}
            >
              <InputLabel id="class-select-label">Class</InputLabel>
              <Select
                labelId="class-select-label"
                id="class-select"
                value={characterInfo.characterClass}
                label="Class"
                name="characterClass"
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => (selected === NO_CLASS ? "Select a class" : capitalize(selected))}
              >
                <MenuItem value={NO_CLASS} disabled>
                  Select a class
                </MenuItem>
                {characterClasses.map((charClass) => (
                  <MenuItem key={charClass} value={charClass}>{capitalize(charClass)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              size="small"
              disabled={characterInfo.characterClass === NO_CLASS}
              error={continueAttempted && isMissingSubclass}
              sx={missingFieldSx(continueAttempted && isMissingSubclass)}
            >
              <InputLabel id="subclass-select-label">Subclass</InputLabel>
              <Select
                labelId="subclass-select-label"
                id="subclass-select"
                value={characterInfo.subclass}
                label="Subclass"
                name="subclass"
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => {
                  if (selected === NO_SUBCLASS) return "Select a subclass";
                  const meta = ClassesData?.[characterInfo.characterClass]?.subclasses?.[selected] || null;
                  return meta?.name || capitalize(selected);
                }}
              >
                <MenuItem value={NO_SUBCLASS} disabled>
                  Select a subclass
                </MenuItem>
                {Object.keys(ClassesData?.[characterInfo.characterClass]?.subclasses || {}).map((subclass) => {
                  const meta = ClassesData?.[characterInfo.characterClass]?.subclasses?.[subclass] || null;
                  return (
                    <MenuItem key={subclass} value={subclass}>
                      {meta?.name || capitalize(subclass)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {characterInfo.race === "Dragonborn" && dragonbornAncestryOptions.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="ancestry-select-label">Ancestry</InputLabel>
              <Select
                labelId="ancestry-select-label"
                id="ancestry-select"
                value={characterInfo.draconicAncestry || ""}
                label="Ancestry"
                name="draconicAncestry"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  Select an ancestry
                </MenuItem>
                {dragonbornAncestryOptions.map((ancestry) => (
                  <MenuItem key={ancestry} value={ancestry}>
                    {ancestry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : null}

	        {characterInfo.race === "Half Elf" &&
	        characterInfo.subrace === "Standard Half Elf" &&
	        halfElfVersatilityOptions.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="half-elf-versatility-select-label">Half-Elf Versatility</InputLabel>
              <Select
                labelId="half-elf-versatility-select-label"
                id="half-elf-versatility-select"
                value={characterInfo.halfElfVersatility || ""}
                label="Half-Elf Versatility"
                name="halfElfVersatility"
                onChange={handleChange}
              >
                {halfElfVersatilityOptions.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
	        ) : null}

	        {characterInfo.characterClass === "druid" && characterInfo.subclass === "land" ? (
	          <Box sx={{ mt: 1 }}>
	            <FormControl fullWidth size="small">
	              <InputLabel id="druid-land-type-select-label">Land Type</InputLabel>
	              <Select
	                labelId="druid-land-type-select-label"
	                id="druid-land-type-select"
	                value={characterInfo.druidLandType || ""}
	                label="Land Type"
	                name="druidLandType"
	                onChange={handleChange}
	              >
	                {landDruidTypeOptions.map((landType) => (
	                  <MenuItem key={landType} value={landType}>
	                    {capitalize(landType)}
	                  </MenuItem>
	                ))}
	              </Select>
	            </FormControl>
	          </Box>
	        ) : null}

          {characterInfo.characterClass === "warlock" && characterInfo.subclass === "genie" && genieKindOptions.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="genie-kind-select-label">Genie Kind</InputLabel>
                <Select
                  labelId="genie-kind-select-label"
                  id="genie-kind-select"
                  value={characterInfo.genieKind || ""}
                  label="Genie Kind"
                  name="genieKind"
                  onChange={handleChange}
                >
                  {genieKindOptions.map((kind) => (
                    <MenuItem key={kind.id} value={kind.id}>
                      {kind.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : null}

          {(characterInfo.characterClass === "fighter" && fighterFightingStyleOptions.length > 0) ||
          (characterInfo.characterClass === "paladin" && paladinFightingStyleOptions.length > 0) ||
          (characterInfo.characterClass === "ranger" && rangerFightingStyleOptions.length > 0) ? (
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="fighting-style-select-label">Fighting Style</InputLabel>
                <Select
                  labelId="fighting-style-select-label"
                  id="fighting-style-select"
                  value={characterInfo.fightingStyle || ""}
                  label="Fighting Style"
                  name="fightingStyle"
                  onChange={handleChange}
                >
                  {(characterInfo.characterClass === "fighter"
                    ? fighterFightingStyleOptions
                    : characterInfo.characterClass === "paladin"
                      ? paladinFightingStyleOptions
                      : rangerFightingStyleOptions
                  ).map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : null}
	      </Box>

      <BlessedWarriorCantripsModal
        open={blessedWarriorModalOpen}
        onClose={() => setBlessedWarriorModalOpen(false)}
      />

      <DruidicWarriorCantripsModal
        open={druidicWarriorModalOpen}
        onClose={() => setDruidicWarriorModalOpen(false)}
      />

      <Dialog open={markOfWardingWarningOpen} onClose={() => setMarkOfWardingWarningOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Spells of the Mark</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontSize: "14px", color: "#3e2723" }}>
            Spells of the Mark are not added for classes that are not spell casters. Are you sure you want to choose{" "}
            <strong>{pendingNonCasterClass ? capitalize(pendingNonCasterClass) : "this class"}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMarkOfWardingWarningOpen(false);
              setPendingNonCasterClass("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              if (pendingNonCasterClass) {
                applyFieldChange("characterClass", pendingNonCasterClass);
              }
              setMarkOfWardingWarningOpen(false);
              setPendingNonCasterClass("");
            }}
          >
            Choose anyway
          </Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ borderColor: "rgba(139,69,19,0.3)", mb: 2, width: "100%" }} />

      {/* Level, HP, AC Row */}
      <Typography sx={sectionLabelStyle}>Combat Stats</Typography>
      <Box sx={{ ...sectionStyle, maxWidth: "280px", width: "100%" }}>
        <Grid container spacing={1.5}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="level-select-label">Level</InputLabel>
              <Select labelId="level-select-label" id="character-level-select" value={characterInfo.characterLevel} label="Level" name="characterLevel" onChange={handleChange}>
                {characterLevels.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="character-hit-points"
              value={characterInfo.hp}
              label="HP"
              variant="outlined"
              name="hp"
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="armor-class"
              value={characterInfo.ac}
              label="AC"
              variant="outlined"
              name="ac"
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ borderColor: "rgba(139,69,19,0.3)", mb: 2, width: "100%" }} />

      {/* Ability Scores */}
      <Typography sx={sectionLabelStyle}>Ability Scores</Typography>
      <Box sx={{ ...sectionStyle, width: "100%" }}>
        <Grid container spacing={1.5} justifyContent="center">
          {Object.entries(characterInfo.stats).map(([statName, statValue]) => (
            <Grid item xs={4} sm={2} key={statName}>
              <TextField
                label={statName.toUpperCase()}
                type="number"
                value={statValue.value}
                onChange={(e) =>
                  handleStatChange(statName, parseInt(e.target.value, 10) || 0)
                }
                inputProps={{ min: 1, max: 50 }}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 700,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ borderColor: "rgba(139,69,19,0.3)", mb: 2, width: "100%" }} />

      {/* Weapons */}
      <Typography sx={sectionLabelStyle}>Weapons</Typography>
      <Box sx={{ mb: 2, width: "100%" }}>
        <WeaponManager />
      </Box>

      {/* Continue Button */}
      <Button
        variant="contained"
        onClick={handleContinue}
        sx={{
          mt: 1,
          mb: 1,
          py: 1.2,
          px: 6,
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "16px",
          letterSpacing: "1.5px",
          backgroundColor: "#8B4513",
          "&:hover": { backgroundColor: "#6d3410" },
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default CharacterCreationForm;
