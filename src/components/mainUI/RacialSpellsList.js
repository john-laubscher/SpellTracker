// NEEED FEATURES
    // New section for racial spells
    // refactor RacesData keys for 1/LR spells 
        // Tooltip over the checkmark?
    // refactor RacesData keys for Spells Added to Prepared Spells List
    // List Racial Prepared Spells with a symbol or grayed out to differentiate them from other prepared spells
        // Tooltip over symbol or spell to show they are prepared as part of your race/subrace (list specifically which one)
 
import React, { useContext, useEffect } from "react";
import axios from 'axios';


import { subRaceSpells } from "../RacesData";

import { CharacterInfoContext, ClassSpellsDetailsContext } from "../../Contexts/Context";
import spellTables from "../spellTables";




const PrepareSubraceSpells = () => {

    const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

    

    if (subRaceSpells[characterInfo.race].hasOwnProperty(characterInfo.subrace)) {
      // just for prepared spells, not 1x/LR spells
      // shouldn't need to worry about non-caster, they don't have access to the spellList anyway.

      // determine if character has access to Level of spell based on characterLevel
      const myCharSpellTable = spellTables[characterInfo.characterClass][characterInfo.characterLevel];
      const subRSpells = subRaceSpells[characterInfo.race][characterInfo.subrace].additionalPreparedSpells;
      let availableSubraceSpells = [];

      for (const spellLevel in myCharSpellTable) {
        // this excludes the cantrip and spellsKnown keys in the spellTables.js
        // if the character has access to that spell Level, then the spells are pushed into the array
        if (spellLevel !== 'cantrips' && spellLevel !== 'spellsKnown' && myCharSpellTable[spellLevel] > 0 && subRSpells.hasOwnProperty(spellLevel)) {
          availableSubraceSpells.push(...subRSpells[spellLevel]);
          console.log('avail SR Spells', availableSubraceSpells);
        }
      }

      Promise.all(
        availableSubraceSpells.map((spell) => axios.get(`http://localhost:3001/singlespell/${spell}`))
      )
        .then((spellDataResponses) => {
          spellDataResponses.forEach((spellDataResponse, index) => {
            const spellDetails = spellDataResponse.data;

            console.log('SPELLDETAILS', spellDetails)
            console.log('spellLevel', spellDetails.level)
  
            // something is going wrong with this --not updating correctly. line 59 is trying to iterate??
            setCharacterInfo((prevCharacterInfo) => ({
              ...prevCharacterInfo,
              spellsPrepared: {
                ...prevCharacterInfo.spellsPrepared,
                [spellDetails.level]: [
                  ...(prevCharacterInfo.spellsPrepared[spellDetails.level] || []),
                  ...spellDetails,
                ],
              },
            }));
          });
        })
        .catch((error) => {
          console.error('Error fetching spell data:', error);
          // Handle the error condition as needed
        });

        // const spellDataPromises = availableSubraceSpells.map((spell) =>
        // axios.get(`http://localhost:3001/singlespell/${spell.index}`)
        // );

        // const spellDataResponses = Promise.all(spellDataPromises);

        // spellDataResponses.forEach((spellDetails, index) => {
        // // const spellLevel = spellDataResponses[index].level;
        // // const newSpellData = response.data;
        // console.log('SPELLDETAILS', spellDetails)

        // setCharacterInfo((prevCharacterInfo) => ({
        //   ...prevCharacterInfo,
        //   spellsPrepared: {
        //     ...prevCharacterInfo.spellsPrepared,
        //     [spellLevel]: [
        //       ...(prevCharacterInfo.spellsPrepared[spellLevel] || []),
        //       newSpellData,
        //     ],
        //   },
        // }));
        // });
    


    //   const fetchDataAndUpdateState = async (spells) => {
    //     try {
    //       const spellDataPromises = spells.map((spell) =>
    //         axios.get(`http://localhost:3001/singlespell/${spell.index}`)
    //       );
      
    //       const spellDataResponses = await Promise.all(spellDataPromises);
      
    //       spellDataResponses.forEach((spellDetails, index) => {
    //         // const spellLevel = spellDataResponses[index].level;
    //         // const newSpellData = response.data;
    //         console.log('SPELLDETAILS', spellDetails)

    //         // setCharacterInfo((prevCharacterInfo) => ({
    //         //   ...prevCharacterInfo,
    //         //   spellsPrepared: {
    //         //     ...prevCharacterInfo.spellsPrepared,
    //         //     [spellLevel]: [
    //         //       ...(prevCharacterInfo.spellsPrepared[spellLevel] || []),
    //         //       newSpellData,
    //         //     ],
    //         //   },
    //         // }));
    //       });
    //     } catch (error) {
    //       console.error('Error fetching spell data:', error);
    //       // Handle the error condition as needed
    //     }
    //   };


      // fetchSubraceSpells(availableSubraceSpells)
      // if availableSubraceSpell.length > 0, make api call and push into prepared spells
      // continue process for all levels of subrace spells,
      // Then iterate over each item, make the api call, set the spell into characterInfo.spellsPrepared

      // Alternatively, make the api call after each one is checked, starting from lowest, and stopping when player doesn't have access to higher level
      console.log('test1: subrace has spells')
    } else {
      console.log('test2: subrace has NO spells')

      // The subrace is not present in the object
    }
    return (
      <h3>
          SUBRACE SPELL LIST
      </h3>
    )
  }

// Assuming you have access to the `characterInfo` state and `setCharacterInfo` setter function

  const renderDailySpellsList = () => {
    return(
        <h3>DAILY SUBRACE SPELL LIST</h3>
    )
  }

  const fetchSubraceSpells = (subSpells) => {
    PrepareSubraceSpells()
    // console.log(characterInfo.spellsPrepared)
  }

  export {PrepareSubraceSpells, renderDailySpellsList}