import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import SpellAccordian from "./SpellAccordian";

const CelestialBonusCantripSwapModal = ({ open, originalSpell, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [spells, setSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({ loading: false, error: "", loaded: false });

  useEffect(() => {
    if (!open) return;
    setLoadStatus((s) => ({ ...s, loading: false, error: "" }));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (loadStatus.loading) return;
    if (loadStatus.loaded) return;

    setLoadStatus((s) => ({ ...s, loading: true, error: "" }));
    axios
      .get("/allspells/0/warlock")
      .then((res) => {
        const fetched = res.data?.results || [];
        setSpells(fetched);
        setLoadStatus({ loading: false, error: "", loaded: true });
      })
      .catch(() => {
        setLoadStatus((s) => ({
          ...s,
          loading: false,
          loaded: false,
          error: "Failed to load warlock cantrips. Is the backend running on port 3001?",
        }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadStatus.loading, loadStatus.loaded]);

  const bonusTag = String(originalSpell?.spelltrackerBonus || "");
  const originalIndex = String(originalSpell?.index || "");

  const chosenIndexes = useMemo(() => {
    const chosen = Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : [];
    return new Set(
      chosen
        .filter((s) => String(s?.spelltrackerBonus || "").startsWith("celestial_bonus_cantrip_"))
        .map((s) => String(s?.index || ""))
        .filter(Boolean)
    );
  }, [characterInfo?.spellsPrepared]);

  const handleSwap = (nextSpell) => {
    const nextIndex = String(nextSpell?.index || "");
    if (!bonusTag || !nextIndex) return;

    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
      const next = current.map((spell) =>
        String(spell?.spelltrackerBonus || "") === bonusTag
          ? {
              ...nextSpell,
              spelltrackerBonus: bonusTag,
              spelltrackerDoesNotCount: true,
              spelltrackerOrigin: String(originalSpell?.spelltrackerOrigin || originalIndex || ""),
            }
          : spell
      );
      return {
        ...prev,
        spellsPrepared: {
          ...prev.spellsPrepared,
          0: next,
        },
      };
    });

    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <Typography
          sx={{
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          Swap Celestial Bonus Cantrip
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
        {originalSpell?.name ? (
          <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
            Current: <strong>{originalSpell.name}</strong>
          </Typography>
        ) : null}

        {loadStatus.loading ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            Loading warlock cantrips...
          </Typography>
        ) : null}
        {loadStatus.error ? (
          <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
            {loadStatus.error}
          </Typography>
        ) : null}

        {!loadStatus.loading && loadStatus.loaded && !loadStatus.error && spells.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No cantrips found.
          </Typography>
        ) : null}

        {spells.map((spell, idx) => {
          const idxKey = String(spell?.index || idx);
          const isCurrent = idxKey && idxKey === originalIndex;
          const isAlreadyChosenElsewhere = idxKey && chosenIndexes.has(idxKey) && !isCurrent;
          const disabled = !spell?.index || isAlreadyChosenElsewhere;
          const tooltip = isAlreadyChosenElsewhere
            ? "Already chosen as the other Celestial bonus cantrip."
            : isCurrent
              ? "Already selected."
              : "Swap to this cantrip.";

          return (
            <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
              <SpellAccordian
                numericalSpellLevel={0}
                spell={spell}
                actionButton={
                  <Button
                    size="small"
                    variant="contained"
                    disabled={disabled || isCurrent}
                    onClick={() => handleSwap(spell)}
                    sx={{
                      fontSize: "12px",
                      padding: "2px 10px",
                      borderRadius: "4px",
                      textTransform: "none",
                      backgroundColor: disabled || isCurrent ? "rgba(0,0,0,0.20)" : "#c2410c",
                      "&:hover": { backgroundColor: disabled || isCurrent ? "rgba(0,0,0,0.20)" : "#9a3412" },
                    }}
                    title={tooltip}
                  >
                    Swap
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

export default CelestialBonusCantripSwapModal;
