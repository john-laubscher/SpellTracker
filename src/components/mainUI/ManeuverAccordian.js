import * as React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";

const ManeuverAccordian = ({ maneuver, leadingControl, actionButton }) => {
  const [expanded, setExpanded] = React.useState(false);

  const descLines = React.useMemo(() => {
    if (!maneuver) return [];
    if (Array.isArray(maneuver.desc)) return maneuver.desc;
    if (typeof maneuver.desc === "string") return [maneuver.desc];
    return [];
  }, [maneuver]);

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
      sx={{
        backgroundColor: "transparent",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px" }} />}
        aria-controls={`${maneuver?.id || "maneuver"}-content`}
        id={`${maneuver?.id || "maneuver"}-header`}
        sx={{
          minHeight: 32,
          px: 1,
          py: 0,
          "& .MuiAccordionSummary-expandIconWrapper": {
            width: 28,
            justifyContent: "center",
            marginLeft: 0,
          },
          "& .MuiAccordionSummary-content": {
            margin: "4px 0 !important",
            alignItems: "center",
            gap: 0.5,
            width: "100%",
            display: "flex",
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: "4px 0 !important",
          },
          "&.Mui-expanded": { minHeight: 32 },
        }}
      >
        {leadingControl ? (
          <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0, display: "flex" }}>
            {leadingControl}
          </Box>
        ) : null}
        <Typography sx={{ fontSize: "14px", fontWeight: 600, flexGrow: 1, minWidth: 0 }}>
          {maneuver?.name || "Unknown Maneuver"}
        </Typography>
        {actionButton ? (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ flexShrink: 0, ml: "auto", display: "flex", alignItems: "center" }}
          >
            {actionButton}
          </Box>
        ) : null}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          px: 2,
          py: 1,
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "4px",
          mx: 1,
          mb: 0.5,
        }}
      >
        <Typography component="div" sx={{ fontSize: "13px", "& p": { margin: "2px 0" } }}>
          {descLines.length === 0 ? (
            <p style={{ opacity: 0.7 }}>
              <em>No description available.</em>
            </p>
          ) : (
            descLines.map((line, idx) => <p key={`${maneuver?.id || "maneuver"}:${idx}`}>{line}</p>)
          )}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default ManeuverAccordian;

