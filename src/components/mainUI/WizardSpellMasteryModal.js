import * as React from "react";
import { useContext } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import SpellAccordian from "./SpellAccordian";

const LEVEL_LABELS = {
  1: "1st-Level Spell Mastery",
  2: "2nd-Level Spell Mastery",
};

const WizardSpellMasteryModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const spellbook = characterInfo?.wizardSpellbook || {};
  const spellMastery = characterInfo?.wizardSpellMastery || {};

  const renderLevel = (level) => {
    const entries = Array.isArray(spellbook?.[level]) ? spellbook[level] : [];
    const selectedIndex = String(spellMastery?.[level]?.index || "");

    return (
      <Box key={`wizard-spell-mastery:${level}`} sx={{ mb: level === 1 ? 2 : 0 }}>
        <Typography sx={{ fontWeight: 700, color: "#5d4037", mb: 0.5 }}>
          {LEVEL_LABELS[level]}
        </Typography>
        {entries.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            No spells of this level are in the spellbook yet.
          </Typography>
        ) : (
          entries.map((spell, index) => {
            const isSelected = selectedIndex === String(spell?.index || "");
            return (
              <Box key={`wizard-spell-mastery:${level}:${spell?.index || index}`} sx={{ py: 0.2 }}>
                <SpellAccordian
                  numericalSpellLevel={level}
                  spell={spell}
                  actionButton={
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setCharacterInfo((prev) => ({
                          ...prev,
                          wizardSpellMastery: {
                            ...(prev?.wizardSpellMastery || {}),
                            [level]:
                              String(prev?.wizardSpellMastery?.[level]?.index || "") === String(spell?.index || "")
                                ? null
                                : spell,
                          },
                        }));
                      }}
                      sx={{
                        textTransform: "none",
                        fontSize: "12px",
                        minWidth: "auto",
                        backgroundColor: isSelected ? "#2e7d32" : "#5d4037",
                        "&:hover": { backgroundColor: isSelected ? "#1b5e20" : "#4e342e" },
                      }}
                    >
                      {isSelected ? "Chosen" : "Choose"}
                    </Button>
                  }
                />
              </Box>
            );
          })
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        Spell Mastery
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
          Choose one 1st-level and one 2nd-level spell from the wizard spellbook.
        </Typography>
        {renderLevel(1)}
        {renderLevel(2)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WizardSpellMasteryModal;
