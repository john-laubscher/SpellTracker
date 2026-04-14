import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterInfoContext } from "../Contexts/Context";
import ClassesData from "./ClassesData";
import { Races, Subraces } from "./RacesData"
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


export const CharacterCreationForm = (props) => {

  const characterClasses = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"];

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  //I get errors if characterClass starts out as an empty string due to the object.keys functions I'm using. This solution works, but idk if it's ideal to have a starting class in state and connecting subclass in data set.
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  // const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  const navigate = useNavigate();

  useEffect(() => {
    setCharacterInfo((prev) => ({
      ...prev,
      proficiencyMod: proficiencyBonus[prev.characterLevel] || 2, // Fallback to 2 for safety
    }));
  }, [characterInfo.characterLevel]);

  const renderWizardSpellCountMod = () => {
    if (characterInfo.characterClass === 'wizard') {
      // ***NEED FEATURE*** WHEN USER TRIES TO GO OVER 25, IT SHOULD SHAKE, OR OUTLINE IN RED, AND HAVE A TOOLTIP SAYING HAVE A NUMBER BETWEEN 0 AND 25
      const handleWizInputChange = (event) => {
        const value = event.target.value;
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 25)) {
          handleChange(event)
        };
        }
      return (
        <Box noValidate component="form">
          <InputLabel> <strong>Number of transcribed spells</strong></InputLabel>
          <InputLabel>Enter a number between 0 and 25</InputLabel>
          <TextField
            type="number"
            variant="outlined" 
            name="wizardSpellCountMod"
            value={characterInfo.wizardSpellCountMod}
            onChange={handleWizInputChange}
            inputProps={{
              min: 0,
              max: 25,
            }}
          />
        </Box>
      )
    }
  }


  //due to issues with the .keys method, "noClass" is the default class (found in ClassesData.js)

  //easier to use logic/for loop, or to create this datastructure?
  const characterLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (characterInfo.characterClass === 'wizard') {
      setCharacterInfo({...characterInfo, [name]: parseInt(value)})
    }
    setCharacterInfo({ ...characterInfo, [name]: event.target.value });
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
            <FormControl fullWidth size="small">
              <InputLabel id="race-select-label">Race</InputLabel>
              <Select labelId="race-select-label" id="race-select" value={characterInfo.race} label="Race" name="race" onChange={handleChange}>
                {Races.map((race) => (
                  <MenuItem key={race} value={race}>{race}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {characterInfo.race !== "noRace" && (
              <FormControl fullWidth size="small">
                <InputLabel id="subrace-select-label">Subrace</InputLabel>
                <Select labelId="subrace-select-label" id="subrace-select" value={characterInfo.subrace} label="Subrace" name="subrace" onChange={handleChange}>
                  {Subraces[characterInfo.race].map((subrace) => (
                    <MenuItem key={subrace} value={subrace}>{subrace}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="class-select-label">Class</InputLabel>
              <Select labelId="class-select-label" id="class-select" value={characterInfo.characterClass} label="Class" name="characterClass" onChange={handleChange} renderValue={capitalize}>
                {characterClasses.map((charClass) => (
                  <MenuItem key={charClass} value={charClass}>{capitalize(charClass)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {characterInfo.characterClass !== "noClass" && (
              <FormControl fullWidth size="small">
                <InputLabel id="subclass-select-label">Subclass</InputLabel>
                <Select labelId="subclass-select-label" id="subclass-select" value={characterInfo.subclass} label="Subclass" name="subclass" onChange={handleChange} renderValue={capitalize}>
                  {Object.keys(ClassesData[characterInfo.characterClass].subclasses).map((subclass) => (
                    <MenuItem key={subclass} value={subclass}>{capitalize(subclass)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>
      </Box>

      {renderWizardSpellCountMod()}

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
        onClick={() => navigate("/mainUI")}
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
