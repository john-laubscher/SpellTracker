import * as React from "react";
import { useContext, useMemo } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import SpellAccordian from "./SpellAccordian";

const WizardMasterScrivinerModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const [selectedIndexes, setSelectedIndexes] = React.useState([]);

  const availableSpells = useMemo(() => {
    const spellbook = characterInfo?.wizardSpellbook || {};
    return [1, 2].flatMap((level) => {
      const entries = Array.isArray(spellbook?.[level]) ? spellbook[level] : [];
      return entries
        .filter((spell) => String(spell?.index || "").trim())
        .map((spell) => ({ ...spell, level }));
    });
  }, [characterInfo?.wizardSpellbook]);

  React.useEffect(() => {
    if (!open) {
      setSelectedIndexes([]);
      return;
    }
    setSelectedIndexes([]);
  }, [open]);

  const selectedSet = new Set(selectedIndexes);

  const addSelected = () => {
    if (selectedIndexes.length === 0) return;
    const availableByIndex = new Map(availableSpells.map((spell) => [String(spell?.index || ""), spell]));
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.wizardScribesMasterScriviner) ? prev.wizardScribesMasterScriviner : [];
      const byIndex = new Map(current.map((entry) => [String(entry?.index || ""), { ...entry }]));

      selectedIndexes.forEach((idx) => {
        const spell = availableByIndex.get(String(idx));
        if (!spell) return;
        const existing = byIndex.get(String(idx));
        if (existing) {
          byIndex.set(String(idx), {
            ...existing,
            count: Math.max(1, Number(existing?.count || 1)) + 1,
          });
          return;
        }
        byIndex.set(String(idx), {
          index: spell.index,
          name: spell.name,
          level: spell.level,
          count: 1,
        });
      });

      return {
        ...prev,
        wizardScribesMasterScriviner: Array.from(byIndex.values()).sort((a, b) => {
          const levelDelta = Number(a?.level || 0) - Number(b?.level || 0);
          if (levelDelta !== 0) return levelDelta;
          return String(a?.name || "").localeCompare(String(b?.name || ""));
        }),
      };
    });
    setSelectedIndexes([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        Master Scriviner
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
          Choose one or more 1st- or 2nd-level spells from the wizard spellbook to add as Master Scriviner scrolls.
          Adding a selected spell again creates another instance of that scroll.
        </Typography>
        {availableSpells.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75 }}>
            No valid 1st- or 2nd-level spells are in the spellbook yet.
          </Typography>
        ) : (
          availableSpells.map((spell, index) => {
            const isSelected = selectedSet.has(String(spell?.index || ""));
            return (
              <Box key={`master-scriviner:${spell?.index || index}`} sx={{ py: 0.2 }}>
                <SpellAccordian
                  numericalSpellLevel={spell.level}
                  spell={spell}
                  actionButton={
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        const nextChecked = Boolean(e.target.checked);
                        const key = String(spell?.index || "");
                        setSelectedIndexes((prev) =>
                          nextChecked ? [...prev, key] : prev.filter((entry) => entry !== key)
                        );
                      }}
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
        <Button
          variant="contained"
          onClick={addSelected}
          disabled={selectedIndexes.length === 0}
          sx={{ textTransform: "none", backgroundColor: "#5d4037", "&:hover": { backgroundColor: "#4e342e" } }}
        >
          Add Selected
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WizardMasterScrivinerModal;
