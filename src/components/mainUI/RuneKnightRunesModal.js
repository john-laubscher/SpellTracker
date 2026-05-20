import * as React from "react";
import { useContext, useMemo } from "react";

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

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../../components/ClassesData";
import MagicalSecretsStatus from "./MagicalSecretsStatus";

const getFighterLevel = (characterInfo) => {
  const raw = characterInfo?.classLevels?.fighter;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
  if (characterInfo?.characterClass === "fighter") {
    return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  }
  return 0;
};

const allowedRunesByLevel = (fighterLevel) => {
  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
  if (level < 3) return 0;
  return 2 + (level >= 7 ? 1 : 0) + (level >= 10 ? 1 : 0) + (level >= 15 ? 1 : 0);
};

const RuneKnightRunesModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const fighterLevel = useMemo(() => getFighterLevel(characterInfo), [characterInfo]);
  const allowed = useMemo(() => allowedRunesByLevel(fighterLevel), [fighterLevel]);

  const runes = useMemo(() => {
    const list = classesData?.fighter?.subclasses?.runeKnight?.runes || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedIds = Array.isArray(characterInfo?.runeKnightRunes) ? characterInfo.runeKnightRunes : [];

  const toggle = (id) => {
    const key = String(id || "");
    if (!key) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.runeKnightRunes) ? prev.runeKnightRunes : [];
      const exists = current.includes(key);
      if (exists) {
        return { ...prev, runeKnightRunes: current.filter((x) => x !== key) };
      }
      return { ...prev, runeKnightRunes: [...current, key] };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus label="Runes" totalAllowed={allowed} actualSelected={selectedIds.length} />
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
          You can know {allowed} rune{allowed === 1 ? "" : "s"} at Fighter level {fighterLevel}.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          Hill Rune and Storm Rune require Fighter level 7.
        </Typography>

        <Divider sx={{ my: 1 }} />

        {runes.map((rune) => {
          const id = rune?.id;
          const checked = id ? selectedIds.includes(id) : false;
          const req = Math.max(0, Math.trunc(Number(rune?.levelRequirement) || 0));
          const isLocked = req > 0 && fighterLevel < req;
          const descLines = Array.isArray(rune?.desc) ? rune.desc : rune?.desc ? [String(rune.desc)] : [];

          return (
            <Accordion
              key={id || rune?.name}
              disableGutters
              elevation={0}
              sx={{
                backgroundColor: "transparent",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
                opacity: isLocked ? 0.7 : 1,
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
                  disabled={isLocked && !checked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggle(id)}
                  size="small"
                  sx={{ p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
                />
                <Typography sx={{ fontSize: "14px", fontWeight: 650, flexGrow: 1, minWidth: 0 }}>
                  {rune?.name}
                </Typography>
                {req > 0 ? (
                  <Typography sx={{ fontSize: "12px", opacity: 0.75, whiteSpace: "nowrap" }}>
                    Req: L{req}
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

export default RuneKnightRunesModal;
