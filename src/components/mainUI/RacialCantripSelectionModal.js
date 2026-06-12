import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";

const RacialCantripSelectionModal = ({
  open,
  onClose,
  title,
  helperText,
  storageKey,
  spellClassKey = "",
  spellClassKeys = [],
  spellIndexes = [],
  selectionMode = "single",
  maxSelections = 1,
  softLimit = false,
  allowRemove = false,
  duplicateChoiceLabel = "Already chosen.",
}) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [spells, setSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({ loading: false, error: "" });
  const [selectedSpellClassKey, setSelectedSpellClassKey] = React.useState("");

  const isMultiple = selectionMode === "multiple";
  const availableSpellClassKeys = useMemo(
    () => (Array.isArray(spellClassKeys) ? spellClassKeys.filter(Boolean) : []),
    [spellClassKeys]
  );
  const selected = useMemo(() => {
    const raw = characterInfo?.[storageKey];
    if (isMultiple) return Array.isArray(raw) ? raw : [];
    return raw && typeof raw === "object" ? raw : null;
  }, [characterInfo, isMultiple, storageKey]);

  const selectedArray = useMemo(() => (isMultiple ? selected : selected ? [selected] : []), [isMultiple, selected]);
  const selectedIndexes = useMemo(
    () => new Set(selectedArray.map((spell) => String(spell?.index || "")).filter(Boolean)),
    [selectedArray]
  );

  useEffect(() => {
    if (!open) return;
    setSpells([]);
    setLoadStatus({ loading: false, error: "" });
    setSelectedSpellClassKey(
      String(spellClassKey || availableSpellClassKeys[0] || "")
    );
  }, [availableSpellClassKeys, open, spellClassKey]);

  useEffect(() => {
    if (!open) return;
    if (loadStatus.loading) return;
    if (spells.length > 0) return;

    const explicitIndexes = Array.isArray(spellIndexes) ? spellIndexes.filter(Boolean) : [];
    const effectiveSpellClassKey = String(selectedSpellClassKey || spellClassKey || "");
    if (!effectiveSpellClassKey && explicitIndexes.length === 0) return;

    setLoadStatus({ loading: true, error: "" });

    const request =
      explicitIndexes.length > 0 && !effectiveSpellClassKey
        ? Promise.all(explicitIndexes.map((index) => axios.get(`/singlespell/${index}`))).then((responses) =>
            responses
              .map((res) => res?.data || null)
              .filter((spell) => spell?.index)
          )
        : axios.get(`/allspells/0/${effectiveSpellClassKey}`).then((res) => res?.data?.results || []);

    request
      .then((fetched) => setSpells(Array.isArray(fetched) ? fetched : []))
      .catch(() => {
        const sourceLabel =
          explicitIndexes.length > 0 && !effectiveSpellClassKey ? "cantrips" : `${effectiveSpellClassKey} cantrips`;
        setLoadStatus({
          loading: false,
          error: `Failed to load ${sourceLabel}. Is the backend running on port 3001?`,
        });
      })
      .finally(() => {
        setLoadStatus((prev) => ({ ...prev, loading: false }));
      });
  }, [loadStatus.loading, open, selectedSpellClassKey, spellClassKey, spellIndexes, spells.length]);

  const toggleSpell = (spell) => {
    if (!spell?.index) return;

    setCharacterInfo((prev) => {
      if (isMultiple) {
        const current = Array.isArray(prev?.[storageKey]) ? prev[storageKey] : [];
        const exists = current.some((entry) => String(entry?.index || "") === String(spell.index || ""));
        const next = exists
          ? current.filter((entry) => String(entry?.index || "") !== String(spell.index || ""))
          : [...current, spell];
        return { ...prev, [storageKey]: next };
      }

      return { ...prev, [storageKey]: spell };
    });

    if (!isMultiple) {
      onClose?.();
    }
  };

  const clearSingleSelection = () => {
    if (!allowRemove || isMultiple) return;
    setCharacterInfo((prev) => ({ ...prev, [storageKey]: null }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label={title}
          totalAllowed={maxSelections}
          actualSelected={selectedArray.length}
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
        {helperText ? (
          <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
            {helperText}
          </Typography>
        ) : null}

        {availableSpellClassKeys.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id={`${storageKey}-spell-list-label`}>Spell list</InputLabel>
              <Select
                labelId={`${storageKey}-spell-list-label`}
                value={selectedSpellClassKey}
                label="Spell list"
                onChange={(e) => {
                  setSpells([]);
                  setSelectedSpellClassKey(String(e.target.value || ""));
                }}
              >
                {availableSpellClassKeys.map((classKey) => (
                  <MenuItem key={classKey} value={classKey}>
                    {String(classKey).charAt(0).toUpperCase() + String(classKey).slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : null}

        {!isMultiple && allowRemove && selected?.name ? (
          <Typography
            role="button"
            tabIndex={0}
            onClick={clearSingleSelection}
            onKeyDown={(e) => (e.key === "Enter" ? clearSingleSelection() : null)}
            sx={{
              fontSize: "13px",
              color: "#075985",
              mb: 1,
              px: 0.5,
              py: 0.25,
              cursor: "pointer",
              textDecoration: "underline",
              display: "inline-block",
            }}
          >
            Clear selection
          </Typography>
        ) : null}

        {loadStatus.loading ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            Loading cantrips...
          </Typography>
        ) : null}
        {loadStatus.error ? (
          <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
            {loadStatus.error}
          </Typography>
        ) : null}

        {!loadStatus.loading && !loadStatus.error && spells.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No cantrips found.
          </Typography>
        ) : null}

        {spells.map((spell, idx) => {
          const spellIndex = String(spell?.index || "");
          const isSelected = selectedIndexes.has(spellIndex);
          const disableAdd = isMultiple && !softLimit && !isSelected && selectedArray.length >= maxSelections;

          return (
            <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
              <SpellAccordian
                numericalSpellLevel={0}
                spell={spell}
                actionButton={
                  <Button
                    size="small"
                    variant="contained"
                    disabled={disableAdd}
                    onClick={() => toggleSpell(spell)}
                    sx={{
                      fontSize: "12px",
                      padding: "2px 10px",
                      borderRadius: "4px",
                      textTransform: "none",
                      backgroundColor: isSelected ? "#2e7d32" : "#075985",
                      "&:hover": { backgroundColor: isSelected ? "#1b5e20" : "#0c4a6e" },
                    }}
                    title={
                      disableAdd
                        ? duplicateChoiceLabel
                        : isSelected
                          ? isMultiple
                            ? "Remove"
                            : "Selected"
                          : isMultiple
                            ? "Add"
                            : "Select"
                    }
                  >
                    {isSelected ? (isMultiple ? "Remove" : "Selected") : isMultiple ? "Add" : "Select"}
                  </Button>
                }
              />
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default RacialCantripSelectionModal;
