import React, { useContext, useEffect } from "react";
import axios from 'axios';

import { CharacterInfoContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"
import SpellCheckboxes from "./SpellCheckboxes";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export const SpellList = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  // is this doing anything usefull?
  useEffect(() => {
  }, [characterInfo]);

  const toggleModal = (spellLevel) => {
    setSpells(spells => ({
      ...spells,
      [spellLevel]: {
        ...spells[spellLevel],
        showModal: !spells[spellLevel].showModal
      }
    }));
    console.log('true/false', spells[spellLevel].showModal)
  };

  const [spells, setSpells] = React.useState({
    0: {showModal: false, classSpells: []},
    1: {showModal: false, classSpells:[]},
    2: {showModal: false, classSpells:[]},
    3: {showModal: false, classSpells:[]},
    4: {showModal: false, classSpells:[]},
    5: {showModal: false, classSpells:[]},
    6: {showModal: false, classSpells:[]},
    7: {showModal: false, classSpells:[]},
    8: {showModal: false, classSpells:[]},
    9: {showModal: false, classSpells:[]},
  })

  const renderPrepareSpellsButton = (spellLevel) => {
    // Button doesn't render if server isn't running
    return (
      <div>
        <button onClick={() => toggleModal(spellLevel)}>{spells[spellLevel].showModal ? 'Close Spell List' : 'Prepare more spells'}</button>
          {spells[spellLevel].showModal ? <AddSpellModal 
            isModalOpen={spells[spellLevel].showModal} 
            onClose={() =>toggleModal(spellLevel)} 
            spellLevel={spellLevel}
            spells={spells[spellLevel].classSpells}
          /> : null}
      </div>
    )
  }

  const renderSpellModal = (spellLevel) => {
    if (spells[spellLevel].classSpells.length === 0) {
      console.log('if statement renderSpellModal')
      axios.get(`http://localhost:3001/allspells/${spellLevel}/${characterInfo.characterClass}`)
      .then(res => {
        setSpells(spells => ({ ...spells, [spellLevel]: { ...spells[spellLevel], classSpells: res.data.results}}));
        return(
        <div>
          {renderPrepareSpellsButton(spellLevel)}
        </div>
        )
      })
      .catch(error => {
      });
    } else {
      return(
        <div>
          {renderPrepareSpellsButton(spellLevel)}
        </div>
      )
    }
  }
  
  //***NEED SPECIAL CONDITION*** for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const renderPCSpells = (spellLevel, numericalSpellLevel) => {
    // Maybe clean up this? needs to have some way of checking for nonCaster since they are not on the spellTables and will likely cause an error from the other if statement
        // Maybe add them to the spell Tables with all spells as 0 as a possible solution
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
    } else if (spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel] !== 0) {
      return (
        <div>
          <div>
            <h3>
              {spellLevel} {spellLevel === 'cantrips' ? 'known:' : 'level spell slots:'} {spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]}
            </h3>
              <SpellCheckboxes spellLevel={spellLevel}/> 
          </div>
          {renderPreparedSpells(numericalSpellLevel)}
          {renderSpellModal(numericalSpellLevel)}
        </div>
      );
    }
  };

  //***NEED FEATURE*** */ function to drop spell from spellsPrepared state
  const renderPreparedSpells = (numericalSpellLevel) => {
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
