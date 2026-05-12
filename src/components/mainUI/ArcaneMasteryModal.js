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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";
import PrepareArcaneMasterySpellButton from "./PrepareArcaneMasterySpellButton";

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

const ArcaneMasteryModal = ({ open, onClose }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const maxSpellLevel = 9;

  const [search, setSearch] = React.useState("");
  const [spellsByLevel, setSpellsByLevel] = React.useState(() => emptyByLevel(0));
  const [loadStatusByLevel, setLoadStatusByLevel] = React.useState(() => emptyStatusByLevel(0));
  const [expandedByLevel, setExpandedByLevel] = React.useState(() => emptyExpandedByLevel(0));

  const chosen = Array.isArray(characterInfo?.arcaneMasterySpells)
    ? characterInfo.arcaneMasterySpells
    : [];

  useEffect(() => {
    setSpellsByLevel(emptyByLevel(maxSpellLevel));
    setLoadStatusByLevel(emptyStatusByLevel(maxSpellLevel));
    setExpandedByLevel(emptyExpandedByLevel(maxSpellLevel));
  }, [maxSpellLevel]);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSpellsByLevel(emptyByLevel(maxSpellLevel));
    setLoadStatusByLevel(emptyStatusByLevel(maxSpellLevel));
    setExpandedByLevel(emptyExpandedByLevel(maxSpellLevel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const loadSpellsForLevel = (numericalSpellLevel) => {
    if (loadStatusByLevel?.[numericalSpellLevel]?.loading) return;
    if (Array.isArray(spellsByLevel?.[numericalSpellLevel]) && spellsByLevel[numericalSpellLevel].length > 0)
      return;

    setLoadStatusByLevel((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: "" },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/wizard`)
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
            error: "Failed to load wizard spells. Is the backend running on port 3001?",
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
          label="Arcane Mastery (Wizard Spells)"
          totalAllowed={4}
          actualSelected={chosen.length}
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
        <Box
          sx={{
            mb: 1,
            px: 1,
            py: 0.75,
            borderRadius: 1,
            backgroundColor: "rgba(244, 233, 221, 0.65)",
            border: "1px solid rgba(93, 64, 55, 0.22)",
          }}
        >
          <Typography sx={{ fontSize: "13px", color: "#3e2723", fontWeight: 700, mb: 0.25 }}>
            Rules note (not enforced)
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#3e2723" }}>
            Arcane Mastery says to pick <strong>four</strong> wizard spells: <strong>one</strong> each from{" "}
            <strong>6th</strong>, <strong>7th</strong>, <strong>8th</strong>, and <strong>9th</strong> level.
            This picker does <strong>not</strong> restrict levels.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <TextField
            size="small"
            label="Search spells"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: "1 1 320px" }}
          />
        </Box>

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
                key={`am:wizard:${numericalSpellLevel}`}
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
                        actionButton={<PrepareArcaneMasterySpellButton spell={spell} index={idx} />}
                      />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ArcaneMasteryModal;

