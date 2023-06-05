import * as React from 'react';
import {useContext} from 'react'
import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// ***NEED FEATURE*** spells  modals or popover, or expansion panels
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


  // ////////////This should work along with backend, but need to refactor into a modal component or some other option
  // const renderSpellTooltip = (spellName, spell_index) => {
  //   console.log('SPELLINDEX FE', spellName)
  //   axios.get(`http://localhost:3001/singlespell/${spell_index}`)
  //     .then(res => {    
  //       console.log('INDIVIDUALSPELL .RES', res)    
  //     })
  // }

    // Name, desc, range, components, concentration?, ritual?, casting time, duration,

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
// maybe have them all use checkmarks, and then all at once add to the spell list all at once with a single Prepare Spells button?
    return spells.map((spell, index) => {
        return(
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header" 
                // ARIA-CONTROLS AND ID SHOULD BE THE DYNAMIC `${SPELL.INDEX}-CONTENT` (ID ENDS WITH HEADER, ARIA-CONTROLS IS CONTENT)
              >
                <Typography>{spell.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  HERE IS THE ACCORDIAN DESCRIPTION--PUT SPELL INFO HERE
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Button
              variant="contained"
              color="primary"
              className={classes.prepareButton}
              onClick={() => prepareSpell(spell, spellLevel)}
            >
              Prepare Spell
            </Button>
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