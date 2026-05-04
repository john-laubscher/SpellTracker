import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const normalize = (value) => String(value || "").trim().toLowerCase();

const ManageFeaturesModal = ({
  open,
  title,
  features,
  trackedById,
  hiddenById,
  onChangeTracked,
  onChangeHidden,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setQuery("");
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return features || [];
    return (features || []).filter((f) => {
      const haystack = `${f?.name || ""} ${f?.desc || ""} ${f?.id || ""}`;
      return normalize(haystack).includes(q);
    });
  }, [features, query]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Cinzel', serif" }}>{title || "Manage Features"}</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ fontSize: "13px", color: "#5d4037", mb: 1 }}>
          Toggle tracked/untracked, hide features from the main list, and edit/delete custom features.
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 1.5 }}
        />

        <Box sx={{ maxHeight: 420, overflow: "auto" }}>
          <List dense disablePadding>
            {filtered.map((f) => {
              const isTracked = Boolean(trackedById?.[f.id]);
              const isHidden = Boolean(hiddenById?.[f.id]);
              const secondary = f.level ? `Level ${f.level}` : undefined;
              const isCustom = Boolean(f.isCustom);
              return (
                <ListItem
                  key={f.id}
                  secondaryAction={null}
                  disableGutters
                  sx={{ py: 0.5 }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: "#3e2723",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 360,
                            }}
                          >
                            {f.name}
                          </Typography>
                          {isCustom ? <Chip size="small" label="Custom" /> : null}
                          {isHidden ? <Chip size="small" color="warning" label="Hidden" /> : null}
                        </Stack>
                        {secondary ? (
                          <Typography sx={{ fontSize: "12px", color: "#6d4c41" }}>{secondary}</Typography>
                        ) : null}
                      </Box>

                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => onChangeHidden?.(f.id, !isHidden)}
                          aria-label={isHidden ? `Show: ${f.name}` : `Hide: ${f.name}`}
                        >
                          {isHidden ? (
                            <VisibilityOutlinedIcon fontSize="inherit" />
                          ) : (
                            <VisibilityOffOutlinedIcon fontSize="inherit" />
                          )}
                        </IconButton>

                        {isCustom ? (
                          <IconButton
                            size="small"
                            onClick={() => onEdit?.(f)}
                            aria-label={`Edit: ${f.name}`}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        ) : null}

                        {isCustom ? (
                          <IconButton
                            size="small"
                            onClick={() => onDelete?.(f)}
                            aria-label={`Delete: ${f.name}`}
                          >
                            <DeleteOutlineIcon fontSize="inherit" />
                          </IconButton>
                        ) : null}

                        <Switch
                          edge="end"
                          checked={isTracked}
                          onChange={(e) => onChangeTracked?.(f.id, e.target.checked)}
                          inputProps={{ "aria-label": `Tracked: ${f.name}` }}
                        />
                      </Stack>
                    </Stack>

                    {f?.desc ? (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#5d4037",
                          mt: 0.25,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {f.desc}
                      </Typography>
                    ) : null}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageFeaturesModal;
