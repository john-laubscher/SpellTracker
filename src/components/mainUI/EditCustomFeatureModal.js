import * as React from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { AuthContext, CharacterSessionContext } from "../../Contexts/Context";

const EditCustomFeatureModal = ({ open, feature, onClose, onUpdated }) => {
  const { auth } = React.useContext(AuthContext);
  const { activeCharacterId } = React.useContext(CharacterSessionContext);
  const token = auth?.token;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setError("");
    setSaving(false);
    setTitle(String(feature?.name || ""));
    setDescription(String(feature?.desc || ""));
  }, [open, feature?.id, feature?.name, feature?.desc]);

  const canSave = Boolean(token) && Boolean(activeCharacterId) && Boolean(title.trim()) && Boolean(feature?.apiId);

  const submit = async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.put(
        `/custom-features/${feature.apiId}`,
        { title: title.trim(), description: description.trim(), characterId: activeCharacterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data || null;
      if (typeof onUpdated === "function") onUpdated(updated);
      onClose();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setError("Please log in to edit custom features.");
      else setError("Failed to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Cinzel', serif" }}>Edit Custom Feature</DialogTitle>
      <DialogContent dividers>
        {!token ? (
          <Typography sx={{ color: "error.main", fontSize: "13px" }}>
            Please log in to edit custom features.
          </Typography>
        ) : (
          <Box>
            <TextField
              fullWidth
              label="Feature Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 1 }}
            />
            {error ? (
              <Typography sx={{ color: "error.main", fontSize: "13px" }}>{error}</Typography>
            ) : null}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={submit} variant="contained" disabled={!canSave || saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomFeatureModal;
