import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterInfoContext } from "../Contexts/Context";
import ClassesData from "./ClassesData";
import { Races, Subraces } from "./RacesData"
import { WeaponManager } from "./MainUI/WeaponManager"
import { proficiencyBonus } from "../components/MainUI/header";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


export const CharacterCreationForm = (props) => {

  const characterClasses = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"];

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

  const renderSubrace = () => {
    if(characterInfo.race !== "noRace") {
      console.log('Subraces[characterInfo.characterClass]', Subraces[characterInfo.characterClass])

      return (
        <Box sx={{ minWidth: 120 }}>
          <InputLabel id="subrace-select-label">Choose Your Subrace</InputLabel>
          <Select labelId="subrace-select-label" id="subrace-select" value={characterInfo.subrace} label="Subrace" name="subrace" onChange={handleChange}>
            {Subraces[characterInfo.race].map((subrace, index) => {
              return (
                <MenuItem key={subrace} value={subrace}>
                  {subrace}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
      );
    }
  }

  const renderSubclassDropdown = () => {
    if (characterInfo.characterClass !== "noClass") {

      const subclassKeysArray = Object.keys(ClassesData[characterInfo.characterClass].subclasses);
      return (
        <Box sx={{ minWidth: 120 }}>
          <InputLabel id="subclass-select-label">Choose Your Subclass</InputLabel>
          <Select labelId="subclass-select-label" id="subclass-select" value={characterInfo.subclass} label="Subclass" name="subclass" onChange={handleChange}>
            {subclassKeysArray.map((subclass, index) => {
              return (
                <MenuItem key={subclass} value={subclass}>
                  {subclass}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
      );
    }
  };

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



  return (
    <div>
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-name" label="Character Name" value={characterInfo.characterName} variant="outlined" name="characterName" onChange={handleChange} />
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Choose Your Race</InputLabel>
        <Select labelId="race-select-label" id="race-select" value={characterInfo.race} label="Race" name="race" onChange={handleChange}>
          {Races.map((race, index) => {
            return (
              <MenuItem key={race} value={race}>
                {race}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      {renderSubrace()}
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="character-class-select-label">Choose Your Class</InputLabel>
        <Select labelId="character-class-select-label" id="class-select" label="characterClass" value={characterInfo.characterClass} name="characterClass" onChange={handleChange}>
          {characterClasses.map((charClass, index) => {
            return (
              <MenuItem key={charClass} value={charClass}>
                {charClass}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      {renderSubclassDropdown()}
      {renderWizardSpellCountMod()}
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="character-level-select-label">Choose your Character Level</InputLabel>
        <Select labelId="character-level-select-label" id="character-level-select" value={characterInfo.characterLevel} label="character-level" name="characterLevel" onChange={handleChange}>
          {characterLevels.map((charLevels, index) => {
            return (
              <MenuItem key={charLevels} value={charLevels}>
                {charLevels}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      {/* CHANGE NEEDED: Change styling */}
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-hit-points" value={characterInfo.hp} label="Character Hit Points" variant="outlined" name="hp" onChange={handleChange} />
      </Box>
      {/* FEATURE NEEDED: Add tooltip to add up AC--can be different for each class or just a general message */}
      <Box component="form" noValidate autoComplete="off">
        <TextField id="armor-class" value={characterInfo.ac} label="Armor Class" variant="outlined" name="armor class" onChange={handleChange} />
      </Box>
      {/* add conditional logic for spellcasters vs non spellcasters to adjust the message based onwhich class is chosen or to just have this conditionally render if a spellcasting class */}
      {/* NEEDED: STYLING FOR THIS, NUMBERS AREN'T READABLE */}
      <Box display="flex" gap={2}>
        {Object.entries(characterInfo.stats).map(([statName, statValue]) => (
          <TextField
            key={statName}
            label={statName.toUpperCase()}
            type="number"
            value={statValue.value}
            onChange={(e) =>
              handleStatChange(statName, parseInt(e.target.value, 10) || 0)
            }
            inputProps={{ min: 1, max: 50 }}
            sx={{ width: "80px" }}
          />
        ))}
      </Box>
      <WeaponManager/> 
      <Button variant="contained" onClick={() => navigate("/mainUI")}>
        Continue
      </Button>
    </div>
  );
};

export default CharacterCreationForm;
