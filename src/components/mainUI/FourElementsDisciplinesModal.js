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
import ElementalDisciplinesStatus from "./ElementalDisciplinesStatus";

const getMonkLevel = (characterInfo) => {
  const raw = characterInfo?.classLevels?.monk;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
  if (characterInfo?.characterClass === "monk") return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  return 0;
};

const allowedExtraDisciplinesByLevel = (monkLevel) => {
  const level = Math.max(0, Math.trunc(Number(monkLevel) || 0));
  if (level < 3) return 0;
  return 1 + (level >= 6 ? 1 : 0) + (level >= 11 ? 1 : 0) + (level >= 17 ? 1 : 0);
};

const ATTUNEMENT_ID = "elemental_attunement";

const FourElementsDisciplinesModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const monkLevel = useMemo(() => getMonkLevel(characterInfo), [characterInfo]);
  const allowed = useMemo(() => allowedExtraDisciplinesByLevel(monkLevel), [monkLevel]);

  const disciplines = useMemo(() => {
    const list = classesData?.monk?.subclasses?.fourElements?.disciplines || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedIds = Array.isArray(characterInfo?.fourElementsDisciplines) ? characterInfo.fourElementsDisciplines : [];
  const selectedCount = selectedIds.length;

  useEffect(() => {
    if (!open) return;
    if (allowed <= 0) return;
    if (selectedIds.length > 0) return;
    const defaultId =
      disciplines.find((d) => d?.id === "fangs_of_the_fire_snake")?.id ||
      disciplines.find((d) => d?.id && d.id !== ATTUNEMENT_ID)?.id ||
      "";
    if (!defaultId) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.fourElementsDisciplines) ? prev.fourElementsDisciplines : [];
      if (current.length > 0) return prev;
      return { ...prev, fourElementsDisciplines: [defaultId] };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, allowed, disciplines]);

  const toggle = (id) => {
    const key = String(id || "");
    if (!key || key === ATTUNEMENT_ID) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.fourElementsDisciplines) ? prev.fourElementsDisciplines : [];
      const exists = current.includes(key);
      const next = exists ? current.filter((x) => x !== key) : [...current, key];
      return { ...prev, fourElementsDisciplines: next };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <ElementalDisciplinesStatus label="Elemental Disciplines" totalAllowed={allowed} actualSelected={selectedCount} />
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
          You normally choose {allowed} discipline{allowed === 1 ? "" : "s"} at Monk level {monkLevel} (plus Elemental Attunement).
        </Typography>

        <Divider sx={{ my: 1 }} />

        {disciplines.map((discipline) => {
          const id = String(discipline?.id || "");
          const isAttunement = id === ATTUNEMENT_ID;
          const checked = isAttunement ? true : id ? selectedIds.includes(id) : false;
          const descLines = Array.isArray(discipline?.desc) ? discipline.desc : discipline?.desc ? [String(discipline.desc)] : [];
          const prereq = Number(discipline?.prerequisiteLevel) || 0;
          const prereqLabel = prereq > 0 ? `Prereq: Monk ${prereq}+` : "";
          const costLabel = String(discipline?.costLabel || "").trim();
          const summaryRight = [costLabel, prereqLabel].filter(Boolean).join(" • ");

          return (
            <Accordion
              key={id || discipline?.name}
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
                  disabled={isAttunement}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggle(id)}
                  size="small"
                  sx={{ p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
                />
                <Typography sx={{ fontSize: "14px", fontWeight: 650, flexGrow: 1, minWidth: 0 }}>
                  {discipline?.name}
                </Typography>
                {summaryRight ? (
                  <Typography sx={{ fontSize: "12px", opacity: 0.7, whiteSpace: "nowrap" }}>
                    {summaryRight}
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

export default FourElementsDisciplinesModal;

