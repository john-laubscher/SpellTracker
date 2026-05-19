import * as React from "react";
import { useContext, useEffect, useMemo } from "react";

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

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../../components/ClassesData";
import MagicalSecretsStatus from "./MagicalSecretsStatus";

const getFighterLevel = (characterInfo) => {
  const raw = characterInfo?.classLevels?.fighter;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
  if (characterInfo?.characterClass === "fighter") return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  return 0;
};

const allowedManeuversByLevel = (fighterLevel) => {
  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
  if (level < 3) return 0;
  return 3 + (level >= 7 ? 2 : 0) + (level >= 10 ? 2 : 0) + (level >= 15 ? 2 : 0);
};

const BattleMasterManeuversModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const fighterLevel = useMemo(() => getFighterLevel(characterInfo), [characterInfo]);
  const allowed = useMemo(() => allowedManeuversByLevel(fighterLevel), [fighterLevel]);

  const maneuvers = useMemo(() => {
    const list = classesData?.fighter?.subclasses?.battleMaster?.maneuvers || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedIds = Array.isArray(characterInfo?.battleMasterManeuvers) ? characterInfo.battleMasterManeuvers : [];

  useEffect(() => {
    if (!open) return;
    if (allowed <= 0) return;
    // Prefill with the first 3 maneuvers for convenience when empty.
    if (Array.isArray(characterInfo?.battleMasterManeuvers) && characterInfo.battleMasterManeuvers.length > 0) return;
    const initial = maneuvers.slice(0, Math.min(3, allowed)).map((m) => m.id).filter(Boolean);
    if (initial.length === 0) return;
    setCharacterInfo((prev) => ({ ...prev, battleMasterManeuvers: initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (id) => {
    const key = String(id || "");
    if (!key) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.battleMasterManeuvers) ? prev.battleMasterManeuvers : [];
      const exists = current.includes(key);
      const next = exists ? current.filter((x) => x !== key) : [...current, key];
      return { ...prev, battleMasterManeuvers: next };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus label="Maneuvers" totalAllowed={allowed} actualSelected={selectedIds.length} />
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
          sx={{ mb: 1 }}
          control={
            <Switch
              checked={Boolean(characterInfo?.showManeuversInSpellTracker)}
              onChange={(e) =>
                setCharacterInfo((prev) => ({
                  ...prev,
                  showManeuversInSpellTracker: Boolean(e.target.checked),
                }))
              }
            />
          }
          label={
            <Typography sx={{ fontSize: "13px", color: "#3e2723" }}>
              Show maneuvers in the Maneuvers tracker panel
            </Typography>
          }
        />

        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          You normally know {allowed} maneuver{allowed === 1 ? "" : "s"} at Fighter level {fighterLevel}.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          <strong>Maneuver save DC:</strong> 8 + proficiency bonus + Strength or Dexterity modifier (whichever is higher)
        </Typography>

        <Divider sx={{ my: 1 }} />

        {maneuvers.map((maneuver) => {
          const id = maneuver?.id;
          const checked = id ? selectedIds.includes(id) : false;
          const descLines = Array.isArray(maneuver?.desc) ? maneuver.desc : maneuver?.desc ? [String(maneuver.desc)] : [];

          return (
            <Accordion
              key={id || maneuver?.name}
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
                  {maneuver?.name}
                </Typography>
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

export default BattleMasterManeuversModal;
