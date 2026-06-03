import * as React from "react";
import { useContext, useMemo } from "react";
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
import PrepareMysticArcanumButton from "./PrepareMysticArcanumButton";
import SpellAccordian from "./SpellAccordian";
import {
  getWarlockMysticArcanumExpectedTotal,
  getWarlockUnlockedArcanumLevels,
} from "../warlockOptionsData";

const MAX_ARCANUM_SELECTIONS = 10;

const getWarlockLevel = (characterInfo) => {
  const raw = characterInfo?.classLevels?.warlock;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
  if (characterInfo?.characterClass === "warlock") {
    return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  }
  return 0;
};

const LEVEL_LABELS = {
  6: "6th-Level Arcanum",
  7: "7th-Level Arcanum",
  8: "8th-Level Arcanum",
  9: "9th-Level Arcanum",
};

const emptyByLevel = () => ({
  6: [],
  7: [],
  8: [],
  9: [],
});

const emptyStatusByLevel = () => ({
  6: { loading: false, error: "" },
  7: { loading: false, error: "" },
  8: { loading: false, error: "" },
  9: { loading: false, error: "" },
});

const emptyExpandedByLevel = () => ({
  6: false,
  7: false,
  8: false,
  9: false,
});

const WarlockMysticArcanumModal = ({ open, onClose }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const warlockLevel = useMemo(() => getWarlockLevel(characterInfo), [characterInfo]);
  const unlockedLevels = useMemo(() => getWarlockUnlockedArcanumLevels(warlockLevel), [warlockLevel]);
  const expectedTotal = useMemo(() => getWarlockMysticArcanumExpectedTotal(warlockLevel), [warlockLevel]);

  const selected = Array.isArray(characterInfo?.warlockMysticArcanum)
    ? characterInfo.warlockMysticArcanum
    : [];

  const [search, setSearch] = React.useState("");
  const [spellsByLevel, setSpellsByLevel] = React.useState(() => emptyByLevel());
  const [loadStatusByLevel, setLoadStatusByLevel] = React.useState(() => emptyStatusByLevel());
  const [expandedByLevel, setExpandedByLevel] = React.useState(() => emptyExpandedByLevel());

  React.useEffect(() => {
    if (!open) return;
    setSearch("");
  }, [open]);

  const loadSpellsForLevel = (numericalSpellLevel) => {
    if (loadStatusByLevel?.[numericalSpellLevel]?.loading) return;
    if (Array.isArray(spellsByLevel?.[numericalSpellLevel]) && spellsByLevel[numericalSpellLevel].length > 0) return;

    setLoadStatusByLevel((prev) => ({
      ...prev,
      [numericalSpellLevel]: { loading: true, error: "" },
    }));

    axios
      .get(`/allspells/${numericalSpellLevel}/warlock`)
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
            error: "Failed to load spells. Is the backend running on port 3001?",
          },
        }));
      });
  };

  const normalizedSearch = String(search || "").trim().toLowerCase();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus label="Mystic Arcanum" totalAllowed={expectedTotal} actualSelected={selected.length} />
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
          By Warlock level {warlockLevel}, you normally have <strong>{expectedTotal}</strong> mystic arcanum selection{expectedTotal === 1 ? "" : "s"}.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          This tracker intentionally stays flexible for table variation, but you can never record more than <strong>{MAX_ARCANUM_SELECTIONS}</strong> arcanum spells here.
        </Typography>

        <TextField
          size="small"
          label="Search arcanum spells"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 1.25, width: "100%" }}
        />

        {unlockedLevels.map((numericalSpellLevel) => {
          const expanded = Boolean(expandedByLevel?.[numericalSpellLevel]);
          const loadStatus = loadStatusByLevel?.[numericalSpellLevel] || { loading: false, error: "" };
          const all = Array.isArray(spellsByLevel?.[numericalSpellLevel]) ? spellsByLevel[numericalSpellLevel] : [];
          const filtered = normalizedSearch
            ? all.filter((spell) => String(spell?.name || "").toLowerCase().includes(normalizedSearch))
            : all;
          const selectedAtLevel = selected.filter((spell) => Number(spell?.level) === Number(numericalSpellLevel)).length;

          return (
            <Accordion
              key={`warlock-arcanum:${numericalSpellLevel}`}
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
                  "& .MuiAccordionSummary-content": {
                    margin: "4px 0 !important",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  },
                  "&.Mui-expanded": { minHeight: 32 },
                }}
              >
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#5d4037" }}>
                  {LEVEL_LABELS[numericalSpellLevel]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: selectedAtLevel === 1 ? "#2e7d32" : selectedAtLevel > 1 ? "#b71c1c" : "#075985",
                  }}
                >
                  {selectedAtLevel}/1 expected
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 0.5, py: 0.5 }}>
                {loadStatus.loading ? (
                  <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
                    Loading spells...
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
                      actionButton={
                        <PrepareMysticArcanumButton
                          spell={spell}
                          index={idx}
                          maxSelections={MAX_ARCANUM_SELECTIONS}
                        />
                      }
                    />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default WarlockMysticArcanumModal;
