import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
// import helpers from "../../Helpers/Helpers";
import ClassesData from "../ClassesData";

export const Header = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);
  const navigate = useNavigate();

  //   const noncasters = ["barbarian", "fighter", "monk", "rogue"];

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

  return (
    <div>
      <h1>Name: {characterInfo.characterName} </h1>
      <h3>Class: {characterInfo.characterClass} </h3>
      <h3>Subclass: {characterInfo.subclass} </h3>
      <h3>Level: {characterInfo.characterLevel} </h3>
      <h3>Race: {characterInfo.race} </h3>
      <h3>HP: {characterInfo.hp} </h3>
      <h3>Spellcasting Modifier: {characterInfo.spellcastingMod} </h3>
      {determineNoncasters()}
      <Button onClick={() => navigate("/")}>Back</Button>
    </div>
  );
};

export default Header;
