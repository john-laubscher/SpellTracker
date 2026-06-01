import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const PHASES = [
  { id: "full", name: "Full Moon" },
  { id: "new", name: "New Moon" },
  { id: "crescent", name: "Crescent Moon" },
];

const LUNAR_SPELLS = {
  full: [
    { sorcererLevel: 1, spellLevel: 1, index: "shield", name: "Shield" },
    { sorcererLevel: 3, spellLevel: 2, index: "lesser-restoration", name: "Lesser Restoration" },
    { sorcererLevel: 5, spellLevel: 3, index: "dispel-magic", name: "Dispel Magic" },
    { sorcererLevel: 7, spellLevel: 4, index: "death-ward", name: "Death Ward" },
    { sorcererLevel: 9, spellLevel: 5, index: "rarys-telepathic-bond", name: "Rary's Telepathic Bond" },
  ],
  new: [
    { sorcererLevel: 1, spellLevel: 1, index: "ray-of-sickness", name: "Ray of Sickness" },
    { sorcererLevel: 3, spellLevel: 2, index: "blindness-deafness", name: "Blindness/Deafness" },
    { sorcererLevel: 5, spellLevel: 3, index: "vampiric-touch", name: "Vampiric Touch" },
    { sorcererLevel: 7, spellLevel: 4, index: "confusion", name: "Confusion" },
    { sorcererLevel: 9, spellLevel: 5, index: "hold-monster", name: "Hold Monster" },
  ],
  crescent: [
    { sorcererLevel: 1, spellLevel: 1, index: "color-spray", name: "Color Spray" },
    { sorcererLevel: 3, spellLevel: 2, index: "alter-self", name: "Alter Self" },
    { sorcererLevel: 5, spellLevel: 3, index: "phantom-steed", name: "Phantom Steed" },
    { sorcererLevel: 7, spellLevel: 4, index: "hallucinatory-terrain", name: "Hallucinatory Terrain" },
    { sorcererLevel: 9, spellLevel: 5, index: "mislead", name: "Mislead" },
  ],
};

const LunarEmbodimentPhaseModal = ({
  open,
  onClose,
  sorcererLevel = 0,
  selectedPhaseId,
  onSelectPhase,
}) => {
  const currentPhase = PHASES.find((p) => p.id === selectedPhaseId) || PHASES[0];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <Typography sx={{ fontFamily: "inherit", fontWeight: 800, fontSize: "1.1rem" }}>
          Lunar Embodiment
        </Typography>
        <Typography sx={{ fontSize: "13px", opacity: 0.8, mt: 0.5 }}>
          Current phase: <strong>{currentPhase?.name}</strong>
        </Typography>
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
          Pick a phase (usually after a long rest). Expand a phase to see its Lunar Spells.
        </Typography>

        {PHASES.map((phase) => {
          const rows = LUNAR_SPELLS?.[phase.id] || [];
          const isSelected = phase.id === selectedPhaseId;

          return (
            <Accordion key={phase.id} disableGutters elevation={0} sx={{ backgroundColor: "transparent" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                sx={{
                  px: 1,
                  py: 0,
                  minHeight: 34,
                  "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1 },
                }}
              >
                <Typography sx={{ fontSize: "14px", fontWeight: 800 }}>
                  {phase.name}
                </Typography>
                {isSelected ? (
                  <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#0f766e" }}>
                    Selected
                  </Typography>
                ) : null}
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, py: 1, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "6px" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.75 }}>
                  <Button
                    size="small"
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => onSelectPhase?.(phase.id)}
                    sx={{ textTransform: "none", fontSize: "12px" }}
                  >
                    {isSelected ? "Current phase" : "Set phase"}
                  </Button>
                </Box>

                {rows.map((row) => {
                  const unlocked = Number(sorcererLevel || 0) >= Number(row.sorcererLevel || 0);
                  return (
                    <Typography
                      key={`${phase.id}:${row.index}`}
                      sx={{
                        fontSize: "13px",
                        opacity: unlocked ? 1 : 0.55,
                        textDecoration: unlocked ? "none" : "line-through",
                        mb: 0.25,
                      }}
                    >
                      <strong>{row.name}</strong> (spell level {row.spellLevel}){" "}
                      <span style={{ opacity: 0.75 }}>
                        — unlocks at sorcerer {row.sorcererLevel}
                      </span>
                    </Typography>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default LunarEmbodimentPhaseModal;

