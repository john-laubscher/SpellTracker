import * as React from "react";
import { useContext, useMemo } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import SpellAccordian from "./SpellAccordian";

const WizardOneWithTheWordModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const availableSpells = useMemo(() => {
    const spellbook = characterInfo?.wizardSpellbook || {};
    const rows = [];
    for (let level = 1; level <= 9; level += 1) {
      const entries = Array.isArray(spellbook?.[level]) ? spellbook[level] : [];
      entries.forEach((spell) => {
        if (!String(spell?.index || "").trim()) return;
        rows.push({ ...spell, level });
      });
    }
    return rows;
  }, [characterInfo?.wizardSpellbook]);

  const lostSpells = Array.isArray(characterInfo?.wizardScribesLostSpells)
    ? characterInfo.wizardScribesLostSpells
    : [];
  const lostSpellIndexes = new Set(lostSpells.map((spell) => String(spell?.index || "")));
  const selectedTotal = lostSpells.reduce((sum, spell) => sum + Math.max(0, Number(spell?.level) || 0), 0);
  const restCount = Math.max(0, Number(characterInfo?.wizardScribesLostSpellRestCount) || 0);

  const toggleLostSpell = (spell) => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const currentLost = Array.isArray(prev?.wizardScribesLostSpells) ? prev.wizardScribesLostSpells : [];
      const key = String(spell.index);
      const exists = currentLost.some((entry) => String(entry?.index || "") === key);
      const nextLost = exists
        ? currentLost.filter((entry) => String(entry?.index || "") !== key)
        : [...currentLost, { index: spell.index, name: spell.name, level: spell.level }];

      const currentPrepared = prev?.spellsPrepared || {};
      const nextPrepared = exists
        ? currentPrepared
        : Object.keys(currentPrepared).reduce((acc, levelKey) => {
            acc[levelKey] = Array.isArray(currentPrepared[levelKey])
              ? currentPrepared[levelKey].filter((entry) => String(entry?.index || "") !== key)
              : [];
            return acc;
          }, {});

      return {
        ...prev,
        wizardScribesLostSpells: nextLost.sort((a, b) => {
          const levelDelta = Number(a?.level || 0) - Number(b?.level || 0);
          if (levelDelta !== 0) return levelDelta;
          return String(a?.name || "").localeCompare(String(b?.name || ""));
        }),
        spellsPrepared: nextPrepared,
      };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        One with the Word
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
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 0.75 }}>
          Mark the wizard spells that disappear from the spellbook. Cantrips are excluded.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#5d4037", fontWeight: 700, mb: 1.25 }}>
          Selected spell levels: {selectedTotal} {restCount > 0 ? `| Long rests remaining: ${restCount}` : ""}
        </Typography>
        {availableSpells.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            No leveled wizard spells are in the spellbook yet.
          </Typography>
        ) : (
          availableSpells.map((spell, index) => {
            const isSelected = lostSpellIndexes.has(String(spell?.index || ""));
            return (
              <Box key={`one-with-the-word:${spell?.index || index}`} sx={{ py: 0.2 }}>
                <SpellAccordian
                  numericalSpellLevel={spell.level}
                  spell={spell}
                  dimmed={isSelected}
                  struckOut={isSelected}
                  actionButton={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleLostSpell(spell)}
                      size="small"
                      sx={{
                        p: 0.25,
                        color: "#8B4513",
                        "&.Mui-checked": { color: "#8B4513" },
                      }}
                    />
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

export default WizardOneWithTheWordModal;
