import * as React from "react";
import { useContext, useEffect, useMemo } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../../components/ClassesData";
import MagicalSecretsStatus from "./MagicalSecretsStatus";

const getSorcererLevel = (characterInfo) => {
  const raw = characterInfo?.classLevels?.sorcerer;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
  if (characterInfo?.characterClass === "sorcerer" || characterInfo?.characterClass === "sorceror") {
    return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  }
  return 0;
};

const allowedMetamagicByLevel = (sorcererLevel) => {
  const level = Math.max(0, Math.trunc(Number(sorcererLevel) || 0));
  if (level < 3) return 0;
  if (level >= 17) return 4;
  if (level >= 10) return 3;
  return 2;
};

const formatCost = (cost) => {
  if (cost === "spell_level") return "Spell level (1 for cantrip)";
  const n = Number(cost);
  if (Number.isFinite(n)) return `${n} SP`;
  return "";
};

const MetamagicOptionsModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const sorcererLevel = useMemo(() => getSorcererLevel(characterInfo), [characterInfo]);
  const allowed = useMemo(() => allowedMetamagicByLevel(sorcererLevel), [sorcererLevel]);

  const options = useMemo(() => {
    const list = classesData?.sorcerer?.metamagicOptions || classesData?.sorceror?.metamagicOptions || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedIds = Array.isArray(characterInfo?.metamagicOptions) ? characterInfo.metamagicOptions : [];

  useEffect(() => {
    if (!open) return;
    if (allowed <= 0) return;
    if (Array.isArray(characterInfo?.metamagicOptions) && characterInfo.metamagicOptions.length > 0) return;
    const initial = options.slice(0, Math.min(2, allowed)).map((o) => o.id).filter(Boolean);
    if (initial.length === 0) return;
    setCharacterInfo((prev) => ({ ...prev, metamagicOptions: initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (id) => {
    const key = String(id || "");
    if (!key) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.metamagicOptions) ? prev.metamagicOptions : [];
      const exists = current.includes(key);
      const next = exists ? current.filter((x) => x !== key) : [...current, key];
      return { ...prev, metamagicOptions: next };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus label="Metamagic" totalAllowed={allowed} actualSelected={selectedIds.length} />
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
          You normally know {allowed} Metamagic option{allowed === 1 ? "" : "s"} at Sorcerer level {sorcererLevel}.
        </Typography>
        <Divider sx={{ my: 1 }} />

        {options.map((option) => {
          const id = option?.id;
          const checked = id ? selectedIds.includes(id) : false;
          const descLines = Array.isArray(option?.desc) ? option.desc : option?.desc ? [String(option.desc)] : [];
          const costLabel = formatCost(option?.cost);

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
                {costLabel ? (
                  <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "rgba(62, 39, 35, 0.75)" }}>
                    {costLabel}
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

export default MetamagicOptionsModal;

