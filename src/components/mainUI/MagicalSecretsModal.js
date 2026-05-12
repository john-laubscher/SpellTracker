import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";
import spellTables from "../spellTables";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";
import PrepareMagicalSecretButton from "./PrepareMagicalSecretButton";

const SPELL_LIST_CLASSES = [
  { value: "bard", label: "Bard" },
  { value: "cleric", label: "Cleric" },
  { value: "druid", label: "Druid" },
  { value: "paladin", label: "Paladin" },
  { value: "ranger", label: "Ranger" },
  { value: "sorcerer", label: "Sorcerer" },
  { value: "warlock", label: "Warlock" },
  { value: "wizard", label: "Wizard" },
];

const LEVEL_LABELS = {
  0: "Cantrips",
  1: "1st Level",
  2: "2nd Level",
  3: "3rd Level",
  4: "4th Level",
  5: "5th Level",
  6: "6th Level",
  7: "7th Level",
  8: "8th Level",
  9: "9th Level",
};

const getMaxSpellLevelForCharacter = ({ characterClass, characterLevel }) => {
  const lvl = Number(characterLevel) || 0;
  const row = spellTables?.[characterClass]?.[lvl];
  if (!row) return 0;

  const spellLevels = [
    { key: "ninth", lvl: 9 },
    { key: "eighth", lvl: 8 },
    { key: "seventh", lvl: 7 },
    { key: "sixth", lvl: 6 },
    { key: "fifth", lvl: 5 },
    { key: "fourth", lvl: 4 },
    { key: "third", lvl: 3 },
    { key: "second", lvl: 2 },
    { key: "first", lvl: 1 },
  ];

  const found = spellLevels.find(({ key }) => Number(row?.[key]) > 0);
  return found ? found.lvl : 0;
};

const emptyByLevel = (maxLevel) => {
  const next = {};
  for (let i = 0; i <= maxLevel; i += 1) next[i] = [];
  return next;
};

const emptyStatusByLevel = (maxLevel) => {
  const next = {};
  for (let i = 0; i <= maxLevel; i += 1) next[i] = { loading: false, error: "" };
  return next;
};

const emptyExpandedByLevel = (maxLevel) => {
  const next = {};
  for (let i = 0; i <= maxLevel; i += 1) next[i] = false;
  return next;
};

const MagicalSecretsModal = ({ open, onClose }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const characterLevel = Number(characterInfo?.characterLevel) || 0;
  const maxSpellLevel = useMemo(
    () =>
      getMaxSpellLevelForCharacter({
        characterClass: characterInfo?.characterClass,
        characterLevel,
      }),
    [characterInfo?.characterClass, characterLevel]
  );

  const [spellClass, setSpellClass] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [spellsByLevel, setSpellsByLevel] = React.useState(() => emptyByLevel(0));
  const [loadStatusByLevel, setLoadStatusByLevel] = React.useState(() => emptyStatusByLevel(0));
  const [expandedByLevel, setExpandedByLevel] = React.useState(() => emptyExpandedByLevel(0));

  const magicalSecrets = Array.isArray(characterInfo?.magicalSecretsPrepared)
    ? characterInfo.magicalSecretsPrepared
    : [];

  useEffect(() => {
    setSpellsByLevel(emptyByLevel(maxSpellLevel));
    setLoadStatusByLevel(emptyStatusByLevel(maxSpellLevel));
    setExpandedByLevel(emptyExpandedByLevel(maxSpellLevel));
  }, [maxSpellLevel]);

  useEffect(() => {
    setSearch("");
    setSpellsByLevel(emptyByLevel(maxSpellLevel));
    setLoadStatusByLevel(emptyStatusByLevel(maxSpellLevel));
    setExpandedByLevel(emptyExpandedByLevel(maxSpellLevel));
  }, [maxSpellLevel, spellClass]);

  const loadSpellsForLevel = (numericalSpellLevel) => {
    if (!spellClass) return;
    if (loadStatusByLevel?.[numericalSpellLevel]?.loading) return;
    if (Array.isArray(spellsByLevel?.[numericalSpellLevel]) && spellsByLevel[numericalSpellLevel].length > 0)
      return;

    setLoadStatusByLevel((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: "" },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/${spellClass}`)
      .then((res) => {
        const fetched = res.data?.results || [];
        setSpellsByLevel((prev) => ({
          ...prev,
          [numericalSpellLevel]: fetched,
        }));
        setLoadStatusByLevel((prev) => ({
          ...prev,
          [numericalSpellLevel]: { loading: false, error: "" },
        }));
      })
      .catch(() => {
        setLoadStatusByLevel((prev) => ({
          ...prev,
          [numericalSpellLevel]: {
            loading: false,
            error: "Failed to load spells. Is the backend running on port 3001?",
          },
        }));
      });
  };

  const levelsToShow = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= maxSpellLevel; i += 1) arr.push(i);
    return arr;
  }, [maxSpellLevel]);

  const normalizedSearch = String(search || "").trim().toLowerCase();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Additional Magical Secrets"
          totalAllowed={2}
          actualSelected={magicalSecrets.length}
          typographySx={{
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        />
        <IconButton
          aria-label="Close"
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "rgba(0,0,0,0.55)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          Choose up to <strong>two</strong> spells from <strong>any class</strong>. These spells are tracked
          separately and do not count against your bard spells known.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <TextField
            select
            size="small"
            label="Spell Class"
            value={spellClass}
            onChange={(e) => setSpellClass(String(e.target.value || ""))}
            sx={{ minWidth: 200, flex: "1 1 240px" }}
          >
            <MenuItem value="">
              <em>Choose a class…</em>
            </MenuItem>
            {SPELL_LIST_CLASSES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Search spells"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!spellClass}
            sx={{ flex: "2 1 320px" }}
          />
        </Box>

        {!spellClass ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, mt: 1 }}>
            Select a class to view its spells.
          </Typography>
        ) : null}

        {spellClass ? (
          <Box sx={{ mt: 1 }}>
            {levelsToShow.map((numericalSpellLevel) => {
              const expanded = Boolean(expandedByLevel?.[numericalSpellLevel]);
              const loadStatus = loadStatusByLevel?.[numericalSpellLevel] || { loading: false, error: "" };
              const all = Array.isArray(spellsByLevel?.[numericalSpellLevel]) ? spellsByLevel[numericalSpellLevel] : [];

              const filtered = normalizedSearch
                ? all.filter((s) => String(s?.name || "").toLowerCase().includes(normalizedSearch))
                : all;

              return (
                <Accordion
                  key={`ms:${spellClass}:${numericalSpellLevel}`}
                  disableGutters
                  elevation={0}
                  expanded={expanded}
                  onChange={(_, nextExpanded) => {
                    setExpandedByLevel((prev) => ({ ...prev, [numericalSpellLevel]: nextExpanded }));
                    if (nextExpanded) loadSpellsForLevel(numericalSpellLevel);
                  }}
                  sx={{
                    backgroundColor: "transparent",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": { margin: 0 },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px" }} />}
                    sx={{
                      minHeight: 32,
                      px: 0.5,
                      py: 0,
                      "& .MuiAccordionSummary-content": { margin: "4px 0 !important" },
                      "&.Mui-expanded": { minHeight: 32 },
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#5d4037" }}>
                      {LEVEL_LABELS[numericalSpellLevel] || `Level ${numericalSpellLevel}`}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 0.5, py: 0.5 }}>
                    {loadStatus.loading ? (
                      <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
                        Loading spells…
                      </Typography>
                    ) : null}
                    {loadStatus.error ? (
                      <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
                        {loadStatus.error}
                      </Typography>
                    ) : null}

                    {!loadStatus.loading && !loadStatus.error && filtered.length === 0 ? (
                      <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
                        {all.length === 0 ? "No spells found for this level." : "No spells match your search."}
                      </Typography>
                    ) : null}

                    {filtered.map((spell, idx) => (
                      <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
                        <SpellAccordian
                          numericalSpellLevel={numericalSpellLevel}
                          spell={spell}
                          actionButton={<PrepareMagicalSecretButton spell={spell} index={idx} />}
                        />
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default MagicalSecretsModal;

