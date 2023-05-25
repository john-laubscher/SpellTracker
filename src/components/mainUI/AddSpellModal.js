import * as React from 'react';
import {useContext} from 'react'
import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// ***NEED FEATURE*** spells need tooltips
// ***NEED FEATURE*** button to move a spell off of the prepared spells list
// ***NEED FEATURE*** small success modal that pops up when a spell is added successfully to the list (maybe also closes the addspells modal?)

const AddSpellsModal = ({ isModalOpen, onClose, spellLevel, spells }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

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

  const renderSpells = () => {
      return spells.map((spell, index) => {
        return(
        <ListItem disableGutters>
          <ListItemButton onClick={() => prepareSpell(spell, spellLevel)} key={index}>
            <ListItemText primary={spell.name} />
          </ListItemButton>
        </ListItem>
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