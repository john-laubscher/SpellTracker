import * as React from 'react';
import Button from '@mui/material/Button';
import { CharacterInfoContext } from "../../Contexts/Context";
import {useContext} from 'react'
import { useState } from 'react';
import { makeStyles } from '@mui/styles';

export const togglePreparedSpellBtnStyle = makeStyles((theme) => ({
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

export const PrepareSpellButton = ({numericalSpellLevel, spell, index}) => {

    const [clickedButtons, setClickedButtons] = useState([]); // State for tracking clicked buttons
    
    const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
    const isButtonClicked = clickedButtons.includes(`add-${index}`);
    const isRemoveClicked = clickedButtons.includes(`remove-${index}`);

    const isSpellAlreadyPrepared = characterInfo.spellsPrepared[numericalSpellLevel]?.some(
        (preparedSpell) => preparedSpell.index === spell.index
      );

    const togglePreparedSpell = (spell, numericalSpellLevel) => {
        const isSpellAlreadyPrepared = characterInfo.spellsPrepared[numericalSpellLevel]?.some((preparedSpellList) => preparedSpellList.index === spell.index)
        if(!isSpellAlreadyPrepared) {
          setCharacterInfo((characterInfo) => ({
            ...characterInfo,
            spellsPrepared: {
              ...characterInfo.spellsPrepared,
              [numericalSpellLevel]: [...characterInfo.spellsPrepared[numericalSpellLevel], spell],
            },
          }));
          // else unprepares the spell
        } else {
          console.log("You un-prepared the spell")
          setCharacterInfo((characterInfo) => {
            const updatedSpellsPrepared = characterInfo.spellsPrepared[numericalSpellLevel].filter(
              (preparedSpell) => preparedSpell.index !== spell.index
            );
      
            return {
              ...characterInfo,
              spellsPrepared: {
                ...characterInfo.spellsPrepared,
                [numericalSpellLevel]: updatedSpellsPrepared,
              },
            };
          });
        }
      }

    const classes = togglePreparedSpellBtnStyle();

    return (
            <Button
              className={`${classes.prepareButton} ${isButtonClicked ? 'flashAdd' : ''} ${
                isRemoveClicked ? 'flashRemove' : ''
              }`}
              variant="contained"
              color="primary"
              onClick={() => {

                if (isSpellAlreadyPrepared) {
                  setClickedButtons([...clickedButtons, `remove-${index}`]); // Add the button to clickedButtons with the "remove-" prefix
                  togglePreparedSpell(spell, numericalSpellLevel);
                  setTimeout(() => {
                    setClickedButtons(clickedButtons.filter((btnIndex) => btnIndex !== `remove-${index}`)); // Remove the button from clickedButtons
                  }, 300); // Reset after 300ms (adjust the duration as needed)
                } else {
                  setClickedButtons([...clickedButtons, `add-${index}`]); // Add the button to clickedButtons with the "add-" prefix
                  togglePreparedSpell(spell, numericalSpellLevel);
                  setTimeout(() => {
                    setClickedButtons(clickedButtons.filter((btnIndex) => btnIndex !== `add-${index}`)); // Remove the button from clickedButtons
                  }, 300); // Reset after 300ms (adjust the duration as needed)
                }
              }}
            >
              {isSpellAlreadyPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
            </Button>
    )
}

