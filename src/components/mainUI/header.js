import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, Grid, Typography, Card, CardContent, Button, IconButton, useTheme, TextField  } from '@mui/material';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";


import { CharacterInfoContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import {WeaponsDisplay} from "./WeaponManager";

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

  const [showDetails, setShowDetails] = useState(false);
  const [spellData, setSpellData] = useState({
    totalPreparedSpells: 0,
    totalWizardSpells: 0,
    spellcastingAbility: '',
  });

  const toggleDetails = () => setShowDetails(!showDetails);

  const formatSpellcastingAbility = (ability) => {
    const abilityMap = {
      intelligence: "Int",
      wisdom: "Wis",
      charisma: "Cha",
    };
    
    return abilityMap[ability.toLowerCase()] || ability;
  };

  const spellcastingAbility = ClassesData[characterInfo.characterClass]?.spellcastingAbility;

useEffect(() => {

  console.log(characterInfo.stats, 'stats')
  
  if (spellcastingAbility === "nonCaster") {
    setSpellData(prevState => ({
      ...prevState,
      spellcastingAbility: "Non-caster",
      totalPreparedSpells: 0,  // Non-casters do not prepare spells
    }));
  } else if (spellcastingAbility) {
    setSpellData(prevState => ({
      ...prevState,
      spellcastingAbility: formatSpellcastingAbility(spellcastingAbility),
    }));
  }

  if (ClassesData[characterInfo.characterClass]?.isSpellCaster) {
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "refer to spellTables") {
      setSpellData(prevState => ({
        ...prevState,
        totalPreparedSpells: spellTables[characterInfo.characterClass][characterInfo.characterLevel].spellsKnown,
      }));
    } else if (ClassesData[characterInfo.characterClass].isSpellCaster === "halfCaster") {
      setSpellData(prevState => ({
        ...prevState,
        totalPreparedSpells: Math.floor(0.5 * characterInfo.characterLevel + characterInfo.spellcastingMod),
      }));
    } else if (characterInfo.characterClass === "wizard") {
      {/* Wizard keeps track of spells Known in spellbook (only class to be able to add to spells known), at some point, add a way for them to add spells to this count either with dropdown or button. */}
      setSpellData(prevState => ({
        ...prevState,
        totalWizardSpells: spellsFromWizLevel + parseInt(characterInfo.wizardSpellCountMod),
        totalPreparedSpells: characterInfo.characterLevel + characterInfo.spellcastingMod,
      }));
    } else if (ClassesData[characterInfo.characterClass].isSpellCaster === "fullCaster") {
      setSpellData(prevState => ({
        ...prevState,
        totalPreparedSpells: characterInfo.characterLevel + characterInfo.spellcastingMod,
      }));
    }
  }
}, [characterInfo, ClassesData]);

const determineNoncasters = () => {
  if (ClassesData[characterInfo.characterClass].spellcastingAbility === "nonCaster") {
    return <Typography variant="h6" sx={theme.typography.body1}>{characterInfo.characterName} is not a caster</Typography>;
  } else {
    return <Typography variant="h6" sx={theme.typography.body1}>Spellcasting ability is {spellData.spellcastingAbility}</Typography>;
  }
};

  // ***NEED FEATURE*** TAKE LONG REST (resets hp to max)
  // ***NEED FEATURE*** LEVEL UP (take user thru gaining hp based on class, auto increases level, allow PC to choose more spells if appropriate, add feats and access other features, etc.)

  return (
// Header needs weapon bonuses
// Advanced feature is multiple weapons that can be named
// Each weapon can have a tooltip description with damage type and other info
// Will header eventually need to be moved to top to make room for spell list??

    <Card sx={theme.components.CharacterHeader.styleOverrides.root}>
      <Grid container sx={theme.components.CharacterHeader.styleOverrides.gridContainer}>
        <Grid item>
          <IconButton onClick={toggleDetails}>
            {showDetails ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </Grid>
        <Grid item sx={theme.components.CharacterHeader.styleOverrides.gridItem}>
          <Typography variant="h5">{characterInfo.characterName}</Typography>
          <TextField
            className="EditableHP"
            variant="outlined"
            label="HP"
            value={characterInfo.hp}
            onChange={(e) =>
              setCharacterInfo((prev) => ({
                ...prev,
                hp: parseInt(e.target.value, 10) || 0, // Convert input to number or fallback to 0
              }))
            }
            sx={{ width: "100px" }} // Optional: Adjust size
          />
        </Grid>
        <Grid item xs={12} md={6}> 
            <Card>
              <CardContent>
                <div>
                  {/* Despite some classes not being spellcasters, we can still render this info, many races or items give non-casters spells or require a DC like monks stunning strike */}
                  {/* Maybe tooltips for calculated stats */}
                  {/* Needs card for weapon attacks--They should be horizontal */}
                  {/* Move header outside of the background? Refactor styling? */}
                  <Typography variant="h6" sx={theme.typography.body1}>
                    {ClassesData[characterInfo.characterClass].spellcastingAbility === "nonCaster" 
                      ? "NonCaster"
                      : `Spell Attack Mod: + ${characterInfo.stats[spellcastingAbility].mod}`}
                  </Typography>                  
                  <Typography variant="h6" sx={theme.typography.body1}>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8}</Typography>
                  <Typography variant="h6" sx={theme.typography.body1}>Armor Class: {characterInfo.ac}</Typography>
                </div>
              </CardContent>
            </Card>
            <Grid>
              <WeaponsDisplay characterInfo={characterInfo} />
            </Grid>
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
                  Level {characterInfo.characterLevel} {characterInfo.characterClass} ({characterInfo.subclass})
                </Typography>
                <Typography variant="body2">
                  Race: {characterInfo.subrace} {characterInfo.race}
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
                    <Tooltip placement="top" title={`Spells from wizard level: ${spellsFromWizLevel}; Transcribed spells: ${characterInfo.wizardSpellCountMod}`}>
                      <Typography variant="h6" sx={theme.typography.body1}>
                        Total Spells in Wizard Spell Book: {spellsFromWizLevel + parseInt(characterInfo.wizardSpellCountMod)}
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
  );
};

export { Header, proficiencyBonus } ;
