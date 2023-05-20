import React, { useContext, useEffect } from "react";
import axios from 'axios';

import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export const SpellList = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  // used for modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    console.log('spellinfo', characterInfo.spellsPrepared[0])
  }, [characterInfo]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

 



  //need special condition for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const renderPCSpells = (spellLevel, numericalSpellLevel) => {
    console.log('TEST', numericalSpellLevel)
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
    } else if (spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel] !== 0) {
      if (spellLevel === "cantrips") {
        return (
          <div>
            <h3>
              {spellLevel} known: {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
            </h3>
              {renderPreparedSpells(numericalSpellLevel)}
              <button onClick={toggleModal}>{isModalOpen ? 'Close Spell List' : 'Prepare more spells'}</button>
              {isModalOpen ? <AddSpellModal 
                isModalOpen={isModalOpen} 
                onClose={toggleModal} 
                spellLevel={numericalSpellLevel}
              /> : null}
          </div>
        );
      }
      return (
        <div>
          <h3>
            {spellLevel} level spell slots: {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
          </h3>
          {renderPreparedSpells(numericalSpellLevel)}
          <button onClick={toggleModal}>{isModalOpen ? 'Close Spell List' : 'Prepare more spells'}</button>
            {isModalOpen ? <AddSpellModal 
              isModalOpen={isModalOpen} 
              onClose={toggleModal} 
              spellLevel={numericalSpellLevel}
            /> : null}
        </div>
      );
    } else {
    }
  };

  const renderPreparedSpells = (numericalSpellLevel) => {
    console.log('spelllevel', numericalSpellLevel)
    return (
      <List>
        {characterInfo.spellsPrepared[numericalSpellLevel].map((spell, index) => (
          <ListItem key={index}>
            <ListItemText primary={spell.name} />
          </ListItem>
        ))}
      </List>
    );
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
      {renderPCSpells("cantrips", 0)}
      {renderPCSpells("first", 1)}
      {renderPCSpells("second", 2)}
      {renderPCSpells("third", 3)}
      {renderPCSpells("fourth", 4)}
      {renderPCSpells("fifth", 5)}
      {renderPCSpells("sixth", 6)}
      {renderPCSpells("seventh", 7)}
      {renderPCSpells("eighth", 8)}
      {renderPCSpells("ninth", 9)}
    </div>
  );
};

export default SpellList;
