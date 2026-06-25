import * as React from "react";
import { useContext, useMemo } from "react";

import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../../components/ClassesData";
import { getFightingStyleForClass } from "../../utils/fightingStyles";
import MagicalSecretsStatus from "./MagicalSecretsStatus";

const AdditionalFightingStyleModal = ({ open, onClose }) => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const options = useMemo(() => {
    const raw = classesData?.fighter?.fightingStyleOptions || [];
    return Array.isArray(raw) ? raw : [];
  }, []);

  const primaryStyle = String(getFightingStyleForClass(characterInfo, "fighter") || "");
  const selected = String(characterInfo?.additionalFightingStyle || "");

  const toggle = (style) => {
    const next = String(style || "");
    if (!next) return;
    if (next === primaryStyle) return;
    setCharacterInfo((prev) => {
      const current = String(prev?.additionalFightingStyle || "");
      return { ...prev, additionalFightingStyle: current === next ? "" : next };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus label="Additional Fighting Style" totalAllowed={1} actualSelected={selected ? 1 : 0} />
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
          Choose <strong>one</strong> additional Fighting Style option.
        </Typography>
        {primaryStyle ? (
          <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
            Current Fighting Style: <strong>{primaryStyle}</strong>
          </Typography>
        ) : null}

        <Divider sx={{ my: 1 }} />

        {options.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No fighting style options found.
          </Typography>
        ) : null}

        {options.map((style) => {
          const label = String(style || "");
          if (!label) return null;
          const disabled = label === primaryStyle;
          const checked = label === selected;
          return (
            <div
              key={label}
              role="button"
              tabIndex={0}
              onClick={() => (!disabled ? toggle(label) : null)}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") toggle(label);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 2px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.55 : 1,
                userSelect: "none",
              }}
            >
              <Checkbox
                checked={checked}
                disabled={disabled}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggle(label)}
                size="small"
                sx={{ p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
              />
              <Typography sx={{ fontSize: "14px", fontWeight: 650, flexGrow: 1, minWidth: 0 }}>
                {label}
              </Typography>
              {disabled ? <Typography sx={{ fontSize: "12px", opacity: 0.8 }}>(already chosen)</Typography> : null}
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalFightingStyleModal;

