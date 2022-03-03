import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
// import helpers from "../../Helpers/Helpers";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";

export const Header = (props) => {
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

  //need logic for classes that don't have "spellsKnown in their table" as well as noncasters
  const spellsKnown = () => {
    console.log("spellTables", spellTables[characterInfo.characterClass][characterInfo.characterLevel]);
  };

  spellsKnown();
  return (
    <div>
      <h1>Name: {characterInfo.characterName} </h1>
      <h3>Class: {characterInfo.characterClass} </h3>
      <h3>Subclass: {characterInfo.subclass} </h3>
      <h3>Level: {characterInfo.characterLevel} </h3>
      <h3>Race: {characterInfo.race} </h3>
      <h3>HP: {characterInfo.hp} </h3>
      <h3>Spellcasting Modifier: +{characterInfo.spellcastingMod} </h3>
      {determineNoncasters()}
      <h3>
        Hit Dice: {characterInfo.characterName} has {characterInfo.characterLevel} {ClassesData[characterInfo.characterClass].hitDice}
      </h3>
      <h3>Spell Attack Modifier: +{characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel]} </h3>
      <h3>Spell Save DC: {characterInfo.spellcastingMod + proficiencyBonus[characterInfo.characterLevel] + 8} </h3>
      {/* need logic for noncasters, half casters, and full casters (mod+.5 level, or mod+level*/}
      <h3>Number of Spells you can prepare: {}</h3>

      {/* spells known */}
      {/* spells prepared */}
      <Button onClick={() => navigate("/")}>Back</Button>
    </div>
  );
};

export default Header;
