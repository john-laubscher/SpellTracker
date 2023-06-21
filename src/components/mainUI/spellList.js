import React, { useContext, useEffect } from "react";
import axios from 'axios';

import Button from '@mui/material/Button';

import { CharacterInfoContext, ClassSpellsDetailsContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import { subRaceSpells } from "../RacesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"
import SpellCheckboxes from "./SpellCheckboxes";
import {PrepareSpellButton, togglePreparedSpellBtnStyle} from "./PrepareSpellButton";
import SpellAccordian from './SpellAccordian';

export const SpellList = (props) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const { classSpellsDetails, setClassSpellsDetails } = useContext(ClassSpellsDetailsContext)

  // is this doing anything usefull?
  useEffect(() => {
  }, [characterInfo]);

  const toggleModal = (numericalSpellLevel) => {
    setSpells(spells => ({
      ...spells,
      [numericalSpellLevel]: {
        ...spells[numericalSpellLevel],
        showModal: !spells[numericalSpellLevel].showModal
      }
    }));
    console.log('true/false', spells[numericalSpellLevel].showModal)
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

  const showClassSpellsButton = (numericalSpellLevel) => {
    // Button doesn't render if server isn't running
    return (
      <div>
        {/* ***NEED FEATURE*** Adjust verbiage based on each class ie: wizards don't prepare spells--they would adjust their spellbook or something like that */}
        <button onClick={() => toggleModal(numericalSpellLevel)}>{spells[numericalSpellLevel].showModal ? 'Close Spell List' : 'Prepare more spells'}</button>
          {spells[numericalSpellLevel].showModal ? <AddSpellModal 
            isModalOpen={spells[numericalSpellLevel].showModal} 
            onClose={() =>toggleModal(numericalSpellLevel)} 
            numericalSpellLevel={numericalSpellLevel}
            spells={spells[numericalSpellLevel].classSpells}
          /> : null}
      </div>
    )
  }

  const fetchClassSpellsDetails = (numericalSpellLevel, spells) => {
    const fetchDetails = async () => {

      const spellPromises = spells.map((spell) =>
        axios.get(`http://localhost:3001/singlespell/${spell.index}`)
      );
  
      try {
        // Promise.all fetches requests concurrently so we can reduce overall wait time
        const spellResponses = await Promise.all(spellPromises);
        const spellsDetails = {};
        // console.log('HOW OFTEN IS IT RUNNING?')
        spellResponses.forEach((response, index) => {
          const spellDetails = response.data;
          const spell = spells[index];

          spellsDetails[spell.index] = { ...spellDetails};
        });
        setClassSpellsDetails(classSpellsDetails => ({
          ...classSpellsDetails,
          [numericalSpellLevel]: spellsDetails
        }));

      } catch (error) {
        console.log('Error fetching spell details:', error);
      }
    };
    if (classSpellsDetails[numericalSpellLevel].length === 0) {
      fetchDetails();
    }
  }

  const renderSpellModal = (numericalSpellLevel) => {
    if (spells[numericalSpellLevel].classSpells.length === 0) {
      axios.get(`http://localhost:3001/allspells/${numericalSpellLevel}/${characterInfo.characterClass}`)
      .then(res => {
        // get list of class spells into state
        let fetchedSpellsArr = res.data.results

        setSpells(spells => ({ ...spells, [numericalSpellLevel]: { ...spells[numericalSpellLevel], classSpells: fetchedSpellsArr}}));
        // get spell details from list of class spells
        fetchClassSpellsDetails(numericalSpellLevel, fetchedSpellsArr)
        return(
        <div>
          {showClassSpellsButton(numericalSpellLevel)}
        </div>
        )
      })
      .catch(error => {
      });
    } else {
      return(
        <div>
          {showClassSpellsButton(numericalSpellLevel)}
        </div>
      )
    }
  }

  const unprepareAllSpells = () => {
    setCharacterInfo((prevCharacterInfo) => ({
      ...prevCharacterInfo,
      spellsPrepared: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
      },
    }));
  };

  const classes = togglePreparedSpellBtnStyle();
  // ***NEED FEATURE--CRITICAL--*** some subrace spells are not in the api, so will need a condition that instead shows a message saying that the description is not available
  //***NEED SPECIAL CONDITION*** for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const renderPCSpells = (textualSpellLevel, numericalSpellLevel) => {
    // console.log('NUMERICALSPELLLVL1', numericalSpellLevel)
    // Maybe clean up this? needs to have some way of checking for nonCaster since they are not on the spellTables and will likely cause an error from the other if statement
        // Maybe add them to the spell Tables with all spells as 0 as a possible solution
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
      // this elseif should keep the functions from running once for each level
        // - the elements are rendering correctly and the correct number of times, but the renderSpellModal is always running 10 times (once for each spell level)
    } else if (spellTables[characterInfo.characterClass][characterInfo.characterLevel][textualSpellLevel] !== 0) {
      return (
        <div>
          <div>
            <h3>
              {textualSpellLevel} {textualSpellLevel === 'cantrips' ? 'known:' : 'level spell slots:'} {spellTables[characterInfo.characterClass][characterInfo.characterLevel][textualSpellLevel]}
            </h3>
              <SpellCheckboxes textualSpellLevel={textualSpellLevel}/> 
          </div>
          {renderPreparedSpells(numericalSpellLevel)}
          {renderSpellModal(numericalSpellLevel)}
        </div>
      );
    }
  };

  // const prepareSubraceSpells = () => {
  //   if (subRaceSpells[characterInfo.race].hasOwnProperty(characterInfo.subrace)) {
  //     console.log('HERE??')
  //     // just for prepared spells, not 1x/LR spells
  //     // shouldn't need to worry about non-caster, they don't have access to the spellList anyway.

  //     // determine if character has access to Level of spell based on characterLevel
  //     const myCharSpellTable = spellTables[characterInfo.characterClass][characterInfo.characterLevel];
  //     const subRSpells = subRaceSpells[characterInfo.race][characterInfo.subrace].additionalPreparedSpells;
  //     let availableSubraceSpells = [];

  //     for (const spellLevel in myCharSpellTable) {
  //       // this excludes the cantrip and spellsKnown keys in the spellTables.js
  //       // if the character has access to that spell Level, then the spells are pushed into the array
  //       if (spellLevel !== 'cantrips' && spellLevel !== 'spellsKnown' && myCharSpellTable[spellLevel] > 0 && subRSpells.hasOwnProperty(spellLevel)) {
  //         availableSubraceSpells.push(...subRSpells[spellLevel]);
  //         console.log('availSpells', availableSubraceSpells);
  //       }
  //     }
  //     // fetchSubraceSpells(availableSubraceSpells)
  //     // if availableSubraceSpell.length > 0, make api call and push into prepared spells
  //     // continue process for all levels of subrace spells,
  //     // Then iterate over each item, make the api call, set the spell into characterInfo.spellsPrepared

  //     // Alternatively, make the api call after each one is checked, starting from lowest, and stopping when player doesn't have access to higher level
  //     console.log('test1: subrace has spells')
  //   } else {
  //     console.log('test2: subrace has NO spells')

  //     // The subrace is not present in the object
  //   }
  // }

  // const fetchSubraceSpells = (subSpells) => {
  //   // console.log(characterInfo.spellsPrepared)
  // }

  const renderPreparedSpells = (numericalSpellLevel) => {
    // prepareSubraceSpells()
    // console.log('ERROR?', characterInfo.spellsPrepared[numericalSpellLevel])
    console.log('TEST2 SPELLLVL', numericalSpellLevel)
    console.log('STATE', characterInfo.spellsPrepared[numericalSpellLevel])
    return (
      <div>
        {characterInfo.spellsPrepared[numericalSpellLevel].map((spell, index) => (
          <div>
            <PrepareSpellButton
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              index={index}
            />
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <p>Spell Tracker Section</p>
      <Button
        className={classes.prepareButton}
        variant="contained"
        color="primary"
        onClick={unprepareAllSpells}
      >
      Unprepare ALL Spells
    </Button>
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
