import React from "react";
import { Box } from "@mui/material";

import { MainUIBGPic } from "../ThemeConfig";
import { Header } from "./header";
import SpellList from "./spellList";
import FeaturesAndTrackables from "./FeaturesAndTrackables";

export default function MainUI() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: MainUIBGPic,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: { xs: 1.5, sm: 2.5 },
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto", width: "100%", position: "relative" }}>
        <Box
          sx={{
            backgroundColor: "rgba(245, 245, 245, 0.9)",
            borderRadius: 2,
            p: { xs: 1.5, sm: 2.5 },
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Header />
          <Box sx={{ mt: 2 }}>
            <FeaturesAndTrackables />
          </Box>
          <Box sx={{ mt: 2 }}>
            <SpellList />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
