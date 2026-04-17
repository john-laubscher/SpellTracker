import * as React from 'react';
import Button from '@mui/material/Button';
import { CharacterInfoContext } from "../../Contexts/Context";
import {useContext} from 'react'
import { useState } from 'react';
import { makeStyles } from '@mui/styles';

export const togglePreparedSpellBtnStyle = makeStyles((theme) => ({
    prepareButton: {
        fontSize: '12px',
        padding: '2px 10px',
        borderRadius: '4px',
        textTransform: 'none',
        backgroundColor: '#a881af',
        color: '#fff',
        minWidth: 'auto',
        lineHeight: 1.4,
        transition: 'background-color 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: '#80669d',
        },
        '&.flashRemove': {
            backgroundColor: '#c62828',
        },
    },
    preparedButton: {
        fontSize: '12px',
        padding: '2px 10px',
        borderRadius: '4px',
        textTransform: 'none',
        backgroundColor: '#2e7d32',
        color: '#fff',
        minWidth: 'auto',
        lineHeight: 1.4,
        transition: 'background-color 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: '#1b5e20',
        },
        '&.flashRemove': {
            backgroundColor: '#c62828',
        },
    },
    }));

export const PrepareSpellButton = ({numericalSpellLevel, spell, index}) => {

    const [clickedButtons, setClickedButtons] = useState([]); // State for tracking clicked buttons
    
    const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
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

    const buttonClass = isSpellAlreadyPrepared ? classes.preparedButton : classes.prepareButton;

    return (
            <Button
              className={`${buttonClass} ${isRemoveClicked ? 'flashRemove' : ''}`}
              variant="contained"
              onClick={() => {
                if (isSpellAlreadyPrepared) {
                  setClickedButtons([...clickedButtons, `remove-${index}`]);
                  togglePreparedSpell(spell, numericalSpellLevel);
                  setTimeout(() => {
                    setClickedButtons(clickedButtons.filter((btnIndex) => btnIndex !== `remove-${index}`));
                  }, 300);
                } else {
                  togglePreparedSpell(spell, numericalSpellLevel);
                }
              }}
            >
              {isSpellAlreadyPrepared ? 'Unprepare' : 'Prepare Spell'}
            </Button>
    )
}

