import * as React from "react";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { WILD_MAGIC_SURGE_TABLE, WILD_MAGIC_SURGE_TABLE_ATTRIBUTION } from "../../utils/wildMagicSurgeTable";

const WildMagicSurgeTableModal = ({ open, onClose }) => {
  const attribution = WILD_MAGIC_SURGE_TABLE_ATTRIBUTION || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          height: { xs: "92vh", sm: "86vh" },
          maxHeight: { xs: "92vh", sm: "86vh" },
        },
      }}
    >
      <DialogTitle sx={{ pr: 5 }}>
        Wild Magic Surge Table
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

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Typography sx={{ fontSize: "13px", color: "#3e2723", mb: 1 }}>
          Roll <strong>d100</strong> and consult the result below.
        </Typography>

        <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
          <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
            <Table stickyHeader size="small" aria-label="Wild Magic Surge Table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, width: 90, whiteSpace: "nowrap" }}>d100</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Effect</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(WILD_MAGIC_SURGE_TABLE || []).map((row) => (
                  <TableRow key={row.range}>
                    <TableCell sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {row.range}
                    </TableCell>
                    <TableCell>{row.effect}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: "11px", opacity: 0.8 }}>
            Source:{" "}
            {attribution?.url ? (
              <a href={attribution.url} target="_blank" rel="noreferrer">
                {attribution.title || attribution.url}
              </a>
            ) : (
              attribution?.title || "Unknown"
            )}
            {attribution?.licenseUrl ? (
              <>
                {" "}
                (License:{" "}
                <a href={attribution.licenseUrl} target="_blank" rel="noreferrer">
                  {attribution.licenseName || "CC BY-SA"}
                </a>
                )
              </>
            ) : null}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WildMagicSurgeTableModal;

