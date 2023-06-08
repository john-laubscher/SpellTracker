import * as React from 'react';
import { useEffect } from 'react';
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
  
  useEffect(() => {
  }, [spells]);

  const prepareSpell = (spell, spellLevel) => {
    const isSpellAlreadyPrepared = characterInfo.spellsPrepared[spellLevel].some((preparedSpellList) => preparedSpellList.index === spell.index)
    if(!isSpellAlreadyPrepared) {
      setCharacterInfo((characterInfo) => ({
        ...characterInfo,
        spellsPrepared: {
          ...characterInfo.spellsPrepared,
          [spellLevel]: [...characterInfo.spellsPrepared[spellLevel], spell],
        },
      }));
    } else {
      console.log("You already have that spell prepared")
    }
  }

  const prepareSpellBtnStyle = makeStyles((theme) => ({
    prepareButton: {
      fontSize: '14px',
      padding: '6px 16px',
      borderRadius: '4px',
      textTransform: 'none',
      backgroundColor: '#a881af',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#80669d',
      },
    },
  }));

  const renderSpells = () => {
    const classes = prepareSpellBtnStyle();
    console.log('ALLSPELLS', spells)
    console.log('STATE', classSpellsDetails)
    console.log('accordian props', spellLevel)

// maybe have them all use checkmarks, and then all at once add to the spell list all at once with a single Prepare Spells button?
    return spells.map((spell, index) => {
      console.log('accordian props', spell)

        return(
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.prepareButton}
              onClick={() => prepareSpell(spell, spellLevel)}
              // modify prepareSpell function to change and allow it to be unprepared
            >
              Prepare Spell
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