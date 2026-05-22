import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const clampOption = (raw, maxLen) => String(raw || "").trim().slice(0, maxLen);

const UntrackedOptionsModal = ({
  open,
  onClose,
  title,
  helperText,
  options,
  onChange,
  maxLen = 25,
}) => {
  const [draft, setDraft] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [editingDraft, setEditingDraft] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setDraft("");
    setEditingIndex(-1);
    setEditingDraft("");
  }, [open]);

  const safeOptions = Array.isArray(options) ? options : [];

  const handleAdd = () => {
    const nextText = clampOption(draft, maxLen);
    if (!nextText) return;
    if (safeOptions.includes(nextText)) {
      setDraft("");
      return;
    }
    onChange?.([...safeOptions, nextText]);
    setDraft("");
  };

  const beginEdit = (idx) => {
    const current = clampOption(safeOptions[idx], maxLen);
    setEditingIndex(idx);
    setEditingDraft(current);
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditingDraft("");
  };

  const saveEdit = () => {
    if (editingIndex < 0) return;
    const nextText = clampOption(editingDraft, maxLen);
    if (!nextText) return;

    const next = safeOptions.map((v, idx) => (idx === editingIndex ? nextText : v));
    const deduped = next.filter((v, idx) => next.indexOf(v) === idx);
    onChange?.(deduped);
    cancelEdit();
  };

  const deleteOption = (idx) => {
    const next = safeOptions.filter((_, i) => i !== idx);
    onChange?.(next);
    if (editingIndex === idx) cancelEdit();
  };

  const canAdd = clampOption(draft, maxLen).length > 0;

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
          {title || "Options"}
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
        {helperText ? (
          <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
            {helperText}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <TextField
            size="small"
            label={`Add option (max ${maxLen})`}
            value={draft}
            onChange={(e) => setDraft(String(e.target.value || "").slice(0, maxLen))}
            inputProps={{ maxLength: maxLen }}
            sx={{ flex: "1 1 260px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            size="small"
            variant="contained"
            onClick={handleAdd}
            disabled={!canAdd}
            sx={{ textTransform: "none" }}
          >
            Add
          </Button>
        </Box>

        {safeOptions.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No options added yet.
          </Typography>
        ) : null}

        {safeOptions.map((value, idx) => {
          const isEditing = idx === editingIndex;
          return (
            <Box
              key={`${value}-${idx}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 0.75,
                py: 0.5,
                borderRadius: "6px",
                border: "1px solid rgba(93, 64, 55, 0.18)",
                backgroundColor: "rgba(255,255,255,0.55)",
                mb: 0.75,
              }}
            >
              {!isEditing ? (
                <Typography sx={{ fontSize: "13px", flex: "1 1 auto", minWidth: 0 }}>
                  {value}
                </Typography>
              ) : (
                <TextField
                  size="small"
                  value={editingDraft}
                  onChange={(e) => setEditingDraft(String(e.target.value || "").slice(0, maxLen))}
                  inputProps={{ maxLength: maxLen }}
                  sx={{ flex: "1 1 auto" }}
                />
              )}

              {!isEditing ? (
                <>
                  <IconButton size="small" aria-label="Edit option" onClick={() => beginEdit(idx)}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" aria-label="Delete option" onClick={() => deleteOption(idx)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" aria-label="Save option" onClick={saveEdit}>
                    <SaveIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" aria-label="Cancel edit" onClick={cancelEdit}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </>
              )}
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default UntrackedOptionsModal;
