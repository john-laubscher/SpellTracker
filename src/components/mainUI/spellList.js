import React, { useContext } from "react";
import axios from 'axios';

import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";

export const SpellList = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  //need special condition for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const spellLevelKnownRendering = (spellLevel) => {
    console.log(spellLevel);
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
    } else if (spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel] !== 0) {
      if (spellLevel === "cantrips") {
        return (
          <div>
            <h3>
              {spellLevel} known: {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
            </h3>
            <button onClick={getAllSpells}>Get All Spellsss</button>
          </div>
        );
      }
      return (
        <div>
          <h3>
            {spellLevel} level spell slots: {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
          </h3>
          <p>Add a spell </p>
        </div>
      );
    } else {
    }
  };

  const getAllSpells = () => {
    axios.get('http://localhost:3001/allspells')
      .then(res => {
      console.log('front end fetch .then')
      console.log(res.data)
      })
      .catch(error => {
        console.log('error in getallspells FE')
      })
  }

// fetching spells from the api will happen in this file. (Add a spell) will have a link to all spells of that level

  //render checkboxes with each spell Level (the amount that they have slots for)
  //add logic for bringing up modal populated with spells of the level you are adding to you spell list, and allowing them to be chosen and stored (context API?)
  return (
    <div>
      <p>Spell Tracker Section</p>
      {spellLevelKnownRendering("cantrips")}
      {spellLevelKnownRendering("first")}
      {spellLevelKnownRendering("second")}
      {spellLevelKnownRendering("third")}
      {spellLevelKnownRendering("fourth")}
      {spellLevelKnownRendering("fifth")}
      {spellLevelKnownRendering("sixth")}
      {spellLevelKnownRendering("seventh")}
      {spellLevelKnownRendering("eighth")}
      {spellLevelKnownRendering("ninth")}
    </div>
  );
};

export default SpellList;
