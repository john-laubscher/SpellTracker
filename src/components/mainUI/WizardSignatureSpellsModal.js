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

const SIGNATURE_BONUS_TAG = "wizard_signature_spell";

const WizardSignatureSpellsModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const spellbook = characterInfo?.wizardSpellbook || {};
  const entries = Array.isArray(spellbook?.[3]) ? spellbook[3] : [];
  const chosen = Array.isArray(characterInfo?.wizardSignatureSpells) ? characterInfo.wizardSignatureSpells : [];
  const chosenIndexes = new Set(chosen.map((spell) => String(spell?.index || "")));

  const toggleSpell = (spell) => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const currentChosen = Array.isArray(prev?.wizardSignatureSpells) ? prev.wizardSignatureSpells : [];
      const exists = currentChosen.some((entry) => String(entry?.index || "") === String(spell.index));
      const nextChosen = exists
        ? currentChosen.filter((entry) => String(entry?.index || "") !== String(spell.index))
        : [...currentChosen, spell];

      const currentPrepared = Array.isArray(prev?.spellsPrepared?.[3]) ? prev.spellsPrepared[3] : [];
      let nextPrepared = currentPrepared.filter(
        (entry) =>
          !(
            String(entry?.spelltrackerBonus || "") === SIGNATURE_BONUS_TAG &&
            String(entry?.index || "") === String(spell.index)
          )
      );

      if (!exists) {
        const withTag = {
          ...spell,
          spelltrackerBonus: SIGNATURE_BONUS_TAG,
          spelltrackerDoesNotCount: true,
        };
        const alreadyPrepared = nextPrepared.some((entry) => String(entry?.index || "") === String(spell.index));
        nextPrepared = alreadyPrepared
          ? nextPrepared.map((entry) => (String(entry?.index || "") === String(spell.index) ? withTag : entry))
          : [...nextPrepared, withTag];
      }

      return {
        ...prev,
        wizardSignatureSpells: nextChosen,
        spellsPrepared: {
          ...prev.spellsPrepared,
          3: nextPrepared,
        },
      };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        Signature Spells
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
          Choose two 3rd-level spells from the wizard spellbook. Signature Spells are tagged <strong>SS</strong> in
          the tracker and do not count against the wizard&apos;s prepared spell limit.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#5d4037", fontWeight: 700, mb: 1 }}>
          Chosen: {chosen.length}/2
        </Typography>
        {entries.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            No 3rd-level spells are in the spellbook yet.
          </Typography>
        ) : (
          entries.map((spell, index) => {
            const isSelected = chosenIndexes.has(String(spell?.index || ""));
            const disableAdd = !isSelected && chosen.length >= 2;
            return (
              <Box key={`wizard-signature:${spell?.index || index}`} sx={{ py: 0.2 }}>
                <SpellAccordian
                  numericalSpellLevel={3}
                  spell={spell}
                  actionButton={
                    <Button
                      variant="contained"
                      size="small"
                      disabled={disableAdd}
                      onClick={() => toggleSpell(spell)}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WizardSignatureSpellsModal;
