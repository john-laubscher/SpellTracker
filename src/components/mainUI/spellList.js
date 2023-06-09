import React, { useContext, useEffect } from "react";
import axios from 'axios';

import { CharacterInfoContext, ClassSpellsDetailsContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"
import SpellCheckboxes from "./SpellCheckboxes";

import SpellAccordian from './SpellAccordian';

export const SpellList = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);
  const { classSpellsDetails, setClassSpellsDetails } = useContext(ClassSpellsDetailsContext)

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

  const fetchClassSpellsDetails = (spellLevel, spells) => {
    const fetchDetails = async () => {

      const spellPromises = spells.map((spell) =>
        axios.get(`http://localhost:3001/singlespell/${spell.index}`)
      );
  
      try {
        // Promise.all fetches requests concurrently so we can reduce overall wait time
        const spellResponses = await Promise.all(spellPromises);
        const spellsDetails = {};
        console.log('HOW OFTEN IS IT RUNNING?')
        spellResponses.forEach((response, index) => {
          const spellDetail = response.data;
          const spell = spells[index];

          spellsDetails[spell.index] = { ...spellDetail};
        });
        setClassSpellsDetails(classSpellsDetails => ({
          ...classSpellsDetails,
          [spellLevel]: spellsDetails
        }));

      } catch (error) {
        console.log('Error fetching spell details:', error);
      }
    };
    if (classSpellsDetails[spellLevel].length === 0) {
      fetchDetails();
    }
  }

  const renderSpellModal = (spellLevel) => {
    if (spells[spellLevel].classSpells.length === 0) {
      console.log('if statement renderSpellModal')
      axios.get(`http://localhost:3001/allspells/${spellLevel}/${characterInfo.characterClass}`)
      .then(res => {
        // get list of class spells into state
        let fetchedSpellsArr = res.data.results
        console.log('fetchedspells', fetchedSpellsArr)
        console.log('SPELLDETAILS-STATE', classSpellsDetails)

        setSpells(spells => ({ ...spells, [spellLevel]: { ...spells[spellLevel], classSpells: fetchedSpellsArr}}));
        // get spell details from list of class spells
        fetchClassSpellsDetails(spellLevel, fetchedSpellsArr)
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
      // this elseif should keep the functions from running once for each level
        // - the elements are rendering correctly and the correct number of times, but the renderSpellModal is always running 10 times (once for each spell level)
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

  const renderPreparedSpells = (numericalSpellLevel) => {
    return (
      <div>
        {characterInfo.spellsPrepared[numericalSpellLevel].map((spell, index) => (
          <SpellAccordian
            spellLevel={numericalSpellLevel}
            spell={spell}
        />
        ))}
      </div>
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
