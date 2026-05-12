import React, { useContext, useEffect } from "react";
import axios from 'axios';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { CharacterInfoContext } from "../../Contexts/Context";
import ClassesData from "../ClassesData";
import spellTables from "../spellTables";
import AddSpellModal from "./AddSpellModal"
import SpellCheckboxes from "./SpellCheckboxes";
import {PrepareSpellButton, togglePreparedSpellBtnStyle} from "./PrepareSpellButton";
import SpellAccordian from './SpellAccordian';
import { renderDailySpellsList } from './RacialSpellsList'
import PreparedSpellsStatus from "./PreparedSpellsStatus";
import PrepareMagicalSecretButton from "./PrepareMagicalSecretButton";

const spellLevelColors = {
  0: '#607d8b',
  1: '#1565c0',
  2: '#2e7d32',
  3: '#f9a825',
  4: '#ef6c00',
  5: '#c62828',
  6: '#6a1b9a',
  7: '#283593',
  8: '#4e342e',
  9: '#b71c1c',
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

//**Needs to account for classFeatures like Bard's Magical Secrets that allows for additional spells added to spell list. Might be just a bard thing, but possibly more classes */

export const SpellList = (props) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const hasGuidingWhispers =
    characterInfo?.characterClass === "bard" &&
    characterInfo?.subclass === "spirits" &&
    Number(characterInfo?.characterLevel || 0) >= 3;

  const hasAdditionalMagicalSecrets =
    characterInfo?.characterClass === "bard" &&
    characterInfo?.subclass === "lore" &&
    Number(characterInfo?.characterLevel || 0) >= 6;

  const magicalSecrets = Array.isArray(characterInfo?.magicalSecretsPrepared)
    ? characterInfo.magicalSecretsPrepared
    : [];

  const [spellListLoadStatus, setSpellListLoadStatus] = React.useState({
    0: { loading: false, error: '' },
    1: { loading: false, error: '' },
    2: { loading: false, error: '' },
    3: { loading: false, error: '' },
    4: { loading: false, error: '' },
    5: { loading: false, error: '' },
    6: { loading: false, error: '' },
    7: { loading: false, error: '' },
    8: { loading: false, error: '' },
    9: { loading: false, error: '' },
  });

  // is this doing anything usefull?
  useEffect(() => {
  }, [characterInfo]);

  useEffect(() => {
    const hasGuidingWhispers =
      characterInfo?.characterClass === "bard" &&
      characterInfo?.subclass === "spirits" &&
      Number(characterInfo?.characterLevel || 0) >= 3;

    if (!hasGuidingWhispers) {
      setCharacterInfo((prev) => {
        const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
        const next = current.filter((s) => s?.index !== "guidance");
        if (next.length === current.length) return prev;
        return {
          ...prev,
          spellsPrepared: {
            ...prev.spellsPrepared,
            0: next,
          },
        };
      });
      return;
    }

    const currentCantrips = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];
    const alreadyHasGuidance = currentCantrips.some((s) => s?.index === "guidance");
    if (alreadyHasGuidance) return;

    let cancelled = false;
    axios
      .get("/singlespell/guidance")
      .then((res) => {
        if (cancelled) return;
        const guidanceSpell = res?.data;
        if (!guidanceSpell?.index) return;

        const guidance60ft = {
          ...guidanceSpell,
          range: "60 feet",
        };

        setCharacterInfo((prev) => {
          const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
          if (current.some((s) => s?.index === "guidance")) return prev;
          return {
            ...prev,
            spellsPrepared: {
              ...prev.spellsPrepared,
              0: [...current, guidance60ft],
            },
          };
        });
      })
      .catch(() => {
        // Silently ignore: backend might not be running yet.
      });

    return () => {
      cancelled = true;
    };
  }, [
    characterInfo?.characterClass,
    characterInfo?.subclass,
    characterInfo?.characterLevel,
    characterInfo?.spellsPrepared,
    setCharacterInfo,
  ]);

  const toggleModal = (numericalSpellLevel) => {
    setSpells(spells => ({
      ...spells,
      [numericalSpellLevel]: {
        ...spells[numericalSpellLevel],
        showModal: !spells[numericalSpellLevel].showModal
      }
    }));
    console.log('true/false', spells[numericalSpellLevel].showModal)
  };

  const [spells, setSpells] = React.useState({
    0: {showModal: false, classSpells: []},
    1: {showModal: false, classSpells:[]},
    2: {showModal: false, classSpells:[]},
    3: {showModal: false, classSpells:[]},
    4: {showModal: false, classSpells:[]},
    5: {showModal: false, classSpells:[]},
    6: {showModal: false, classSpells:[]},
    7: {showModal: false, classSpells:[]},
    8: {showModal: false, classSpells:[]},
    9: {showModal: false, classSpells:[]},
  })

  useEffect(() => {
    setSpells((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = { ...next[k], classSpells: [] };
      });
      return next;
    });
    setSpellListLoadStatus({
      0: { loading: false, error: '' },
      1: { loading: false, error: '' },
      2: { loading: false, error: '' },
      3: { loading: false, error: '' },
      4: { loading: false, error: '' },
      5: { loading: false, error: '' },
      6: { loading: false, error: '' },
      7: { loading: false, error: '' },
      8: { loading: false, error: '' },
      9: { loading: false, error: '' },
    });
  }, [characterInfo.characterClass]);

  const loadClassSpellsForLevel = (numericalSpellLevel) => {
    if (spellListLoadStatus[numericalSpellLevel]?.loading) return;

    setSpellListLoadStatus((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: '' },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/${characterInfo.characterClass}`)
      .then((res) => {
        const fetchedSpellsArr = res.data?.results || [];
        setSpells((prevSpells) => ({
          ...prevSpells,
          [numericalSpellLevel]: {
            ...prevSpells[numericalSpellLevel],
            classSpells: fetchedSpellsArr,
          },
        }));
        setSpellListLoadStatus((prev) => ({
          ...prev,
          [numericalSpellLevel]: { loading: false, error: '' },
        }));
      })
      .catch((error) => {
        console.log('Error fetching spells:', error);
        setSpellListLoadStatus((prev) => ({
          ...prev,
          [numericalSpellLevel]: {
            loading: false,
            error: 'Failed to load spells. Is the backend running on port 3001?',
          },
        }));
      });
  };

  const showClassSpellsButton = (numericalSpellLevel) => {
    const isCantrips = Number(numericalSpellLevel) === 0;

    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const isOpening = !spells[numericalSpellLevel].showModal;
            toggleModal(numericalSpellLevel);
            if (isOpening && spells[numericalSpellLevel].classSpells.length === 0) {
              loadClassSpellsForLevel(numericalSpellLevel);
            }
          }}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            fontFamily: "'Cinzel', serif",
            color: '#5d4037',
            borderColor: 'rgba(139,69,19,0.4)',
            '&:hover': { borderColor: '#8B4513', backgroundColor: 'rgba(139,69,19,0.06)' },
          }}
        >
          {spells[numericalSpellLevel].showModal
            ? (isCantrips ? 'Close Cantrip List' : 'Close Spell List')
            : (isCantrips ? 'Learn more cantrips' : 'Prepare more spells')}
        </Button>
        {spells[numericalSpellLevel].showModal ? <AddSpellModal
          isModalOpen={spells[numericalSpellLevel].showModal}
          onClose={() => toggleModal(numericalSpellLevel)}
          numericalSpellLevel={numericalSpellLevel}
          spells={spells[numericalSpellLevel].classSpells}
          spellsLoading={spellListLoadStatus[numericalSpellLevel]?.loading}
          spellsError={spellListLoadStatus[numericalSpellLevel]?.error}
        /> : null}
      </div>
    )
  }

  const renderSpellModal = (numericalSpellLevel) => {
    return (
      <div>
        {showClassSpellsButton(numericalSpellLevel)}
      </div>
    )
  }

  const unprepareAllSpells = () => {
    setCharacterInfo((prevCharacterInfo) => ({
      ...prevCharacterInfo,
      spellsPrepared: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
      },
    }));
  };

  const classes = togglePreparedSpellBtnStyle();
  // ***NEED FEATURE--CRITICAL--*** some subrace spells are not in the api, so will need a condition that instead shows a message saying that the description is not available
  //***NEED SPECIAL CONDITION*** for Warlock: "first level spells:" "second level spells" "Third level spell slots" (only use "spell slots" text for the one that matches slotLevel and add checkboxes only at that level) and will also need special rendering for mystic arcanum, but could be a separate function renderMysticArcanum().
  const renderPCSpells = (textualSpellLevel, numericalSpellLevel) => {
    const classKey = characterInfo?.characterClass;
    const classMeta = ClassesData?.[classKey];
    if (!classMeta) return null;

    if (classMeta.isSpellCaster === "nonCaster") {
      return null;
    }

    const levelKey = Number(characterInfo?.characterLevel) || 0;
    const tableRow = spellTables?.[classKey]?.[levelKey];
    if (!tableRow) return null;

    const slotCount = Number(tableRow?.[textualSpellLevel]) || 0;
    if (slotCount === 0) return null;
      const levelColor = spellLevelColors[numericalSpellLevel] || '#607d8b';
      const isCantrips = textualSpellLevel === 'cantrips';
      const heading = isCantrips
        ? `Cantrips Known: ${slotCount}`
        : `${capitalize(textualSpellLevel)} Level Spell Slots`;

      return (
        <Box
          sx={{
            borderLeft: `4px solid ${levelColor}`,
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.45)',
            mb: 1.5,
            px: 1.5,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: '15px',
                color: levelColor,
              }}>
                {heading}
              </Typography>
              {isCantrips && hasGuidingWhispers ? (
                <Tooltip
                  arrow
                  title="Guidance is granted by Guiding Whispers and doesn’t count against cantrips known."
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7, color: levelColor }} />
                </Tooltip>
              ) : null}
            </Box>
            {!isCantrips && (
              <SpellCheckboxes textualSpellLevel={textualSpellLevel} slotCount={slotCount} />
            )}
          </Box>
          {renderMagicalSecretsForLevel(numericalSpellLevel)}
          {renderPreparedSpells(numericalSpellLevel)}
          <Box sx={{ mt: 0.5 }}>
            {renderSpellModal(numericalSpellLevel)}
          </Box>
        </Box>
      );
  };



  const renderPreparedSpells = (numericalSpellLevel) => {
    const prepared = Array.isArray(characterInfo?.spellsPrepared?.[numericalSpellLevel])
      ? characterInfo.spellsPrepared[numericalSpellLevel]
      : [];

    return (
      <div>
        {prepared.map((spell, index) => (
          <div key={spell.index}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              actionButton={
                <PrepareSpellButton
                  numericalSpellLevel={numericalSpellLevel}
                  spell={spell}
                  index={index}
                />
              }
            />
          </div>
        ))}
      </div>
    );
  };

  const renderMagicalSecretsForLevel = (numericalSpellLevel) => {
    if (!hasAdditionalMagicalSecrets) return null;

    const secretsAtLevel = magicalSecrets.filter((spell) => {
      const lvl = Number(spell?.level);
      const key = Number.isFinite(lvl) ? lvl : 0;
      return key === Number(numericalSpellLevel);
    });

    if (secretsAtLevel.length === 0) return null;

    const isOver = magicalSecrets.length > 2;

    return (
      <Box sx={{ mb: 0.5 }}>
        {secretsAtLevel.map((spell, idx) => (
          <Box key={spell.index} sx={{ py: 0.2 }}>
            <SpellAccordian
              numericalSpellLevel={numericalSpellLevel}
              spell={spell}
              leadingControl={
                <Tooltip
                  arrow
                  title="Additional Magical Secret (does not count toward prepared spells)."
                >
                  <Chip
                    size="small"
                    label="MS"
                    sx={{
                      height: 18,
                      fontSize: "11px",
                      fontWeight: 800,
                      opacity: 0.55,
                      backgroundColor: "rgba(0,0,0,0.06)",
                      color: isOver ? "rgba(183, 28, 28, 0.80)" : "rgba(62, 39, 35, 0.72)",
                      border: isOver ? "1px solid rgba(183, 28, 28, 0.30)" : "1px solid rgba(62, 39, 35, 0.22)",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              }
              actionButton={<PrepareMagicalSecretButton spell={spell} index={idx} />}
            />
          </Box>
        ))}
      </Box>
    );
  };

  return (
      <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <PreparedSpellsStatus label="Spell Tracker" />
        <Button
          className={classes.prepareButton}
          variant="contained"
          size="small"
          onClick={unprepareAllSpells}
          sx={{ textTransform: 'none', fontSize: '11px' }}
        >
          Unprepare All
        </Button>
      </Box>
      {renderPCSpells("cantrips", 0)}
      {renderPCSpells("first", 1)}
      {renderPCSpells("second", 2)}
      {renderPCSpells("third", 3)}
      {renderPCSpells("fourth", 4)}
      {renderPCSpells("fifth", 5)}
      {renderPCSpells("sixth", 6)}
      {renderPCSpells("seventh", 7)}
      {renderPCSpells("eighth", 8)}
      {renderPCSpells("ninth", 9)}
      {renderDailySpellsList(characterInfo, setCharacterInfo)}
    </Box>
  );
};

export default SpellList;
