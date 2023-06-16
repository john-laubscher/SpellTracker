import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Tooltip } from '@mui/material';


import { CharacterInfoContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";

export const Header = () => {
  const { characterInfo } = useContext(CharacterInfoContext);
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
      const spellsFromWizLevel = (characterInfo.characterLevel - 1) * 2 + 6
      return (
        <div>
          <h3>Spellcasting Modifier: +{characterInfo.spellcastingMod} </h3>
          <h3>Spell Attack Modifier: +{characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel]} </h3>
          <h3>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8} </h3>
          {/* Wizard keeps track of spells Known in spellbook (only class to be able to add to spells known), at some point, add a way for them to add spells to this count either with dropdown or button. */}
          {/* (only level related spells) */}
          <Tooltip placement="top" title= {`Spells from wizard level: ${spellsFromWizLevel}; Transcribed spells: ${characterInfo.wizardSpellCountMod}`}>
            {/* Not sure why wizardSpellCountMod is being set as a string, but this ensures proper addition */}
            <h3>Total Spells in Wizard Spell Book: {spellsFromWizLevel + parseInt(characterInfo.wizardSpellCountMod) } </h3>
          </Tooltip>
          {/* Total spells includes transcribed spells */}
          <Tooltip placement="top" title="Does not include cantrips">
            <h3>Total spells you can prepare daily: {characterInfo.characterLevel + characterInfo.spellcastingMod}</h3>
          </Tooltip>
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
  // ***NEED FEATURE*** LEVEL UP (take user thru gaining hp based on class, auto increases level, allow PC to choose more spells if appropriate, add feats and access other features, etc.)

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

      <Button onClick={() => navigate("/")}>Back to Character Creation</Button>
    </div>
  );
};

export default Header;
