import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { CharacterInfoContext } from "../../Contexts/Context";
import MagicalSecretsStatus from "./MagicalSecretsStatus";
import SpellAccordian from "./SpellAccordian";
import PrepareReaperCantripButton from "./PrepareReaperCantripButton";

const REAPER_TOOLTIP =
  "When you cast a necromancy cantrip that normally targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other.";

const ReaperCantripModal = ({ open, onClose }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const [search, setSearch] = React.useState("");
  const [necromancyCantrips, setNecromancyCantrips] = React.useState([]);
  const [loadStatus, setLoadStatus] = React.useState({
    loading: false,
    error: "",
    loaded: false,
  });

  const chosen = characterInfo?.reaperCantrip || null;

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setLoadStatus({ loading: false, error: "", loaded: false });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (loadStatus.loading) return;
    if (loadStatus.loaded) return;

    setLoadStatus((s) => ({ ...s, loading: true, error: "" }));
    axios
      .get("/spellsbyschool/0/necromancy")
      .then((res) => {
        const fetched = res.data?.results || [];
        setNecromancyCantrips(fetched);
        setLoadStatus((s) => ({ ...s, loading: false, error: "", loaded: true }));
      })
      .catch(() => {
        setLoadStatus((s) => ({
          ...s,
          loading: false,
          error: "Failed to load necromancy cantrips. Is the backend running on port 3001?",
        }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filteredNecromancy = useMemo(() => {
    const necro = Array.isArray(necromancyCantrips) ? necromancyCantrips : [];
    const normalizedSearch = String(search || "").trim().toLowerCase();
    if (!normalizedSearch) return necro;
    return necro.filter((s) => String(s?.name || "").toLowerCase().includes(normalizedSearch));
  }, [necromancyCantrips, search]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5 }}>
        <MagicalSecretsStatus
          label="Reaper (Necromancy Cantrip)"
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
          Choose <strong>one</strong> <strong>necromancy</strong> cantrip from <strong>any spell list</strong>.{" "}
          <Tooltip arrow title={REAPER_TOOLTIP}>
            <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7, verticalAlign: "text-bottom" }} />
          </Tooltip>
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <TextField
            size="small"
            label="Search cantrips"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: "1 1 260px" }}
          />
        </Box>

        {loadStatus.loading ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            Loading cantrips…
          </Typography>
        ) : null}
        {loadStatus.error ? (
          <Typography sx={{ fontSize: "13px", color: "#c62828", px: 0.5, py: 0.25 }}>
            {loadStatus.error}
          </Typography>
        ) : null}

        {!loadStatus.loading && !loadStatus.error && filteredNecromancy.length === 0 ? (
          <Typography sx={{ fontSize: "13px", opacity: 0.75, px: 0.5, py: 0.25 }}>
            No necromancy cantrips found.
          </Typography>
        ) : null}

        {filteredNecromancy.map((spell, idx) => (
          <Box key={spell?.index || idx} sx={{ py: 0.25 }}>
            <SpellAccordian
              numericalSpellLevel={0}
              spell={spell}
              actionButton={
                <PrepareReaperCantripButton spell={spell} index={idx} />
              }
            />
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ReaperCantripModal;
