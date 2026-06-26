import * as React from "react";
import { useContext, useEffect, useMemo } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../../components/ClassesData";
import MagicalSecretsStatus from "./MagicalSecretsStatus";

const ArcaneShotOptionsModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const characterLevel = Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));

  const arcaneShotOptions = useMemo(() => {
    const list = classesData?.fighter?.subclasses?.arcaneArcher?.arcaneShotOptions || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedIds = Array.isArray(characterInfo?.arcaneShotOptions) ? characterInfo.arcaneShotOptions : [];
  const bonusSlots = Math.max(0, Math.trunc(Number(characterInfo?.arcaneShotBonusOptions) || 0));

  const baseAllowed = useMemo(() => {
    if (characterLevel < 3) return 0;
    return (
      2 +
      (characterLevel >= 7 ? 1 : 0) +
      (characterLevel >= 10 ? 1 : 0) +
      (characterLevel >= 15 ? 1 : 0) +
      (characterLevel >= 18 ? 1 : 0)
    );
  }, [characterLevel]);

  const allowed = baseAllowed + bonusSlots;

  useEffect(() => {
    if (!open) return;
    // If we have no saved selection, prefill with the first two options (to reduce setup friction).
    if (!Array.isArray(characterInfo?.arcaneShotOptions) || characterInfo.arcaneShotOptions.length > 0) return;
    const initial = arcaneShotOptions.slice(0, 2).map((o) => o.id).filter(Boolean);
    if (initial.length === 0) return;
    setCharacterInfo((prev) => ({ ...prev, arcaneShotOptions: initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (id) => {
    const key = String(id || "");
    if (!key) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.arcaneShotOptions) ? prev.arcaneShotOptions : [];
      const exists = current.includes(key);
      const next = exists ? current.filter((x) => x !== key) : [...current, key];
      return { ...prev, arcaneShotOptions: next };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Arcane Shot Options"
          totalAllowed={allowed}
          actualSelected={selectedIds.length}
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
        <FormControlLabel
          sx={{
            mb: 1.5,
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "fit-content",
            px: 1.5,
            py: 0.75,
            borderRadius: "999px",
            border: "1px solid rgba(124, 45, 18, 0.22)",
            backgroundColor: "rgba(124, 45, 18, 0.08)",
            boxShadow: "0 2px 10px rgba(62, 39, 35, 0.08)",
            "& .MuiFormControlLabel-label": {
              display: "flex",
              alignItems: "center",
            },
          }}
          control={
            <Switch
              checked={Boolean(characterInfo?.showArcaneShotsInSpellTracker)}
              onChange={(e) =>
                setCharacterInfo((prev) => ({
                  ...prev,
                  showArcaneShotsInSpellTracker: Boolean(e.target.checked),
                }))
              }
            />
          }
          label={
            <Typography sx={{ fontSize: "13px", color: "#3e2723", fontWeight: 600, textAlign: "center" }}>
              Show Arcane Shots in the Arcane Shot tracker panel
            </Typography>
          }
        />

        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          You normally know {baseAllowed} option{baseAllowed === 1 ? "" : "s"} at Fighter level {characterLevel}
          {bonusSlots > 0 ? ` (+${bonusSlots} bonus).` : "."}
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          <strong>Arcane Shot DC:</strong> 8 + proficiency bonus + Intelligence modifier
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#5d4037" }}>Bonus option slots</Typography>
          <IconButton
            size="small"
            aria-label="Decrease bonus option slots"
            onClick={() =>
              setCharacterInfo((prev) => ({
                ...prev,
                arcaneShotBonusOptions: Math.max(0, Math.trunc(Number(prev?.arcaneShotBonusOptions) || 0) - 1),
              }))
            }
            disabled={bonusSlots <= 0}
            sx={{ p: 0.25 }}
          >
            <RemoveIcon fontSize="inherit" />
          </IconButton>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#5d4037", minWidth: 18, textAlign: "center" }}>
            {bonusSlots}
          </Typography>
          <IconButton
            size="small"
            aria-label="Increase bonus option slots"
            onClick={() =>
              setCharacterInfo((prev) => ({
                ...prev,
                arcaneShotBonusOptions: Math.max(0, Math.trunc(Number(prev?.arcaneShotBonusOptions) || 0) + 1),
              }))
            }
            sx={{ p: 0.25 }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        {arcaneShotOptions.map((option) => {
          const id = option?.id;
          const checked = id ? selectedIds.includes(id) : false;
          const descLines = Array.isArray(option?.desc) ? option.desc : option?.desc ? [String(option.desc)] : [];

          return (
            <Accordion
              key={id || option?.name}
              disableGutters
              elevation={0}
              sx={{
                backgroundColor: "transparent",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px" }} />}
                sx={{
                  minHeight: 32,
                  px: 0.5,
                  py: 0,
                  "& .MuiAccordionSummary-content": {
                    margin: "4px 0 !important",
                    alignItems: "center",
                    gap: 0.5,
                    width: "100%",
                    display: "flex",
                  },
                  "&.Mui-expanded": { minHeight: 32 },
                }}
              >
                <Checkbox
                  checked={checked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggle(id)}
                  size="small"
                  sx={{ p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
                />
                <Typography sx={{ fontSize: "14px", fontWeight: 650, flexGrow: 1, minWidth: 0 }}>
                  {option?.name}
                </Typography>
                {option?.school ? (
                  <Typography sx={{ fontSize: "12px", opacity: 0.75, flexShrink: 0 }}>
                    {String(option.school).toUpperCase()}
                  </Typography>
                ) : null}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 1.5,
                  py: 1,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: "4px",
                  mx: 0.5,
                  mb: 0.5,
                }}
              >
                <Typography component="div" sx={{ fontSize: "13px", "& p": { margin: "2px 0" } }}>
                  {descLines.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>
                      <em>No description available.</em>
                    </p>
                  ) : (
                    descLines.map((line, idx) => <p key={`${id}:desc:${idx}`}>{line}</p>)
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default ArcaneShotOptionsModal;

