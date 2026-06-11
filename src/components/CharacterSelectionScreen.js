import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { CharacterSessionContext } from "../Contexts/Context";
import AuthControls from "./AuthControls";

export default function CharacterSelectionScreen() {
  const navigate = useNavigate();
  const {
    characters,
    activeCharacterId,
    isCharactersLoading,
    characterError,
    createCharacter,
    switchCharacter,
    canCreateCharacter,
  } = React.useContext(CharacterSessionContext);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [draftName, setDraftName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const handleCreate = async () => {
    const nextName = String(draftName || "").trim();
    if (!nextName) {
      setSubmitError("Character name is required.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const created = await createCharacter(nextName);
      setCreateOpen(false);
      setDraftName("");
      if (created?.id) {
        await switchCharacter(created.id);
        navigate("/character");
      }
    } catch (error) {
      const status = error?.response?.status;
      const apiError = error?.response?.data?.error;
      setSubmitError(
        apiError === "character_limit_reached"
          ? "You have reached the 5 character limit."
          : status === 404
            ? "Character saving is unavailable right now. The backend may need to be restarted."
            : "Unable to create that character right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", px: 2, py: 5, position: "relative" }}>
      <Box sx={{ position: "fixed", top: 12, right: 12, zIndex: 2000 }}>
        <AuthControls onLoggedOutNavigateTo="/" />
      </Box>

      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        <Card
          sx={{
            mb: 3,
            background: "linear-gradient(180deg, rgba(255,248,235,0.96) 0%, rgba(248,240,226,0.94) 100%)",
            border: "1px solid rgba(88, 55, 28, 0.22)",
            boxShadow: "0 14px 32px rgba(24, 12, 5, 0.24)",
          }}
        >
          <CardContent sx={{ py: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: { xs: "1.8rem", sm: "2.3rem" },
                color: "#2f1a0d",
                textAlign: "center",
                mb: 1,
              }}
            >
              Choose Your Character
            </Typography>
            <Typography sx={{ color: "#5a3b24", textAlign: "center", maxWidth: 700, mx: "auto" }}>
              Pick an adventurer to continue, or create a new one. Use `Open Tracker` to jump into spells and features,
              or `Edit Character` to change class, race, stats, and build details.
            </Typography>
          </CardContent>
        </Card>

        {characterError ? <Alert severity="error" sx={{ mb: 2 }}>{characterError}</Alert> : null}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button variant="contained" disabled={!canCreateCharacter} onClick={() => setCreateOpen(true)}>
            Create New Character
          </Button>
        </Box>

        <Grid container spacing={2}>
          {characters.map((character) => {
            const isActive = character.id === activeCharacterId;
            return (
              <Grid item xs={12} md={6} key={character.id}>
                <Card
                  sx={{
                    backgroundColor: isActive ? "rgba(255, 248, 225, 0.98)" : "rgba(255,255,255,0.96)",
                    border: isActive ? "2px solid rgba(139,69,19,0.55)" : "1px solid rgba(139,69,19,0.18)",
                    boxShadow: "0 10px 24px rgba(24, 12, 5, 0.18)",
                  }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#24150b", mb: 1 }}>
                        {character.name}
                      </Typography>
                      <Typography sx={{ color: "#69462b", fontSize: "0.84rem", mt: 1 }}>
                        {isActive ? "Currently selected character" : "Saved to your account"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, pt: 1 }}>
                      <Button
                        variant={isActive ? "contained" : "outlined"}
                        fullWidth
                        sx={{ minHeight: 44 }}
                        disabled={isCharactersLoading}
                        onClick={async () => {
                          await switchCharacter(character.id);
                          navigate("/mainUI");
                        }}
                      >
                        {isActive ? "Open Tracker" : "Use In Tracker"}
                      </Button>
                      <Button
                        variant="text"
                        fullWidth
                        sx={{ minHeight: 44 }}
                        disabled={isCharactersLoading}
                        onClick={async () => {
                          await switchCharacter(character.id);
                          navigate("/character");
                        }}
                      >
                        Edit Character
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {!isCharactersLoading && characters.length === 0 ? (
          <Card sx={{ mt: 2, backgroundColor: "rgba(255,255,255,0.9)" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>No saved characters yet</Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Create your first character to sync it across devices.
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Box>

      <Dialog open={createOpen} onClose={() => (!submitting ? setCreateOpen(false) : null)} fullWidth maxWidth="xs">
        <DialogTitle>Create Character</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            fullWidth
            label="Character Name"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
          />
          {submitError ? <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert> : null}
        </DialogContent>
        <DialogActions>
          <Button disabled={submitting} onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button disabled={submitting} onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
