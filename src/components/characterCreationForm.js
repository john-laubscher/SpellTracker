import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import subclasses from "./subClasses";

export const CharacterCreationForm = (props) => {
  const races = ["Dragonborn", "Dwarf", "Elf", "Gnome", "Half-Elf", "Half-Orc", "Halfling", "Human", "Tiefling"];

  const characterClasses = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"];

  const [characterInfo, setCharacterInfo] = useState({
    characterName: "",
    race: "",
    characterClass: "druid",
    subclass: "",
    level: "",
    hp: "",
    // spellcastingAbility: "",    ---I think handle this when we are actually making an api call and can use local state a the index to check this info  b
    spellcastingMod: "",
  });

  const subclassKeysArray = Object.keys(subclasses[characterInfo.characterClass]);
  const spellcastingModArray = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const keys = Object.keys(subclasses[characterInfo.characterClass]);
  console.log("Here are keys", keys);

  const handleChange = (event) => {
    //include logic to grab the spellcasting_ability directly from the api depending on class?? it's possible, idk if it's efficient enough//
    console.log("is it running?", characterInfo);
    setCharacterInfo({ characterClass: event.target.value });
    console.log("Here's characterinfo", characterInfo);
  };

  return (
    <div>
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-name" label="Character Name" variant="outlined" />
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Choose Your Race</InputLabel>
        <Select labelId="race-select-label" id="race-select" label="Race">
          {races.map((race, index) => {
            return (
              <MenuItem key={race} value={race}>
                {race}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="character-class-select-label">Choose Your Class</InputLabel>
        <Select labelId="character-class-select-label" id="class-select" label="CharacterClass" value={characterInfo.characterClass} onChange={handleChange}>
          {characterClasses.map((charClass, index) => {
            return (
              <MenuItem key={charClass} value={charClass}>
                {charClass}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="subclass-select-label">Choose Your Subclass</InputLabel>
        <Select labelId="subclass-select-label" id="subclass-select" label="Subclass">
          {subclassKeysArray.map((subclass, index) => {
            return (
              <MenuItem key={subclass} value={subclass}>
                {subclass}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-level" label="Character Level" variant="outlined" />
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <TextField id="character-hit-points" label="Character Hit Points" variant="outlined" />
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="spellcasting-mod-select-label">Your spellcasting ability is xxx. What is your Spellcasting Modifier?</InputLabel>
        <Select labelId="spellcasting-mod-select-label" id="spellcasting-mod-select" label="spellcasting-mod">
          {spellcastingModArray.map((spellcastingMod, index) => {
            return (
              <MenuItem key={spellcastingMod} value={spellcastingMod}>
                {spellcastingMod}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
    </div>
  );
};

export default CharacterCreationForm;
