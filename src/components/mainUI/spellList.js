import React, { useContext, useEffect } from "react";
import axios from 'axios';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CharacterInfoContext, ClassSpellsDetailsContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import { subRaceSpells } from "../RacesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"
import SpellCheckboxes from "./SpellCheckboxes";
import {PrepareSpellButton, togglePreparedSpellBtnStyle} from "./PrepareSpellButton";
import SpellAccordian from './SpellAccordian';
import {PrepareSubraceSpells, renderDailySpellsList} from './RacialSpellsList'

const spellLevelColors = {
  0: '#607d8b',
  1: '#1565c0',
  2: '#2e7d32',
  3: '#f9a825',
  4: '#ef6c00',
  5: '#c62828',
  6: '#6a1b9a',
  7: '#283593',
  8: '#4e342e',
  9: '#b71c1c',
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

//**Needs to account for classFeatures like Bard's Magical Secrets that allows for additional spells added to spell list. Might be just a bard thing, but possibly more classes */

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
    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          onClick={() => toggleModal(numericalSpellLevel)}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            fontFamily: "'Cinzel', serif",
            color: '#5d4037',
            borderColor: 'rgba(139,69,19,0.4)',
            '&:hover': { borderColor: '#8B4513', backgroundColor: 'rgba(139,69,19,0.06)' },
          }}
        >
          {spells[numericalSpellLevel].showModal ? 'Close Spell List' : 'Prepare more spells'}
        </Button>
        {spells[numericalSpellLevel].showModal ? <AddSpellModal
          isModalOpen={spells[numericalSpellLevel].showModal}
          onClose={() => toggleModal(numericalSpellLevel)}
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
    if (ClassesData[characterInfo.characterClass].isSpellCaster === "nonCaster") {
      return null;
    } else if (spellTables[characterInfo.characterClass][characterInfo.characterLevel][textualSpellLevel] !== 0) {
      const levelColor = spellLevelColors[numericalSpellLevel] || '#607d8b';
      const slotCount = spellTables[characterInfo.characterClass][characterInfo.characterLevel][textualSpellLevel];
      const isCantrips = textualSpellLevel === 'cantrips';
      const heading = isCantrips
        ? `Cantrips Known: ${slotCount}`
        : `${capitalize(textualSpellLevel)} Level Spell Slots`;

      return (
        <Box
          sx={{
            borderLeft: `4px solid ${levelColor}`,
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.45)',
            mb: 1.5,
            px: 1.5,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: '15px',
              color: levelColor,
            }}>
              {heading}
            </Typography>
            {!isCantrips && (
              <SpellCheckboxes textualSpellLevel={textualSpellLevel} slotCount={slotCount} />
            )}
          </Box>
          {renderPreparedSpells(numericalSpellLevel)}
          <Box sx={{ mt: 0.5 }}>
            {renderSpellModal(numericalSpellLevel)}
          </Box>
        </Box>
      );
    }
  };



  const renderPreparedSpells = (numericalSpellLevel) => {
    return (
      <div>
        {characterInfo.spellsPrepared[numericalSpellLevel].map((spell, index) => (
          <div key={spell.index}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              actionButton={
                <PrepareSpellButton
                  numericalSpellLevel={numericalSpellLevel}
                  spell={spell}
                  index={index}
                />
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: '18px',
          color: '#3e2723',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Spell Tracker
        </Typography>
        <Button
          className={classes.prepareButton}
          variant="contained"
          size="small"
          onClick={unprepareAllSpells}
          sx={{ textTransform: 'none', fontSize: '11px' }}
        >
          Unprepare All
        </Button>
      </Box>
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
      {renderDailySpellsList()}
    </Box>
  );
};

export default SpellList;
