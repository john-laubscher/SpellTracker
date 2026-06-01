import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import { CharacterInfoContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";

const normalizeCompareName = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/['Ã¢â‚¬â„¢]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const DivineSoulAffinitySpellSwapModal = ({
  open,
  onClose,
  swapKey,
  originalSpell,
  maxSpellLevel = 9,
}) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [search, setSearch] = React.useState("");
  const [spellLevel, setSpellLevel] = React.useState(1);
  const [classSpells, setClassSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({ loading: false, error: "" });

  const originalIndex = String(originalSpell?.index || "");
  const swapsForKey = characterInfo?.psionicSpellSwaps?.[swapKey] || {};
  const currentSwap = swapsForKey?.[originalIndex] || null;

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSpellLevel(1);
    setClassSpells([]);
    setLoadStatus({ loading: false, error: "" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!Number.isFinite(Number(spellLevel))) return;
    if (loadStatus.loading) return;

    setLoadStatus({ loading: true, error: "" });

    axios
      .get(`/allspells/${spellLevel}/cleric`)
      .then((res) => {
        const fetched = res.data?.results || [];
        setClassSpells(fetched);
        setLoadStatus({ loading: false, error: "" });
      })
      .catch(() => {
        setLoadStatus({
          loading: false,
          error: "Failed to load spells. Is the backend running on port 3001?",
        });
      });
  }, [open, spellLevel, loadStatus.loading]);

  const filtered = useMemo(() => {
    const normalizedSearch = String(search || "").trim().toLowerCase();
    const unique = Array.isArray(classSpells) ? classSpells : [];
    if (!normalizedSearch) return unique;
    return unique.filter((s) => {
      const name = String(s?.name || "");
      return name.toLowerCase().includes(normalizedSearch) || normalizeCompareName(name).includes(normalizedSearch);
    });
  }, [classSpells, search]);

  const setSwap = (spell) => {
    if (!originalIndex || !spell?.index) return;
    setCharacterInfo((prev) => {
      const nextSwaps = { ...(prev?.psionicSpellSwaps || {}) };
      const currentKeySwaps = { ...(nextSwaps?.[swapKey] || {}) };
      currentKeySwaps[originalIndex] = spell;
      nextSwaps[swapKey] = currentKeySwaps;
      return { ...prev, psionicSpellSwaps: nextSwaps };
    });
    onClose();
  };

  const resetSwap = () => {
    if (!originalIndex) return;
    setCharacterInfo((prev) => {
      const nextSwaps = { ...(prev?.psionicSpellSwaps || {}) };
      const currentKeySwaps = { ...(nextSwaps?.[swapKey] || {}) };
      if (!currentKeySwaps[originalIndex]) return prev;
      delete currentKeySwaps[originalIndex];
      nextSwaps[swapKey] = currentKeySwaps;
      return { ...prev, psionicSpellSwaps: nextSwaps };
    });
    onClose();
  };

  const safeMaxSpellLevel = Math.max(1, Math.min(9, Math.trunc(Number(maxSpellLevel) || 9)));
  const spellLevelOptions = Array.from({ length: safeMaxSpellLevel }, (_, idx) => idx + 1);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Swap DM Spell"
          totalAllowed={1}
          actualSelected={currentSwap?.index ? 1 : 0}
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
          Swapping <strong>{originalSpell?.name || "Spell"}</strong> for another <strong>cleric</strong> spell.
        </Typography>

        {currentSwap?.index ? (
          <Typography
            role="button"
            tabIndex={0}
            onClick={resetSwap}
            onKeyDown={(e) => (e.key === "Enter" ? resetSwap() : null)}
            sx={{
              fontSize: "13px",
              color: "#4a148c",
              mb: 1,
              px: 0.5,
              py: 0.25,
              cursor: "pointer",
              textDecoration: "underline",
              display: "inline-block",
            }}
          >
            Reset to default
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <FormControl size="small" sx={{ flex: "0 0 140px" }}>
            <InputLabel id="dm-swap-level-label">Spell level</InputLabel>
            <Select
              labelId="dm-swap-level-label"
              label="Spell level"
              value={spellLevel}
              onChange={(e) => {
                const next = Math.trunc(Number(e.target.value) || 1);
                setClassSpells([]);
                setSpellLevel(next);
              }}
            >
              {spellLevelOptions.map((lvl) => (
                <MenuItem key={lvl} value={lvl}>
                  {lvl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Search spells"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: "1 1 320px" }}
          />
        </Box>

        {loadStatus.loading ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            Loading spellsâ€¦
          </Typography>
        ) : null}
        {loadStatus.error ? (
          <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
            {loadStatus.error}
          </Typography>
        ) : null}

        {!loadStatus.loading && !loadStatus.error && filtered.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No spells found.
          </Typography>
        ) : null}

        {filtered.map((spell, idx) => (
          <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
            <SpellAccordian
              numericalSpellLevel={Number(spellLevel)}
              spell={spell}
              actionButton={
                <IconButton
                  size="small"
                  aria-label="Select spell"
                  onClick={() => setSwap(spell)}
                  sx={{
                    p: 0.25,
                    color: "rgba(74, 20, 140, 0.92)",
                    border: "1px solid rgba(74, 20, 140, 0.22)",
                    backgroundColor: "rgba(74, 20, 140, 0.06)",
                    "&:hover": { backgroundColor: "rgba(74, 20, 140, 0.10)" },
                  }}
                >
                  <CheckIcon fontSize="inherit" />
                </IconButton>
              }
            />
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DivineSoulAffinitySpellSwapModal;
