import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { AuthContext, CharacterInfoContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";

const normalizeCompareName = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/['â€™]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const PsionicSpellSwapModal = ({ open, onClose, numericalSpellLevel, psionicKey, originalSpell }) => {
  const { auth } = useContext(AuthContext);
  const token = auth?.token;
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [search, setSearch] = React.useState("");
  const [classSpells, setClassSpells] = React.useState([]);
  const [customSpells, setCustomSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({ loading: false, error: "" });

  const originalIndex = String(originalSpell?.index || "");
  const swapsForKey = characterInfo?.psionicSpellSwaps?.[psionicKey] || {};
  const currentSwap = swapsForKey?.[originalIndex] || null;

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setClassSpells([]);
    setCustomSpells([]);
    setLoadStatus({ loading: false, error: "" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!Number.isFinite(Number(numericalSpellLevel))) return;
    if (loadStatus.loading) return;
    if (classSpells.length > 0) return;

    setLoadStatus({ loading: true, error: "" });
    const classKeys = ["sorcerer", "warlock", "wizard"];

    Promise.all(classKeys.map((k) => axios.get(`/allspells/${numericalSpellLevel}/${k}`)))
      .then((responses) => {
        const combined = [];
        const seen = new Set();

        responses.forEach((r) => {
          const list = r?.data?.results || [];
          list.forEach((spell) => {
            const key = String(spell?.index || spell?.url || "");
            if (!key || seen.has(key)) return;
            seen.add(key);
            combined.push(spell);
          });
        });

        setClassSpells(combined);
        setLoadStatus({ loading: false, error: "" });
      })
      .catch(() => {
        setLoadStatus({
          loading: false,
          error: "Failed to load spells. Is the backend running on port 3001?",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, numericalSpellLevel, psionicKey]);

  useEffect(() => {
    if (!open) return;
    if (!token) {
      setCustomSpells([]);
      return;
    }
    if (!Number.isFinite(Number(numericalSpellLevel))) return;

    axios
      .get(`/custom-spells?level=${numericalSpellLevel}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCustomSpells(res.data?.results || []))
      .catch(() => setCustomSpells([]));
  }, [open, numericalSpellLevel, token]);

  const filtered = useMemo(() => {
    const normalizedSearch = String(search || "").trim().toLowerCase();
    const combined = [...(classSpells || []), ...(customSpells || [])];

    const seen = new Set();
    const unique = combined.filter((s) => {
      const key = String(s?.index || s?.url || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (!normalizedSearch) return unique;
    return unique.filter((s) => {
      const name = String(s?.name || "");
      return name.toLowerCase().includes(normalizedSearch) || normalizeCompareName(name).includes(normalizedSearch);
    });
  }, [classSpells, customSpells, search]);

  const setSwap = (spell) => {
    if (!originalIndex || !spell?.index) return;
    setCharacterInfo((prev) => {
      const nextSwaps = { ...(prev?.psionicSpellSwaps || {}) };
      const currentKeySwaps = { ...(nextSwaps?.[psionicKey] || {}) };
      currentKeySwaps[originalIndex] = spell;
      nextSwaps[psionicKey] = currentKeySwaps;
      return { ...prev, psionicSpellSwaps: nextSwaps };
    });
    onClose();
  };

  const resetSwap = () => {
    if (!originalIndex) return;
    setCharacterInfo((prev) => {
      const nextSwaps = { ...(prev?.psionicSpellSwaps || {}) };
      const currentKeySwaps = { ...(nextSwaps?.[psionicKey] || {}) };
      if (!currentKeySwaps[originalIndex]) return prev;
      delete currentKeySwaps[originalIndex];
      nextSwaps[psionicKey] = currentKeySwaps;
      return { ...prev, psionicSpellSwaps: nextSwaps };
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Swap Psionic Spell"
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
          Swapping <strong>{originalSpell?.name || "Psionic spell"}</strong> (level {numericalSpellLevel}) for another{" "}
          <strong>sorcerer</strong>, <strong>warlock</strong>, or <strong>wizard</strong> spell (or a{" "}
          <strong>custom</strong> spell).
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

        {!token ? (
          <Typography sx={{ fontSize: "12px", opacity: 0.75, px: 0.5, py: 0.25, mb: 0.5 }}>
            Log in to include custom spells in this list.
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
              numericalSpellLevel={numericalSpellLevel}
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
                  <Typography sx={{ fontSize: "12px", px: 0.75, fontWeight: 700 }}>Swap</Typography>
                </IconButton>
              }
            />
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default PsionicSpellSwapModal;

