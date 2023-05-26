import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export const Header = (props) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const navigate = useNavigate();

  //   const noncasters = ["barbarian", "fighter", "monk", "rogue"];

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

  //maybe make "nonCasters" a part of state? Could simplify logic throughout
  const determineNoncasters = () => {
    console.log("determineNoncasters");
    if (ClassesData[characterInfo.characterClass].spellcastingAbility === "nonCaster") {
      console.log("noncaster");
      return <h3>{characterInfo.characterName} is not a caster</h3>;
    } else {
      console.log("caster");
      return <h3>Spellcasting ability is {ClassesData[characterInfo.characterClass].spellcastingAbility} </h3>;
    }
  };

  // later on, maybe allow users to hover over to see calculations and labels: ie: DC = 4(spellcastingMod) + 3 (ProficiencyMod) = 7.
  const renderSpellcasterStats = () => {
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
    }
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "refer to spellTables") {
      return (
        <div>
          <h3>Spellcasting Modifier: +{characterInfo.spellcastingMod} </h3>
          <h3>Spell Attack Modifier: +{characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel]} </h3>
          <h3>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8} </h3>
          <h3>Spells you know and are prepared: {spellTables[characterInfo.characterClass][characterInfo.characterLevel].spellsKnown}</h3>
        </div>
      );
    }
    //Paladin is only half-caster on this list cuz ranger is "refer to spellTables"
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "halfCaster") {
      return (
        <div>
          <h3>Spellcasting Modifier: +{characterInfo.spellcastingMod} </h3>
          <h3>Spell Attack Modifier: +{characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel]} </h3>
          <h3>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8} </h3>
          <h3>
            Spells you can prepare daily from {characterInfo.characterClass} spell list: {Math.floor(0.5 * characterInfo.characterLevel + characterInfo.spellcastingMod)}
          </h3>
        </div>
      );
    }
    if (characterInfo.characterClass === "wizard") {
      return (
        <div>
          <h3>Spellcasting Modifier: +{characterInfo.spellcastingMod} </h3>
          <h3>Spell Attack Modifier: +{characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel]} </h3>
          <h3>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8} </h3>
          {/* Wizard keeps track of spells Known in spellbook (only class to be able to add to spells known), at some point, add a way for them to add spells to this count either with dropdown or button. */}
          <h3>Base # of Wizard Spellbook Spells: {(characterInfo.characterLevel - 1) * 2 + 6} (only level related spells)</h3>
          <h3>Spells you can prepare: {characterInfo.characterLevel + characterInfo.spellcastingMod}</h3>
        </div>
      );
    }
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "fullCaster") {
      return (
        <div>
          <h3>Spellcasting Modifier: +{characterInfo.spellcastingMod} </h3>
          <h3>Spell Attack Modifier: +{characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel]} </h3>
          <h3>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8} </h3>
          <h3>
            Spells you can prepare daily from {characterInfo.characterClass} spell list: {characterInfo.characterLevel + characterInfo.spellcastingMod}
          </h3>
        </div>
      );
    }
  };

  // ***NEED FEATURE*** TAKE LONG REST (resets hp to max)
  // ***POSSIBLE FEATURE*** LEVEL UP (take user thru gaining hp based on class, auto increases level, allow PC to choose more spells if appropriate, add feats and access other features, etc.)
  ////This is to help troubleshoot/test with the different classes, won't be part of the header/mainui
  const characterClasses = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"];
  const handleChange = (event) => {
    const name = event.target.name;

    console.log("is it running?", characterInfo);
    setCharacterInfo({ ...characterInfo, [name]: event.target.value });
    console.log("Here's characterinfo", characterInfo);
  };

  return (
    <div>
      <h1>Name: {characterInfo.characterName} </h1>
      <h3>Class: {characterInfo.characterClass} </h3>
      <h3>Subclass: {characterInfo.subclass} </h3>
      <h3>Level: {characterInfo.characterLevel} </h3>
      <h3>Race: {characterInfo.race} </h3>
      <h3>HP: {characterInfo.hp} </h3>
      <h3>
        Hit Dice: {characterInfo.characterName} has {characterInfo.characterLevel} {ClassesData[characterInfo.characterClass].hitDice}
      </h3>
      {determineNoncasters()}
      {renderSpellcasterStats()}
      {/* need logic for special input for spells for a wizard's spellbook */}

      {/* -----------------------------class changer that won'tbe part of mainui, just for testing---- */}
      <Button onClick={() => navigate("/")}>Back to Character Creation</Button>
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
    </div>
  );
};

export default Header;
