import React, { useContext } from "react";
import axios from 'axios';

import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"

export const SpellList = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  // used for modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  //need special condition for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const spellLevelKnownRendering = (spellLevel, numericalSpellLevel) => {
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
    } else if (spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel] !== 0) {
      if (spellLevel === "cantrips") {
        return (
          <div>
            <h3>
              {spellLevel} known: {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
            </h3>
            <button onClick={toggleModal}>{isModalOpen ? 'Close Modal' : 'Open Modal'}</button>
            {isModalOpen ? <AddSpellModal 
              isModalOpen={isModalOpen} 
              onClose={toggleModal} 
              // spells={characterInfo.spellsPrepared[0]} 
              spellLevel={numericalSpellLevel}
            /> : null}
            <button onClick={() => getAllSpells(numericalSpellLevel)}>Add a spell</button>
          </div>
        );
      }
      return (
        <div>
          <h3>
            {spellLevel} level spell slots: {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
          </h3>
          <button onClick={() => getAllSpells(numericalSpellLevel)}>Add a spell</button>
        </div>
      );
    } else {
    }
  };

  // Class and spell level
  const getAllSpells = (numericalSpellLevel) => {
    axios.get(`http://localhost:3001/allspells/${numericalSpellLevel}/${characterInfo.characterClass}`)
      .then(res => {
      console.log('front end fetch .then')
      console.log(res.data)
      console.log("state", characterInfo)
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
      {spellLevelKnownRendering("cantrips", 0)}
      {spellLevelKnownRendering("first", 1)}
      {spellLevelKnownRendering("second", 2)}
      {spellLevelKnownRendering("third", 3)}
      {spellLevelKnownRendering("fourth", 4)}
      {spellLevelKnownRendering("fifth", 5)}
      {spellLevelKnownRendering("sixth", 6)}
      {spellLevelKnownRendering("seventh", 7)}
      {spellLevelKnownRendering("eighth", 8)}
      {spellLevelKnownRendering("ninth", 9)}
    </div>
  );
};

export default SpellList;
