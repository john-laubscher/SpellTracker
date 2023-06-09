import * as React from 'react';
import { useEffect } from 'react';

import SpellAccordian from './SpellAccordian';
import PrepareSpellButton from './PrepareSpellButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// ***COMPLETED FEATURE*** spells  modals or popover, or expansion panels  COMPLETED 6/5: could use 
// ***COMPLETED FEATURE*** button to move a spell off of the prepared spells list 
// ***NEED FEATURE*** button to clear all spells
// ***COMPOLETED FEATURE*** button changes color to indicate added successfully to the list, and when one is unprepared (maybe switch wording to drop spell?)
// ***NEED FEATURE*** small tooltip that pops up when you try to prepare a spell past your max amount prepared, maybe button shakes too?
// ***POSSIBLE FEATURE*** maybe have some more evident indication that the spell is already prepared

const AddSpellsModal = ({ isModalOpen, onClose, spellLevel, spells }) => {

  useEffect(() => {
  }, [spells]);

  const renderSpells = () => {
// maybe have them all use checkmarks, and then all at once add to the spell list all at once with a single Prepare Spells button?
    return spells.map((spell, index) => {
      console.log('accordian props', spell)

        return(
          <div key={index}>
            <PrepareSpellButton
              spell={spell}
              spellLevel={spellLevel}
              index={index}
            />
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