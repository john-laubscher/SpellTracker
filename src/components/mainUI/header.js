import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, Grid, Typography, Card, CardContent, Button, IconButton, useTheme, TextField, Box } from '@mui/material';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";


import { CharacterInfoContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import {WeaponsDisplay} from "./WeaponManager";
import { calculateTotalPreparedSpells } from "../../utils/preparedSpells";
import AuthControls from "../AuthControls";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const proficiencyBonus = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

const Header = () => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const navigate = useNavigate();

  const theme = useTheme();
  const spellsFromWizLevel = (characterInfo.characterLevel - 1) * 2 + 6
  const wizardSpellbookTrackedCount = Object.values(characterInfo?.wizardSpellbook || {}).reduce(
    (acc, entries) => acc + (Array.isArray(entries) ? entries.length : 0),
    0
  );

  const [showDetails, setShowDetails] = useState(false);
  const [spellData, setSpellData] = useState({
    totalPreparedSpells: 0,
    totalWizardSpells: 0,
    spellcastingAbility: '',
  });

  const toggleDetails = () => setShowDetails(!showDetails);

  const formatSpellcastingAbility = (ability) => {
    const abilityMap = {
      intelligence: "INT",
      wisdom: "WIS",
      charisma: "CHA",
      int: "INT",
      wis: "WIS",
      cha: "CHA",
      str: "STR",
      dex: "DEX",
      con: "CON",
    };
    
    return abilityMap[ability.toLowerCase()] || ability.toUpperCase();
  };

  const classKey = String(characterInfo?.characterClass || "");
  const classMeta = ClassesData?.[classKey] || null;
  const subclassKey = String(characterInfo?.subclass || "");
  const subclassMeta = classMeta?.subclasses?.[subclassKey] || null;
  const characterLevel = Number(characterInfo?.characterLevel) || 0;
  const subclassSpellcasting = subclassMeta?.spellcasting || null;
  const hasSubclassSpellcasting =
    Boolean(subclassSpellcasting) && characterLevel >= Number(subclassSpellcasting?.startsAtLevel || 1);
  const spellcastingAbility = hasSubclassSpellcasting
    ? String(subclassSpellcasting?.spellcastingAbility || classMeta?.spellcastingAbility || "nonCaster")
    : String(classMeta?.spellcastingAbility || "nonCaster");
  const subclassDisplayName = subclassMeta?.name || (subclassKey ? capitalize(subclassKey) : "");
  const effectiveIsNonCaster = spellcastingAbility === "nonCaster";
  const isArcaneArcher =
    characterInfo.characterClass === "fighter" && String(characterInfo.subclass || "") === "arcaneArcher";
  const isBattleMaster =
    characterInfo.characterClass === "fighter" && String(characterInfo.subclass || "") === "battleMaster";
  const isCavalier =
    characterInfo.characterClass === "fighter" && String(characterInfo.subclass || "") === "cavalier";
  const isMonk = characterInfo.characterClass === "monk";
  const proficiencyBonusValue = proficiencyBonus[characterLevel] || 2;
  const fighterLevel = (() => {
    const raw = characterInfo?.classLevels?.fighter;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterInfo.characterClass === "fighter") return Math.max(0, Math.trunc(Number(characterInfo.characterLevel) || 0));
    return 0;
  })();

  const spellcastingModValue =
    spellcastingAbility && spellcastingAbility !== "nonCaster"
      ? Number(characterInfo?.stats?.[spellcastingAbility]?.mod ?? 0) || 0
      : 0;
  const spellAttackBonus = proficiencyBonusValue + spellcastingModValue;
  const spellSaveDc = 8 + proficiencyBonusValue + spellcastingModValue;

  const arcaneShotDc =
    8 + proficiencyBonusValue + (Number(characterInfo?.stats?.int?.mod) || 0);
  const maneuverSaveDc =
    8 +
    proficiencyBonusValue +
    Math.max(
      Number(characterInfo?.stats?.str?.mod ?? characterInfo?.stats?.strength?.mod ?? 0) || 0,
      Number(characterInfo?.stats?.dex?.mod ?? characterInfo?.stats?.dexterity?.mod ?? 0) || 0
    );
  const ferociousChargerDc =
    8 +
    proficiencyBonusValue +
    (Number(characterInfo?.stats?.str?.mod ?? characterInfo?.stats?.strength?.mod ?? 0) || 0);
  const kiSaveDc =
    8 +
    proficiencyBonusValue +
    (Number(characterInfo?.stats?.wis?.mod ?? characterInfo?.stats?.wisdom?.mod ?? 0) || 0);

useEffect(() => {

  console.log(characterInfo.stats, 'stats')

  const totalPreparedSpells = calculateTotalPreparedSpells(characterInfo);
  
  if (effectiveIsNonCaster) {
    setSpellData(prevState => ({
      ...prevState,
      spellcastingAbility: "Non-caster",
      totalPreparedSpells: 0, // Non-casters do not prepare spells
    }));
  } else if (spellcastingAbility) {
    setSpellData(prevState => ({
      ...prevState,
      spellcastingAbility: formatSpellcastingAbility(spellcastingAbility),
      totalPreparedSpells,
    }));
  }

  if (ClassesData[characterInfo.characterClass]?.isSpellCaster) {
    if (characterInfo.characterClass === "wizard") {
      const fallbackSpellbookCount = spellsFromWizLevel + parseInt(characterInfo.wizardSpellCountMod);
      const totalWizardSpellbookCount = wizardSpellbookTrackedCount > 0 ? wizardSpellbookTrackedCount : fallbackSpellbookCount;
      // Wizard keeps track of spells Known in spellbook (only class to be able to add to spells known).
      setSpellData(prevState => ({
        ...prevState,
        totalWizardSpells: totalWizardSpellbookCount,
        totalPreparedSpells,
      }));
    }
  }
}, [characterInfo, effectiveIsNonCaster, spellcastingAbility, spellsFromWizLevel, wizardSpellbookTrackedCount]);

  const determineNoncasters = () => {
    if (effectiveIsNonCaster) {
      return (
        <Typography variant="h6" sx={theme.typography.body1}>
          {characterInfo.characterName} is not a caster
        </Typography>
      );
    }
    return (
      <Typography variant="h6" sx={theme.typography.body1}>
        Spellcasting ability is {spellData.spellcastingAbility}
      </Typography>
    );
  };

  const getRaceDisplay = () => {
    const race = characterInfo.race;
    const subrace = characterInfo.subrace;
    const draconicAncestry = characterInfo.draconicAncestry;

    if (race === "Dragonborn" && subrace === "Chromatic/Metallic" && draconicAncestry) {
      return `${draconicAncestry} Dragonborn`;
    }

    if (!subrace || subrace === "No Subrace") return race;
    return `${subrace} ${race}`;
  };

  // ***NEED FEATURE*** TAKE LONG REST (resets hp to max)
  // ***NEED FEATURE*** LEVEL UP (take user thru gaining hp based on class, auto increases level, allow PC to choose more spells if appropriate, add feats and access other features, etc.)

  return (
// Header needs weapon bonuses
// Advanced feature is multiple weapons that can be named
// Each weapon can have a tooltip description with damage type and other info
// Will header eventually need to be moved to top to make room for spell list??

    <>
      <Box
        sx={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 2000,
        }}
      >
        <AuthControls onLoggedOutNavigateTo="/" />
      </Box>

      <Card sx={theme.components.CharacterHeader.styleOverrides.root}>
      <Grid container spacing={1} sx={theme.components.CharacterHeader.styleOverrides.gridContainer}>
        {/* Top row: name/hp + key combat stats */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <IconButton onClick={toggleDetails} size="small" sx={{ p: 0.5 }}>
              {showDetails ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
            <Typography variant="h5" sx={{ lineHeight: 1.1, fontWeight: 800 }}>
              {characterInfo.characterName}
            </Typography>
            <TextField
              className="EditableHP"
              variant="outlined"
              label="HP"
              size="small"
              value={characterInfo.hp}
              onChange={(e) =>
                setCharacterInfo((prev) => ({
                  ...prev,
                  hp: parseInt(e.target.value, 10) || 0,
                }))
              }
              sx={{ width: 96 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ backgroundColor: "rgba(139,69,19,0.04)", display: "inline-block" }}>
            <CardContent sx={{ py: 1, px: 1.25, "&:last-child": { pb: 1 } }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "baseline" }}>
                {!effectiveIsNonCaster ? (
                  <Tooltip
                    arrow
                    title={`${proficiencyBonusValue} (proficiency bonus) + ${spellcastingModValue} (${formatSpellcastingAbility(spellcastingAbility)} modifier) = ${spellAttackBonus}`}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 800, cursor: "help" }}>
                      Spell Atk: +{spellAttackBonus}
                    </Typography>
                  </Tooltip>
                ) : null}
                {isArcaneArcher ? (
                  <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>
                    Arcane Shot DC: {arcaneShotDc}
                  </Typography>
                ) : isBattleMaster ? (
                  <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>
                    Maneuver DC: {maneuverSaveDc}
                  </Typography>
                ) : isCavalier ? (
                  fighterLevel >= 15 ? (
                    <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>
                      Charger DC: {ferociousChargerDc}
                    </Typography>
                  ) : null
                ) : isMonk ? (
                  <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>
                    Ki Save DC: {kiSaveDc}
                  </Typography>
                ) : (
                  <Tooltip
                    arrow
                    title={`8 + ${proficiencyBonusValue} (proficiency bonus) + ${spellcastingModValue} (${formatSpellcastingAbility(spellcastingAbility)} modifier) = ${spellSaveDc}`}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 800, cursor: "help" }}>
                      Save DC: {spellSaveDc}
                    </Typography>
                  </Tooltip>
                )}
                <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>AC: {characterInfo.ac}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weapons row: full width */}
        <Grid item xs={12}>
          <WeaponsDisplay characterInfo={characterInfo} />
        </Grid>
      </Grid>

      {/* Expanded Details */}
      {showDetails && (
        <Grid container spacing={2} sx={theme.components.CharacterHeader.styleOverrides.expandedDetails}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="body2">
                  {characterInfo.characterName} has {characterInfo.characterLevel}{" "}
                  {ClassesData[characterInfo.characterClass].hitDice} hit dice
                </Typography>
                <Typography variant="body2">
                  Level {characterInfo.characterLevel} {capitalize(characterInfo.characterClass)} ({subclassDisplayName})
                </Typography>
                <Typography variant="body2">
                  Race: {getRaceDisplay()}
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
          <Grid item xs={12} md={6}> 
            <Card>
              <CardContent>
                {determineNoncasters()}
                <Tooltip placement="top" title="Does not include cantrips">
                  <Typography variant="h6" sx={theme.typography.body1}>Total Prepared Spells: {spellData.totalPreparedSpells} </Typography>
                </Tooltip>
                {characterInfo.characterClass === "wizard" && (
                  <>
                    <Tooltip placement="top" title="Does not include cantrips">
                      <Typography variant="h6" sx={theme.typography.body1}>
                        Total Wizard Spells: {spellData.totalWizardSpells}
                      </Typography>
                    </Tooltip>
                    <Tooltip placement="top" title={`Spells from wizard level: ${spellsFromWizLevel}; Transcribed spells: ${characterInfo.wizardSpellCountMod}; Tracked in spellbook: ${wizardSpellbookTrackedCount}`}>
                      <Typography variant="h6" sx={theme.typography.body1}>
                        Total Spells in Wizard Spell Book: {spellData.totalWizardSpells}
                      </Typography>
                    </Tooltip>
                  </>
                )}
                <Typography variant="h6" sx={theme.typography.body1}>
                  Proficiency Bonus: + {proficiencyBonus[characterInfo.characterLevel]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid #ccc', padding: '8px', overflowX: 'auto' }}>
              <CardContent>
                <Grid container spacing={1} sx={{ textAlign: 'center', justifyContent: 'space-between' }}>
                  {Object.entries(characterInfo.stats).map(([statName, { value, mod }]) => (
                    <Grid item key={statName} sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {statName.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                        {value}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '1.1rem', color: mod >= 0 ? 'green' : 'red' }}>
                        {mod >= 0 ? `+${mod}` : mod}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>    
          {/* Back Button */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              sx={theme.components.CharacterHeader.styleOverrides.backButton}
              onClick={() => navigate("/")}
            >
              Back to Character Creation
            </Button>
          </Grid>
        </Grid>
      )}
    </Card>
    </>
  );
};

export { Header, proficiencyBonus } ;
