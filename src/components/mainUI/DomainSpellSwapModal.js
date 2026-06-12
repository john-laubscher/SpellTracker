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

import { AuthContext, CharacterInfoContext, CharacterSessionContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";

const normalizeCompareName = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const DomainSpellSwapModal = ({
  open,
  onClose,
  numericalSpellLevel,
  domainKey,
  originalSpell,
  spellClassKey = "cleric",
  swapLabel = "Domain Spell",
}) => {
  const { auth } = useContext(AuthContext);
  const token = auth?.token;
  const { activeCharacterId } = useContext(CharacterSessionContext);
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [search, setSearch] = React.useState("");
  const [classSpells, setClassSpells] = React.useState([]);
  const [customSpells, setCustomSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({ loading: false, error: "" });

  const originalIndex = String(originalSpell?.index || "");
  const swapsForDomain = characterInfo?.domainSpellSwaps?.[domainKey] || {};
  const currentSwap = swapsForDomain?.[originalIndex] || null;

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
    if (!spellClassKey) return;

    setLoadStatus({ loading: true, error: "" });
    axios
      .get(`/allspells/${numericalSpellLevel}/${spellClassKey}`)
      .then((res) => {
        const fetched = res.data?.results || [];
        setClassSpells(fetched);
        setLoadStatus({ loading: false, error: "" });
      })
      .catch(() => {
        setLoadStatus({
          loading: false,
          error: `Failed to load ${spellClassKey} spells. Is the backend running on port 3001?`,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, numericalSpellLevel, spellClassKey]);

  useEffect(() => {
    if (!open) return;
    if (!token || !activeCharacterId) {
      setCustomSpells([]);
      return;
    }
    if (!Number.isFinite(Number(numericalSpellLevel))) return;

    axios
      .get(`/custom-spells?level=${numericalSpellLevel}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { characterId: activeCharacterId },
      })
      .then((res) => setCustomSpells(res.data?.results || []))
      .catch(() => setCustomSpells([]));
  }, [activeCharacterId, open, numericalSpellLevel, token]);

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
      const nextSwaps = { ...(prev?.domainSpellSwaps || {}) };
      const currentDomain = { ...(nextSwaps?.[domainKey] || {}) };
      currentDomain[originalIndex] = spell;
      nextSwaps[domainKey] = currentDomain;
      return { ...prev, domainSpellSwaps: nextSwaps };
    });
    onClose();
  };

  const resetSwap = () => {
    if (!originalIndex) return;
    setCharacterInfo((prev) => {
      const nextSwaps = { ...(prev?.domainSpellSwaps || {}) };
      const currentDomain = { ...(nextSwaps?.[domainKey] || {}) };
      if (!currentDomain[originalIndex]) return prev;
      delete currentDomain[originalIndex];
      nextSwaps[domainKey] = currentDomain;
      return { ...prev, domainSpellSwaps: nextSwaps };
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label={`Swap ${swapLabel}`}
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
          Swapping <strong>{originalSpell?.name || swapLabel}</strong> (level {numericalSpellLevel}) for another{" "}
          <strong>{spellClassKey}</strong> spell (or a <strong>custom</strong> spell).
        </Typography>

        {currentSwap?.index ? (
          <Typography
            role="button"
            tabIndex={0}
            onClick={resetSwap}
            onKeyDown={(e) => (e.key === "Enter" ? resetSwap() : null)}
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
            Loading spells…
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
                    color: "rgba(7, 89, 133, 0.95)",
                    border: "1px solid rgba(7, 89, 133, 0.22)",
                    backgroundColor: "rgba(2, 132, 199, 0.08)",
                    "&:hover": { backgroundColor: "rgba(2, 132, 199, 0.12)" },
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

export default DomainSpellSwapModal;

