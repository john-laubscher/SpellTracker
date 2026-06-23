import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { CharacterSessionContext } from "../Contexts/Context";
import AuthControls from "./AuthControls";
import ArtificerIcon from "../assets/class-icons/Artficer.png";
import BarbarianIcon from "../assets/class-icons/Barbarian.png";
import BardIcon from "../assets/class-icons/Bard.png";
import ClericIcon from "../assets/class-icons/Cleric.png";
import DruidIcon from "../assets/class-icons/Druid.png";
import FighterIcon from "../assets/class-icons/Fighter.png";
import MonkIcon from "../assets/class-icons/Monk.png";
import PaladinIcon from "../assets/class-icons/Paladin.png";
import RangerIcon from "../assets/class-icons/Ranger.png";
import RogueIcon from "../assets/class-icons/Rogue.png";
import SorcererIcon from "../assets/class-icons/Sorcerer.png";
import WarlockIcon from "../assets/class-icons/Warlock.png";
import WizardIcon from "../assets/class-icons/Wizard.png";
import { formatClassLevelSummary, getTotalCharacterLevel } from "../utils/multiclassing";

const CLASS_STYLES = {
  artificer: {
    image: ArtificerIcon,
    imageAlt: "Artificer",
    iconBackground: "linear-gradient(135deg, #2f6c69 0%, #62b4ad 100%)",
    borderColor: "rgba(98, 180, 173, 0.72)",
    borderGlow: "rgba(98, 180, 173, 0.24)",
    ribbon: "linear-gradient(90deg, #62b4ad 0%, #2f6c69 100%)",
    sigil: "✦",
  },
  barbarian: {
    image: BarbarianIcon,
    imageAlt: "Barbarian",
    iconBackground: "linear-gradient(135deg, #8e2f24 0%, #cf6f33 100%)",
    borderColor: "rgba(207, 111, 51, 0.72)",
    borderGlow: "rgba(207, 111, 51, 0.28)",
    ribbon: "linear-gradient(90deg, #cf6f33 0%, #8e2f24 100%)",
    sigil: "⚔",
  },
  bard: {
    image: BardIcon,
    imageAlt: "Bard",
    iconBackground: "linear-gradient(135deg, #7f2f67 0%, #db8d3f 100%)",
    borderColor: "rgba(219, 141, 63, 0.72)",
    borderGlow: "rgba(127, 47, 103, 0.22)",
    ribbon: "linear-gradient(90deg, #db8d3f 0%, #7f2f67 100%)",
    sigil: "♪",
  },
  cleric: {
    image: ClericIcon,
    imageAlt: "Cleric",
    iconBackground: "linear-gradient(135deg, #8e7443 0%, #d9b65d 100%)",
    borderColor: "rgba(217, 182, 93, 0.74)",
    borderGlow: "rgba(217, 182, 93, 0.24)",
    ribbon: "linear-gradient(90deg, #d9b65d 0%, #8e7443 100%)",
    sigil: "✦",
  },
  druid: {
    image: DruidIcon,
    imageAlt: "Druid",
    iconBackground: "linear-gradient(135deg, #366045 0%, #8ea857 100%)",
    borderColor: "rgba(142, 168, 87, 0.74)",
    borderGlow: "rgba(54, 96, 69, 0.24)",
    ribbon: "linear-gradient(90deg, #8ea857 0%, #366045 100%)",
    sigil: "❦",
  },
  fighter: {
    image: FighterIcon,
    imageAlt: "Fighter",
    iconBackground: "linear-gradient(135deg, #5f4630 0%, #b78656 100%)",
    borderColor: "rgba(183, 134, 86, 0.74)",
    borderGlow: "rgba(95, 70, 48, 0.24)",
    ribbon: "linear-gradient(90deg, #b78656 0%, #5f4630 100%)",
    sigil: "⚒",
  },
  monk: {
    image: MonkIcon,
    imageAlt: "Monk",
    iconBackground: "linear-gradient(135deg, #8b4c28 0%, #d59d59 100%)",
    borderColor: "rgba(213, 157, 89, 0.74)",
    borderGlow: "rgba(139, 76, 40, 0.22)",
    ribbon: "linear-gradient(90deg, #d59d59 0%, #8b4c28 100%)",
    sigil: "☯",
  },
  paladin: {
    image: PaladinIcon,
    imageAlt: "Paladin",
    iconBackground: "linear-gradient(135deg, #83612a 0%, #d6c06d 100%)",
    borderColor: "rgba(214, 192, 109, 0.76)",
    borderGlow: "rgba(131, 97, 42, 0.22)",
    ribbon: "linear-gradient(90deg, #d6c06d 0%, #83612a 100%)",
    sigil: "✠",
  },
  ranger: {
    image: RangerIcon,
    imageAlt: "Ranger",
    iconBackground: "linear-gradient(135deg, #3c5731 0%, #7fa35d 100%)",
    borderColor: "rgba(127, 163, 93, 0.76)",
    borderGlow: "rgba(60, 87, 49, 0.24)",
    ribbon: "linear-gradient(90deg, #7fa35d 0%, #3c5731 100%)",
    sigil: "➹",
  },
  rogue: {
    image: RogueIcon,
    imageAlt: "Rogue",
    iconBackground: "linear-gradient(135deg, #2f3449 0%, #6b6f87 100%)",
    borderColor: "rgba(107, 111, 135, 0.76)",
    borderGlow: "rgba(47, 52, 73, 0.26)",
    ribbon: "linear-gradient(90deg, #6b6f87 0%, #2f3449 100%)",
    sigil: "✧",
  },
  sorcerer: {
    image: SorcererIcon,
    imageAlt: "Sorcerer",
    iconBackground: "linear-gradient(135deg, #7c2445 0%, #d35d4e 100%)",
    borderColor: "rgba(211, 93, 78, 0.76)",
    borderGlow: "rgba(124, 36, 69, 0.26)",
    ribbon: "linear-gradient(90deg, #d35d4e 0%, #7c2445 100%)",
    sigil: "✹",
  },
  warlock: {
    image: WarlockIcon,
    imageAlt: "Warlock",
    iconBackground: "linear-gradient(135deg, #43295f 0%, #8360b3 100%)",
    borderColor: "rgba(131, 96, 179, 0.78)",
    borderGlow: "rgba(67, 41, 95, 0.28)",
    ribbon: "linear-gradient(90deg, #8360b3 0%, #43295f 100%)",
    sigil: "☾",
  },
  wizard: {
    image: WizardIcon,
    imageAlt: "Wizard",
    iconBackground: "linear-gradient(135deg, #214a75 0%, #5da5d8 100%)",
    borderColor: "rgba(93, 165, 216, 0.78)",
    borderGlow: "rgba(33, 74, 117, 0.28)",
    ribbon: "linear-gradient(90deg, #5da5d8 0%, #214a75 100%)",
    sigil: "✶",
  },
};

const DEFAULT_CLASS_STYLE = {
  icon: AutoAwesomeIcon,
  iconColor: "#fff8ec",
  iconBackground: "linear-gradient(135deg, #6a4b33 0%, #b68b5c 100%)",
  borderColor: "rgba(182, 139, 92, 0.72)",
  borderGlow: "rgba(106, 75, 51, 0.22)",
  ribbon: "linear-gradient(90deg, #b68b5c 0%, #6a4b33 100%)",
  sigil: "✦",
};

const formatDisplayValue = (value, fallback) => {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.startsWith("no")) return fallback;
  return normalized
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

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
            background:
              "radial-gradient(circle at top, rgba(111, 155, 120, 0.18), transparent 35%), linear-gradient(180deg, rgba(28,37,31,0.95) 0%, rgba(52,32,21,0.92) 100%)",
            border: "1px solid rgba(189, 154, 88, 0.34)",
            boxShadow: "0 18px 38px rgba(14, 9, 5, 0.42)",
          }}
        >
          <CardContent sx={{ py: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: { xs: "1.8rem", sm: "2.3rem" },
                color: "#f4e4be",
                textAlign: "center",
                mb: 1,
              }}
            >
              Choose Your Character
            </Typography>
            <Typography sx={{ color: "#d9c8a5", textAlign: "center", maxWidth: 700, mx: "auto" }}>
              Pick an adventurer to continue, or forge a new legend for your party.
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
            const info = character?.profile?.characterInfo || {};
            const classKey = String(info.characterClass || "").toLowerCase();
            const classStyle = CLASS_STYLES[classKey] || DEFAULT_CLASS_STYLE;
            const ClassIcon = classStyle.icon;
            const level = getTotalCharacterLevel(info);
            const race = formatDisplayValue(info.race, "Unknown Lineage");
            const classSummary = formatClassLevelSummary(info) || formatDisplayValue(info.characterClass, "Adventurer");
            const subtitle = `Lvl ${level} ${race} ${classSummary}`;
            return (
              <Grid item xs={12} md={6} key={character.id}>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: 248,
                    background:
                      "linear-gradient(145deg, rgba(29, 35, 33, 0.96) 0%, rgba(70, 44, 29, 0.94) 52%, rgba(24, 27, 26, 0.98) 100%)",
                    border: isActive
                      ? `2px solid ${classStyle.borderColor}`
                      : `1px solid ${classStyle.borderColor}`,
                    boxShadow: isActive
                      ? `0 18px 30px ${classStyle.borderGlow}`
                      : "0 12px 26px rgba(14, 9, 5, 0.28)",
                    "&::before": {
                      content: "\"\"",
                      position: "absolute",
                      inset: 0,
                      border: "1px solid rgba(240, 216, 171, 0.14)",
                      pointerEvents: "none",
                    },
                    "&::after": {
                      content: "\"\"",
                      position: "absolute",
                      right: 16,
                      bottom: 8,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 6,
                      background: classStyle.ribbon,
                      boxShadow: `0 0 18px ${classStyle.borderGlow}`,
                    }}
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      p: 2.25,
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2.5,
                          background: classStyle.iconBackground,
                          boxShadow: `0 8px 18px ${classStyle.borderGlow}`,
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        {classStyle.image ? (
                          <Box
                            component="img"
                            src={classStyle.image}
                            alt={classStyle.imageAlt}
                            sx={{
                              width: 36,
                              height: 36,
                              objectFit: "contain",
                              filter: "brightness(0) invert(1)",
                              opacity: 0.96,
                            }}
                          />
                        ) : (
                          <ClassIcon sx={{ color: classStyle.iconColor }} />
                        )}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.2rem",
                            color: "#f7ead1",
                            mb: 0.75,
                            fontFamily: "'Cinzel', serif",
                          }}
                        >
                          {character.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#d7c39e",
                            fontSize: "0.88rem",
                            mt: 0.25,
                            lineHeight: 1.35,
                            minHeight: "2.15em",
                            pr: 3,
                          }}
                        >
                          {subtitle}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1.5 }}>
                      <Button
                        variant={isActive ? "contained" : "outlined"}
                        fullWidth
                        sx={{
                          minHeight: 44,
                          color: isActive ? "#1d140d" : "#f1dfbc",
                          borderColor: "rgba(235, 204, 145, 0.45)",
                          background: isActive ? "linear-gradient(90deg, #f0c97b 0%, #d89a53 100%)" : "rgba(16, 11, 8, 0.22)",
                          "&:hover": {
                            borderColor: "rgba(235, 204, 145, 0.7)",
                            background: isActive
                              ? "linear-gradient(90deg, #f4d48f 0%, #dfaa62 100%)"
                              : "rgba(255, 230, 184, 0.08)",
                          },
                        }}
                        disabled={isCharactersLoading}
                        onClick={async () => {
                          await switchCharacter(character.id);
                          navigate("/mainUI");
                        }}
                      >
                        Continue Adventuring
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {!isCharactersLoading && characters.length === 0 ? (
          <Card
            sx={{
              mt: 2,
              background: "linear-gradient(180deg, rgba(34,42,38,0.94) 0%, rgba(68,44,29,0.9) 100%)",
              border: "1px solid rgba(189, 154, 88, 0.24)",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 1, color: "#f5e6c6" }}>No saved characters yet</Typography>
              <Typography sx={{ color: "#d5c3a0" }}>
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
