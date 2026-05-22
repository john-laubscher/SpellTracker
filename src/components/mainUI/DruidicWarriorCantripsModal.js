import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { CharacterInfoContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";
import PrepareDruidicWarriorCantripButton from "./PrepareDruidicWarriorCantripButton";

const DruidicWarriorCantripsModal = ({ open, onClose }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const [spells, setSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({ loading: false, error: "" });

  const chosen = Array.isArray(characterInfo?.druidicWarriorCantrips)
    ? characterInfo.druidicWarriorCantrips
    : [];

  useEffect(() => {
    if (!open) return;
    setLoadStatus({ loading: false, error: "" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (loadStatus.loading) return;
    if (Array.isArray(spells) && spells.length > 0) return;

    setLoadStatus({ loading: true, error: "" });
    axios
      .get("/allspells/0/druid")
      .then((res) => {
        const fetched = res.data?.results || [];
        setSpells(fetched);
        setLoadStatus({ loading: false, error: "" });
      })
      .catch(() => {
        setLoadStatus({
          loading: false,
          error: "Failed to load druid cantrips. Is the backend running on port 3001?",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filtered = useMemo(() => spells, [spells]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Druidic Warrior (Druid Cantrips)"
          totalAllowed={2}
          actualSelected={chosen.length}
          typographySx={{
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        />
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
          Choose <strong>two</strong> cantrips from the <strong>druid</strong> spell list. These cantrips count as{" "}
          <strong>ranger spells</strong> for you, and <strong>Wisdom</strong> is your spellcasting ability for them.
        </Typography>

        {loadStatus.loading ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            Loading druid cantripsâ€¦
          </Typography>
        ) : null}
        {loadStatus.error ? (
          <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
            {loadStatus.error}
          </Typography>
        ) : null}

        {!loadStatus.loading && !loadStatus.error && filtered.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            {spells.length === 0 ? "No cantrips found." : "No cantrips match your search."}
          </Typography>
        ) : null}

        {filtered.map((spell, idx) => (
          <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              actionButton={<PrepareDruidicWarriorCantripButton spell={spell} index={idx} />}
            />
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DruidicWarriorCantripsModal;

