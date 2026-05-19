import * as React from "react";
import { useContext, useEffect } from "react";
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
import PrepareArcaneArcherLoreCantripButton from "./PrepareArcaneArcherLoreCantripButton";

const ArcaneArcherLoreCantripModal = ({ open, onClose }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const [spells, setSpells] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({
    loading: false,
    error: "",
    loaded: false,
  });

  const chosen = characterInfo?.arcaneArcherLoreCantrip || null;

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    setSpells([]);
    setLoadStatus({ loading: true, error: "", loaded: false });

    axios
      .get("/spellsbylevel/0", { signal: controller.signal })
      .then((res) => {
        const fetched = res.data?.results || [];
        setSpells(fetched);
        setLoadStatus({ loading: false, error: "", loaded: true });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setLoadStatus({
          loading: false,
          error: "Failed to load cantrips. Is the backend running on port 3001?",
          loaded: false,
        });
      });

    return () => controller.abort();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Arcane Archer Lore (Cantrip)"
          totalAllowed={1}
          actualSelected={chosen?.index ? 1 : 0}
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
          Choose <strong>one</strong> cantrip. By default, Arcane Archer Lore offers{" "}
          <strong>Prestidigitation</strong> or <strong>Druidcraft</strong>, but you can substitute it for any other
          cantrip.
        </Typography>

        {loadStatus.loading ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            Loading cantrips...
          </Typography>
        ) : null}
        {loadStatus.error ? (
          <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
            {loadStatus.error}
          </Typography>
        ) : null}

        {!loadStatus.loading && !loadStatus.error && spells.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No cantrips found.
          </Typography>
        ) : null}

        {spells.map((spell, idx) => (
          <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              actionButton={<PrepareArcaneArcherLoreCantripButton spell={spell} index={idx} />}
            />
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ArcaneArcherLoreCantripModal;
