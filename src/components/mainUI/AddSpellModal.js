import * as React from 'react';
import { useState, useEffect } from 'react';
import {useContext} from 'react'
import { CharacterInfoContext, ClassSpellsDetailsContext } from "../../Contexts/Context";
import axios from 'axios';


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

// ***COMPLETED FEATURE*** spells  modals or popover, or expansion panels  COMPLETED 6/5: could use 
// ***NEED FEATURE*** button to move a spell off of the prepared spells list and clear all spells
// ***NEED FEATURE*** small success modal that pops up when a spell is added successfully to the list (maybe also closes the addspells modal?)
// ***NEED FEATURE*** small modal that pops up when you try to prepare a spell past your max amount prepared

const AddSpellsModal = ({ isModalOpen, onClose, spellLevel, spells }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const { classSpellsDetails, setClassSpellsDetails } = useContext(ClassSpellsDetailsContext)
  
  // const [classSpellsDetails, setclassSpellsDetails] = useState({});

  useEffect(() => {
    console.log('USEEFFECT')
    const fetchClassSpellsDetails = async () => {
      // add if statement about whether state at that spell level is already filled
      const spellPromises = spells.map((spell) =>
        axios.get(`http://localhost:3001/singlespell/${spell.index}`)
      );
  
      try {
        // Promise.all fetches requests concurrently so we can reduce overall wait time
        const spellResponses = await Promise.all(spellPromises);
        const spellsDetails = {};
  
        spellResponses.forEach((response, index) => {
          const spellDetail = response.data;
          const spell = spells[index];
          spellsDetails[spell.index] = { ...spellDetail};
        });
        console.log('spellsDetails:', spellsDetails)
        setClassSpellsDetails(classSpellsDetails => ({
          ...classSpellsDetails,
          [spellLevel]: spellsDetails
        }));
      } catch (error) {
        console.log('Error fetching spell details:', error);
      }
    };

    fetchClassSpellsDetails();
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
// maybe have them all use checkmarks, and then all at once add to the spell list all at once with a single Prepare Spells button?
    return spells.map((spell, index) => {
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
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${spell.index}-content`}
                id={`${spell.index}-header`} 
              >
                <Typography>{spell.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><strong>Range:</strong> {classSpellsDetails[spellLevel][spell.index]?.range}</p>
                  <p><strong>Duration:</strong> {classSpellsDetails[spellLevel][spell.index]?.duration}</p>
                  <p><strong>Casting time:</strong> {classSpellsDetails[spellLevel][spell.index]?.casting_time}</p>
                  <p><strong>Spell components:</strong> {classSpellsDetails[spellLevel][spell.index]?.components.join(', ')}</p>
                  {classSpellsDetails[spellLevel][spell.index]?.concentration ? (
                    <p style={{ fontStyle: 'italic' }}><strong>Concentration</strong></p>
                    ) : null}
                  {classSpellsDetails[spellLevel][spell.index]?.ritual ? (
                    <p style={{ fontStyle: 'italic' }}><strong>Ritual</strong></p>
                    ) : null}
                  <p>{classSpellsDetails[spellLevel][spell.index]?.desc}</p>
                </Typography>
              </AccordionDetails>
            </Accordion>
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