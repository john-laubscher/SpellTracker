import * as React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { CharacterInfoContext } from "../../Contexts/Context";
import {useContext} from 'react'
import { useState } from 'react';
import { makeStyles } from '@mui/styles';
import ConfirmDialog from "./ConfirmDialog";
import { getPreparedSpellsForClass, updatePreparedSpellsForClass } from "../../utils/spellcastingState";

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

export const PrepareSpellButton = ({numericalSpellLevel, spell, index, blockedReason = "", targetClassKey = ""}) => {

    const [clickedButtons, setClickedButtons] = useState([]); // State for tracking clicked buttons
    const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
    const [blockedTooltipOpen, setBlockedTooltipOpen] = useState(false);
    const [blockedShake, setBlockedShake] = useState(false);
    
    const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
    const isRemoveClicked = clickedButtons.includes(`remove-${index}`);
    const isArcaneTricksterMageHand =
      Number(numericalSpellLevel) === 0 &&
      String(spell?.index || "") === "mage-hand" &&
      String(spell?.spelltrackerBonus || "") === "arcane_trickster_mage_hand" &&
      String(characterInfo?.characterClass || "") === "rogue" &&
      String(characterInfo?.subclass || "") === "arcaneTrickster";

    const preparedSpellsForClass = getPreparedSpellsForClass(characterInfo, targetClassKey || characterInfo?.characterClass, numericalSpellLevel);
    const matchingPreparedSpell = preparedSpellsForClass?.find(
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
        const isSpellAlreadyPrepared = preparedSpellsForClass?.some((preparedSpellList) => preparedSpellList.index === spell.index)
        if(!isSpellAlreadyPrepared) {
          setCharacterInfo((currentCharacterInfo) =>
            updatePreparedSpellsForClass(currentCharacterInfo, targetClassKey || currentCharacterInfo?.characterClass, numericalSpellLevel, (current) => [
              ...current,
              spell,
            ])
          );
          // else unprepares the spell
        } else {
          console.log("You un-prepared the spell")
          setCharacterInfo((characterInfo) => {
            const nextCharacterInfo = updatePreparedSpellsForClass(
              characterInfo,
              targetClassKey || characterInfo?.characterClass,
              numericalSpellLevel,
              (current) => current.filter((preparedSpell) => preparedSpell.index !== spell.index)
            );

            return {
              ...nextCharacterInfo,
              ...(isArcaneTricksterMageHand ? { arcaneTricksterMageHandOptOut: true } : {}),
            };
          });
        }
      }

    const classes = togglePreparedSpellBtnStyle();

    const buttonClass = isSpellAlreadyPrepared ? classes.preparedButton : classes.prepareButton;
    const isCantrip = Number(numericalSpellLevel) === 0;
    const isBlocked = Boolean(String(blockedReason || "").trim());
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
        <Tooltip
          arrow
          open={blockedTooltipOpen}
          onOpen={() => {
            if (isBlocked) setBlockedTooltipOpen(true);
          }}
          onClose={() => setBlockedTooltipOpen(false)}
          title={isBlocked ? blockedReason : ""}
          disableFocusListener={!isBlocked}
          disableHoverListener={!isBlocked}
          disableTouchListener={!isBlocked}
        >
          <Button
            className={`${buttonClass} ${isRemoveClicked ? 'flashRemove' : ''}`}
            variant="contained"
            disabled={isPreparedByCelestialBonus || isWizardSignatureSpell}
            onClick={() => {
              if (isBlocked) {
                setBlockedTooltipOpen(true);
                setBlockedShake(true);
                window.setTimeout(() => setBlockedShake(false), 350);
                window.setTimeout(() => setBlockedTooltipOpen(false), 2200);
                return;
              }
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
            sx={
              isBlocked
                ? {
                    backgroundColor: '#9e9e9e',
                    color: '#f5f5f5',
                    cursor: 'not-allowed',
                    opacity: 0.92,
                    textDecoration: 'line-through',
                    '@keyframes blockedPrepareShake': {
                      '0%': { transform: 'translateX(0)' },
                      '20%': { transform: 'translateX(-2px)' },
                      '40%': { transform: 'translateX(2px)' },
                      '60%': { transform: 'translateX(-2px)' },
                      '80%': { transform: 'translateX(2px)' },
                      '100%': { transform: 'translateX(0)' },
                    },
                    animation: blockedShake ? 'blockedPrepareShake 220ms ease-in-out 1' : 'none',
                    '&:hover': {
                      backgroundColor: '#8d8d8d',
                    },
                  }
                : undefined
            }
          >
            {isSpellAlreadyPrepared ? preparedLabel : unpreparedLabel}
          </Button>
        </Tooltip>

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

