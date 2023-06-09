import * as React from 'react';
import { useEffect, useState } from 'react';
import {useContext} from 'react'
import { CharacterInfoContext, ClassSpellsDetailsContext } from "../../Contexts/Context";
import SpellAccordian from './SpellAccordian';

import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// ***COMPLETED FEATURE*** spells  modals or popover, or expansion panels  COMPLETED 6/5: could use 
// ***NEED FEATURE*** button to move a spell off of the prepared spells list and clear all spells
// ***NEED FEATURE*** small success modal that pops up when a spell is added successfully to the list (maybe also closes the addspells modal?)
// ***NEED FEATURE*** small modal that pops up when you try to prepare a spell past your max amount prepared

const AddSpellsModal = ({ isModalOpen, onClose, spellLevel, spells }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const { classSpellsDetails, setClassSpellsDetails } = useContext(ClassSpellsDetailsContext)
  const [isClicked, setIsClicked] = useState(false);
  const [clickedButtons, setClickedButtons] = React.useState([]); // State for tracking clicked buttons


  
  useEffect(() => {
  }, [spells]);

  const togglePreparedSpell = (spell, spellLevel) => {
    const isSpellAlreadyPrepared = characterInfo.spellsPrepared[spellLevel].some((preparedSpellList) => preparedSpellList.index === spell.index)
    if(!isSpellAlreadyPrepared) {
      setCharacterInfo((characterInfo) => ({
        ...characterInfo,
        spellsPrepared: {
          ...characterInfo.spellsPrepared,
          [spellLevel]: [...characterInfo.spellsPrepared[spellLevel], spell],
        },
      }));
      // else unprepares the spell
    } else {
      console.log("You un-prepared the spell")
      setCharacterInfo((characterInfo) => {
        const updatedSpellsPrepared = characterInfo.spellsPrepared[spellLevel].filter(
          (preparedSpell) => preparedSpell.index !== spell.index
        );
  
        return {
          ...characterInfo,
          spellsPrepared: {
            ...characterInfo.spellsPrepared,
            [spellLevel]: updatedSpellsPrepared,
          },
        };
      });
    }
  }

  const togglePreparedSpellBtnStyle = makeStyles((theme) => ({
    prepareButton: {
      fontSize: '14px',
      padding: '6px 16px',
      borderRadius: '4px',
      textTransform: 'none',
      backgroundColor: '#a881af',
      color: '#fff',
      transition: 'background-color 0.5s ease-in-out', // CSS transition for smooth color change
      '&:hover': {
        backgroundColor: '#80669d',
      },
      '&.flashAdd': {
        backgroundColor: 'green',
      },
      '&.flashRemove': {
        backgroundColor: 'red',
      },
    },
  }));

  const renderSpells = () => {
    const classes = togglePreparedSpellBtnStyle();

// maybe have them all use checkmarks, and then all at once add to the spell list all at once with a single Prepare Spells button?
    return spells.map((spell, index) => {
      console.log('accordian props', spell)

      const isSpellAlreadyPrepared = characterInfo.spellsPrepared[spellLevel].some(
        (preparedSpell) => preparedSpell.index === spell.index
      );

      const isButtonClicked = clickedButtons.includes(`add-${index}`);
      const isRemoveClicked = clickedButtons.includes(`remove-${index}`);

        return(
          <div key={index}>
            <Button
              className={`${classes.prepareButton} ${isButtonClicked ? 'flashAdd' : ''} ${
                isRemoveClicked ? 'flashRemove' : ''
              }`}
              variant="contained"
              color="primary"
              onClick={() => {

                if (isSpellAlreadyPrepared) {
                  setClickedButtons([...clickedButtons, `remove-${index}`]); // Add the button to clickedButtons with the "remove-" prefix
                  togglePreparedSpell(spell, spellLevel);
                  setTimeout(() => {
                    setClickedButtons(clickedButtons.filter((btnIndex) => btnIndex !== `remove-${index}`)); // Remove the button from clickedButtons
                  }, 300); // Reset after 300ms (adjust the duration as needed)
                } else {
                  setClickedButtons([...clickedButtons, `add-${index}`]); // Add the button to clickedButtons with the "add-" prefix
                  togglePreparedSpell(spell, spellLevel);
                  setTimeout(() => {
                    setClickedButtons(clickedButtons.filter((btnIndex) => btnIndex !== `add-${index}`)); // Remove the button from clickedButtons
                  }, 300); // Reset after 300ms (adjust the duration as needed)
                }
              }}
            >
              {isSpellAlreadyPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
            </Button>
            <SpellAccordian
              spellLevel={spellLevel}
              spell={spell}
            />
          </div>
        )
      })
    }

  return (
    <Dialog onClose={onClose} open={isModalOpen}>
      <DialogTitle>Choose spells to prepare</DialogTitle>
      <List sx={{ pt: 0 }}>
        {renderSpells()}
        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={onClose}>
            <ListItemText primary="Exit Spell List" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default AddSpellsModal