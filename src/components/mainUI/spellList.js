import React, { useContext } from "react";

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
            <p>Add a spell </p>
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

  //   spellLevelKnownRendering("cantrips");

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
