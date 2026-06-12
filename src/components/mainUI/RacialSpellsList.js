import React from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import SpellAccordian from "./SpellAccordian";

const GIANTS_POWER_CANTRIPS = [
  { index: "druidcraft", label: "Druidcraft" },
  { index: "thaumaturgy", label: "Thaumaturgy" },
];

const getGiantsPowerPreparedIndex = (characterInfo) => {
  const cantrips = Array.isArray(characterInfo?.spellsPrepared?.[0])
    ? characterInfo.spellsPrepared[0]
    : [];
  const prepared = cantrips.find((s) =>
    GIANTS_POWER_CANTRIPS.some((c) => c.index === s?.index)
  );
  return prepared?.index || null;
};

const upsertGiantsPowerCantrip = ({ characterInfo, setCharacterInfo, spell }) => {
  if (!spell?.index) return;

  setCharacterInfo((prev) => {
    const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
    const withoutGiantsPower = current.filter(
      (s) => !GIANTS_POWER_CANTRIPS.some((c) => c.index === s?.index)
    );
    const next = [...withoutGiantsPower, spell];
    return {
      ...prev,
      spellsPrepared: {
        ...prev.spellsPrepared,
        0: next,
      },
    };
  });
};

const removeGiantsPowerCantrip = ({ setCharacterInfo }) => {
  setCharacterInfo((prev) => {
    const current = Array.isArray(prev?.spellsPrepared?.[0]) ? prev.spellsPrepared[0] : [];
    const next = current.filter((s) => !GIANTS_POWER_CANTRIPS.some((c) => c.index === s?.index));
    return {
      ...prev,
      spellsPrepared: {
        ...prev.spellsPrepared,
        0: next,
      },
    };
  });
};

const GiantsPowerCantripPicker = ({ characterInfo, setCharacterInfo }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [spellDetails, setSpellDetails] = React.useState({});

  const preparedIndex = getGiantsPowerPreparedIndex(characterInfo);

  const loadSpells = React.useCallback(() => {
    if (loading) return;
    setLoading(true);
    setError("");

    Promise.all(GIANTS_POWER_CANTRIPS.map((c) => axios.get(`/singlespell/${c.index}`)))
      .then((responses) => {
        const next = {};
        responses.forEach((res) => {
          const spell = res?.data;
          if (spell?.index) next[spell.index] = spell;
        });
        setSpellDetails(next);
      })
      .catch(() => setError("Failed to load cantrips. Is the backend running on port 3001?"))
      .finally(() => setLoading(false));
  }, [loading]);

  const openPicker = () => {
    setOpen(true);
    if (Object.keys(spellDetails).length === 0) loadSpells();
  };

  const closePicker = () => setOpen(false);

  return (
    <>
      <Box
        sx={{
          borderLeft: "4px solid #607d8b",
          borderRadius: "6px",
          backgroundColor: "rgba(255,255,255,0.45)",
          mb: 1.5,
          px: 1.5,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Typography
            sx={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "#607d8b",
            }}
          >
            Subrace Spell List
          </Typography>
          <Button variant="outlined" size="small" onClick={openPicker}>
            {preparedIndex ? "Change cantrip" : "Choose cantrip"}
          </Button>
        </Box>

        {preparedIndex ? (
          <SpellAccordian
            numericalSpellLevel={0}
            spell={(Array.isArray(characterInfo?.spellsPrepared?.[0]) ? characterInfo.spellsPrepared[0] : []).find(
              (s) => s?.index === preparedIndex
            )}
            actionButton={
              <Button
                variant="contained"
                size="small"
                onClick={() => removeGiantsPowerCantrip({ setCharacterInfo })}
                sx={{ textTransform: "none", fontSize: "12px", backgroundColor: "#2e7d32" }}
              >
                Forget
              </Button>
            }
          />
        ) : (
          <Typography sx={{ fontSize: "12px", opacity: 0.85 }}>
            Giant's Power: prepare either Druidcraft or Thaumaturgy.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={closePicker} fullWidth maxWidth="sm">
        <DialogTitle>Giant's Power - Choose a cantrip</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} />
              <Typography>Loading...</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            GIANTS_POWER_CANTRIPS.map((c) => {
              const spell = spellDetails[c.index];
              if (!spell) return null;
              const isPrepared = preparedIndex === c.index;

              return (
                <Box key={c.index} sx={{ mb: 1 }}>
                  <SpellAccordian
                    numericalSpellLevel={0}
                    spell={spell}
                    actionButton={
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          if (isPrepared) {
                            removeGiantsPowerCantrip({ setCharacterInfo });
                            return;
                          }
                          upsertGiantsPowerCantrip({ characterInfo, setCharacterInfo, spell });
                        }}
                        sx={{
                          textTransform: "none",
                          fontSize: "12px",
                          backgroundColor: isPrepared ? "#2e7d32" : "#a881af",
                        }}
                      >
                        {isPrepared ? "Forget" : "Learn Cantrip"}
                      </Button>
                    }
                  />
                </Box>
              );
            })
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePicker}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const renderDailySpellsList = (characterInfo, setCharacterInfo) => {
  const isGiantsPowerAvailable =
    characterInfo?.characterClass === "barbarian" &&
    characterInfo?.subclass === "giant" &&
    Number(characterInfo?.characterLevel || 0) >= 3;

  if (typeof setCharacterInfo !== "function") return null;
  if (!isGiantsPowerAvailable) return null;

  return (
    <>
      {isGiantsPowerAvailable ? (
        <GiantsPowerCantripPicker characterInfo={characterInfo} setCharacterInfo={setCharacterInfo} />
      ) : null}
    </>
  );
};
