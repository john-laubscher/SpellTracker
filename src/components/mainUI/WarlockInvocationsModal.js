import * as React from "react";
import { useContext, useMemo } from "react";

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
import classesData from "../ClassesData";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import { getWarlockInvocationAllowance } from "../warlockOptionsData";

const getWarlockLevel = (characterInfo) => {
  const raw = characterInfo?.classLevels?.warlock;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
  if (characterInfo?.characterClass === "warlock") {
    return Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  }
  return 0;
};

const normalize = (s) => String(s || "").trim().toLowerCase();

const invocationMatchesLevel = (prerequisite, warlockLevel) => {
  const match = String(prerequisite || "").match(/warlock\s+(\d+)|(\d+)(?:st|nd|rd|th)\s+level/i);
  if (!match) return true;
  const required = Number(match[1] || match[2] || 0);
  return warlockLevel >= required;
};

const invocationMatchesPact = (prerequisite, pactId) => {
  const prereq = normalize(prerequisite);
  if (!prereq) return true;
  if (prereq.includes("pact of the blade")) return pactId === "blade";
  if (prereq.includes("pact of the chain")) return pactId === "chain";
  if (prereq.includes("pact of the tome")) return pactId === "tome";
  if (prereq.includes("pact of the talisman")) return pactId === "talisman";
  return true;
};

const WarlockInvocationsModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const warlockLevel = useMemo(() => getWarlockLevel(characterInfo), [characterInfo]);
  const allowed = useMemo(() => getWarlockInvocationAllowance(warlockLevel), [warlockLevel]);
  const pactId = String(characterInfo?.warlockPactBoon || "");

  const invocations = useMemo(() => {
    const list = classesData?.warlock?.eldritchInvocations || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedIds = Array.isArray(characterInfo?.warlockInvocations)
    ? characterInfo.warlockInvocations
    : [];

  const toggle = (id) => {
    const key = String(id || "");
    if (!key) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.warlockInvocations) ? prev.warlockInvocations : [];
      const exists = current.includes(key);
      return {
        ...prev,
        warlockInvocations: exists ? current.filter((entry) => entry !== key) : [...current, key],
      };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus label="Eldritch Invocations" totalAllowed={allowed} actualSelected={selectedIds.length} />
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
          You normally know <strong>{allowed}</strong> invocation{allowed === 1 ? "" : "s"} at Warlock level {warlockLevel}.
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          The modal stays flexible so you can record house rules or temporary swaps, but prerequisites are shown and unavailable picks are dimmed.
        </Typography>

        <Divider sx={{ my: 1 }} />

        {invocations.map((invocation) => {
          const id = invocation?.id;
          const checked = id ? selectedIds.includes(id) : false;
          const prerequisite = String(invocation?.prerequisite || "");
          const meetsLevel = invocationMatchesLevel(prerequisite, warlockLevel);
          const meetsPact = invocationMatchesPact(prerequisite, pactId);
          const available = meetsLevel && meetsPact;
          const descLines = Array.isArray(invocation?.desc) ? invocation.desc : invocation?.desc ? [String(invocation.desc)] : [];

          return (
            <Accordion
              key={id || invocation?.name}
              disableGutters
              elevation={0}
              sx={{
                backgroundColor: "transparent",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
                opacity: available || checked ? 1 : 0.58,
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
                  disabled={!available && !checked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggle(id)}
                  size="small"
                  sx={{ p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
                />
                <Typography sx={{ fontSize: "14px", fontWeight: 650, flexGrow: 1, minWidth: 0 }}>
                  {invocation?.name}
                </Typography>
                {prerequisite ? (
                  <Typography sx={{ fontSize: "12px", opacity: 0.78, whiteSpace: "nowrap" }}>
                    {prerequisite}
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
                {!available ? (
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#b71c1c", mb: 0.75 }}>
                    Prerequisite not currently met.
                  </Typography>
                ) : null}
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

export default WarlockInvocationsModal;
