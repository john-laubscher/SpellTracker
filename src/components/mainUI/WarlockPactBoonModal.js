import * as React from "react";
import { useContext, useMemo } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../ClassesData";

const WarlockPactBoonModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const pactBoons = useMemo(() => {
    const list = classesData?.warlock?.pactBoons || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const selectedId = String(characterInfo?.warlockPactBoon || "");

  const choose = (id) => {
    const key = String(id || "");
    setCharacterInfo((prev) => ({
      ...prev,
      warlockPactBoon: prev?.warlockPactBoon === key ? "" : key,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        Pact Boon
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
          Choose the pact boon your patron granted you at 3rd level.
        </Typography>

        {pactBoons.map((boon) => {
          const id = String(boon?.id || "");
          const checked = selectedId === id;
          const descLines = Array.isArray(boon?.desc) ? boon.desc : boon?.desc ? [String(boon.desc)] : [];

          return (
            <Accordion
              key={id || boon?.name}
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
                  onChange={() => choose(id)}
                  size="small"
                  sx={{ p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
                />
                <Typography sx={{ fontSize: "14px", fontWeight: 650, flexGrow: 1, minWidth: 0 }}>
                  {boon?.name}
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
                  {descLines.map((line, idx) => <p key={`${id}:desc:${idx}`}>{line}</p>)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default WarlockPactBoonModal;
