import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

const FeatureChoiceModal = ({
  open,
  onClose,
  title,
  helperText,
  options,
  selectedId,
  onSelect,
  allowClear = true,
}) => {
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelected = String(selectedId || "");

  const choose = (id) => {
    const next = String(id || "");
    if (!next) return;
    onSelect?.(safeSelected === next ? "" : next);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        {title || "Choose Option"}
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
        {helperText ? (
          <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
            {helperText}
          </Typography>
        ) : null}

        <Divider sx={{ my: 1 }} />

        {safeOptions.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No options found.
          </Typography>
        ) : null}

        {safeOptions.map((opt) => {
          const id = String(opt?.id || "");
          const name = String(opt?.name || id);
          if (!id) return null;
          const checked = id === safeSelected;
          const descLines = Array.isArray(opt?.desc)
            ? opt.desc
            : typeof opt?.desc === "string"
              ? [opt.desc]
              : [];

          return (
            <Box
              key={id}
              role="button"
              tabIndex={0}
              onClick={() => choose(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") choose(id);
              }}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                py: 0.75,
                px: 0.25,
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.45)" },
                borderRadius: 1,
              }}
            >
              <Checkbox
                checked={checked}
                onClick={(e) => e.stopPropagation()}
                onChange={() => choose(id)}
                size="small"
                sx={{ p: 0.25, mt: "2px", color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 650, lineHeight: 1.2 }}>
                  {name}
                </Typography>
                {descLines.map((line, idx) => (
                  <Typography
                    key={`${id}:desc:${idx}`}
                    sx={{ fontSize: "12.5px", opacity: 0.9, mt: idx === 0 ? 0.25 : 0.5, lineHeight: 1.25 }}
                  >
                    {String(line || "")}
                  </Typography>
                ))}
              </Box>
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1 }}>
        {allowClear ? (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => onSelect?.("")}
            sx={{ textTransform: "none" }}
          >
            Clear
          </Button>
        ) : null}
        <Button variant="contained" onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeatureChoiceModal;

