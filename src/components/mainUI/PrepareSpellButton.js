import * as React from 'react';
import Button from '@mui/material/Button';
import { CharacterInfoContext } from "../../Contexts/Context";
import {useContext} from 'react'
import { useState } from 'react';
import { makeStyles } from '@mui/styles';
import ConfirmDialog from "./ConfirmDialog";

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
    const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
    
    const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
    const isRemoveClicked = clickedButtons.includes(`remove-${index}`);
    const isArcaneTricksterMageHand =
      Number(numericalSpellLevel) === 0 &&
      String(spell?.index || "") === "mage-hand" &&
      String(spell?.spelltrackerBonus || "") === "arcane_trickster_mage_hand" &&
      String(characterInfo?.characterClass || "") === "rogue" &&
      String(characterInfo?.subclass || "") === "arcaneTrickster";

    const matchingPreparedSpell = characterInfo.spellsPrepared[numericalSpellLevel]?.find(
        (preparedSpell) => preparedSpell.index === spell.index
      );
    const isSpellAlreadyPrepared = Boolean(matchingPreparedSpell);
    const isPreparedByCelestialBonus =
      Number(numericalSpellLevel) === 0 &&
      String(characterInfo?.characterClass || "") === "warlock" &&
      String(characterInfo?.subclass || "") === "celestial" &&
      (
        String(matchingPreparedSpell?.spelltrackerBonus || "") === "celestial_bonus_cantrip_light" ||
        String(matchingPreparedSpell?.spelltrackerBonus || "") === "celestial_bonus_cantrip_sacred_flame"
      );
    const isWizardSignatureSpell =
      String(characterInfo?.characterClass || "") === "wizard" &&
      String(matchingPreparedSpell?.spelltrackerBonus || "") === "wizard_signature_spell";

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
              ...(isArcaneTricksterMageHand ? { arcaneTricksterMageHandOptOut: true } : {}),
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
    const isCantrip = Number(numericalSpellLevel) === 0;
    const preparedLabel = isWizardSignatureSpell
      ? 'Signature'
      : isPreparedByCelestialBonus
        ? 'Bonus Cantrip'
        : isCantrip
          ? 'Forget'
          : 'Unprepare';
    const unpreparedLabel = isCantrip ? 'Learn Cantrip' : 'Prepare Spell';

    return (
      <>
        <Button
          className={`${buttonClass} ${isRemoveClicked ? 'flashRemove' : ''}`}
          variant="contained"
          disabled={isPreparedByCelestialBonus || isWizardSignatureSpell}
          onClick={() => {
            if (isPreparedByCelestialBonus || isWizardSignatureSpell) return;
            if (isSpellAlreadyPrepared) {
              if (isArcaneTricksterMageHand) {
                setConfirmRemoveOpen(true);
                return;
              }
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
          {isSpellAlreadyPrepared ? preparedLabel : unpreparedLabel}
        </Button>

        <ConfirmDialog
          open={confirmRemoveOpen}
          title="Remove Mage Hand?"
          body="Arcane Tricksters always know Mage Hand. Removing it will reduce your cantrips known and may make your character sheet inaccurate."
          confirmLabel="Remove"
          onClose={() => setConfirmRemoveOpen(false)}
          onConfirm={() => {
            setConfirmRemoveOpen(false);
            setClickedButtons([...clickedButtons, `remove-${index}`]);
            togglePreparedSpell(spell, numericalSpellLevel);
            setTimeout(() => {
              setClickedButtons((prev) => prev.filter((btnIndex) => btnIndex !== `remove-${index}`));
            }, 300);
          }}
        />
      </>
    )
}

