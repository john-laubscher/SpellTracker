import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";
import SpellAccordian from "./SpellAccordian";
import { getWizardSpellbookForClass, updatePreparedSpellsForClass, updateWizardSpellbookForClass } from "../../utils/spellcastingState";

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

const WizardSpellbookModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const maxSpellLevel = 9;
  const [search, setSearch] = React.useState("");
  const [spellsByLevel, setSpellsByLevel] = React.useState(() => emptyByLevel(maxSpellLevel));
  const [loadStatusByLevel, setLoadStatusByLevel] = React.useState(() => emptyStatusByLevel(maxSpellLevel));
  const [expandedByLevel, setExpandedByLevel] = React.useState(() => emptyExpandedByLevel(maxSpellLevel));

  const spellbook = getWizardSpellbookForClass(characterInfo, "wizard");

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setExpandedByLevel(emptyExpandedByLevel(maxSpellLevel));
  }, [open]);

  const loadSpellsForLevel = (numericalSpellLevel) => {
    if (loadStatusByLevel?.[numericalSpellLevel]?.loading) return;
    if (Array.isArray(spellsByLevel?.[numericalSpellLevel]) && spellsByLevel[numericalSpellLevel].length > 0) return;

    setLoadStatusByLevel((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: "" },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/wizard`)
      .then((res) => {
        setSpellsByLevel((prev) => ({
          ...prev,
          [numericalSpellLevel]: res.data?.results || [],
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
            error: "Failed to load wizard spells. Is the backend running on port 3001?",
          },
        }));
      });
  };

  const levelsToShow = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= maxSpellLevel; i += 1) arr.push(i);
    return arr;
  }, []);

  const normalizedSearch = String(search || "").trim().toLowerCase();

  const toggleSpellbookSpell = (spellLevel, spell) => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const currentAtLevel = getWizardSpellbookForClass(prev, "wizard", spellLevel);
      const exists = currentAtLevel.some((entry) => String(entry?.index || "") === String(spell.index));
      const nextAtLevel = exists
        ? currentAtLevel.filter((entry) => String(entry?.index || "") !== String(spell.index))
        : [...currentAtLevel, spell];
      let next = updateWizardSpellbookForClass(prev, "wizard", spellLevel, nextAtLevel);

      if (exists) {
        next = updatePreparedSpellsForClass(next, "wizard", spellLevel, (currentPrepared) =>
          currentPrepared.filter((entry) => String(entry?.index || "") !== String(spell.index))
        );
        next.wizardSpellMastery = {
          1: prev?.wizardSpellMastery?.[1]?.index === spell.index ? null : prev?.wizardSpellMastery?.[1] || null,
          2: prev?.wizardSpellMastery?.[2]?.index === spell.index ? null : prev?.wizardSpellMastery?.[2] || null,
        };
        next.wizardSignatureSpells = Array.isArray(prev?.wizardSignatureSpells)
          ? prev.wizardSignatureSpells.filter((entry) => String(entry?.index || "") !== String(spell.index))
          : [];
      }

      return next;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        Spellbook
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
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1.5 }}>
          Choose wizard spells to add to the spellbook. These spells appear in the spell tracker even before they are
          prepared.
        </Typography>
        <TextField
          size="small"
          label="Search spells"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "100%", mb: 1 }}
        />
        <Box>
          {levelsToShow.map((numericalSpellLevel) => {
            const expanded = Boolean(expandedByLevel?.[numericalSpellLevel]);
            const loadStatus = loadStatusByLevel?.[numericalSpellLevel] || { loading: false, error: "" };
            const all = Array.isArray(spellsByLevel?.[numericalSpellLevel]) ? spellsByLevel[numericalSpellLevel] : [];
            const filtered = normalizedSearch
              ? all.filter((spell) => String(spell?.name || "").toLowerCase().includes(normalizedSearch))
              : all;
            const addedIndexes = new Set(
              (Array.isArray(spellbook?.[numericalSpellLevel]) ? spellbook[numericalSpellLevel] : []).map((spell) =>
                String(spell?.index || "")
              )
            );

            return (
              <Accordion
                key={`wizard-spellbook:${numericalSpellLevel}`}
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
                      Loading wizard spells…
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
                  {filtered.map((spell, index) => {
                    const isAdded = addedIndexes.has(String(spell?.index || ""));
                    return (
                      <Box key={spell?.index || index} sx={{ py: 0.2 }}>
                        <SpellAccordian
                          numericalSpellLevel={numericalSpellLevel}
                          spell={spell}
                          actionButton={
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => toggleSpellbookSpell(numericalSpellLevel, spell)}
                              sx={{
                                textTransform: "none",
                                fontSize: "12px",
                                minWidth: "auto",
                                backgroundColor: isAdded ? "#2e7d32" : "#5d4037",
                                "&:hover": { backgroundColor: isAdded ? "#1b5e20" : "#4e342e" },
                              }}
                            >
                              {isAdded ? "Added" : "Add"}
                            </Button>
                          }
                        />
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WizardSpellbookModal;
