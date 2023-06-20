import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterInfoContext } from "../Contexts/Context";
import ClassesData from "./ClassesData";
import { Races, Subraces } from "./RacesData"

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
// import Classes from "./ClassesData";
import Button from "@mui/material/Button";

export const CharacterCreationForm = (props) => {

  const characterClasses = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"];

  //I get errors if characterClass starts out as an empty string due to the object.keys functions I'm using. This solution works, but idk if it's ideal to have a starting class in state and connecting subclass in data set.
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const navigate = useNavigate();

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
          <InputLabel id="subclass-select-label">Choose Your Subrace</InputLabel>
          <Select labelId="subclass-select-label" id="subclass-select" label="Subclass" name="subclass" onChange={handleChange}>
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
          <Select labelId="subclass-select-label" id="subclass-select" label="Subclass" name="subclass" onChange={handleChange}>
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
  const renderSpellModDD = () => {
    if (ClassesData[characterInfo.characterClass].spellcastingAbility === "nonCaster") {
    } else {
      return (
        <Box sx={{ minWidth: 120 }}>
          <InputLabel id="spellcasting-mod-select-label">Your spellcasting ability is {ClassesData[characterInfo.characterClass].spellcastingAbility}. What is your Spellcasting Modifier?</InputLabel>
          <Select labelId="spellcasting-mod-select-label" id="spellcasting-mod-select" label="spellcasting-mod" name="spellcastingMod" onChange={handleChange}>
            {spellcastingModArray.map((spellcastingMod, index) => {
              return (
                <MenuItem key={spellcastingMod} value={spellcastingMod}>
                  {spellcastingMod}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
      );
    }
  };

  //easier to use logic/for loop, or to create this datastructure?
  const spellcastingModArray = [-4, -3, -2, -1, 0, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10];
  const characterLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (characterInfo.characterClass === 'wizard') {
      setCharacterInfo({...characterInfo, [name]: parseInt(value)})
    }
    setCharacterInfo({ ...characterInfo, [name]: event.target.value });
  };



  return (
    <div>
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-name" label="Character Name" variant="outlined" name="characterName" onChange={handleChange} />
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Choose Your Race</InputLabel>
        <Select labelId="race-select-label" id="race-select" label="Race" name="race" onChange={handleChange}>
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
        <Select labelId="character-level-select-label" id="character-level-select" label="character-level" name="characterLevel" onChange={handleChange}>
          {characterLevels.map((charLevels, index) => {
            return (
              <MenuItem key={charLevels} value={charLevels}>
                {charLevels}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-hit-points" label="Character Hit Points" variant="outlined" name="hp" onChange={handleChange} />
      </Box>
      {/* add conditional logic for spellcasters vs non spellcasters to adjust the message based onwhich class is chosen or to just have this conditionally render if a spellcasting class */}
      {renderSpellModDD()}
      <Button variant="contained" onClick={() => navigate("/mainUI")}>
        Continue
      </Button>
    </div>
  );
};

export default CharacterCreationForm;
