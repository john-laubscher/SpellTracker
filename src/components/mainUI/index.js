import React from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundWrapper, MainUIBGPic } from "../ThemeConfig";
import Button from "@mui/material/Button";

import SpellList from "./spellList";
import { Header } from "./header";
import FeaturesAndTrackables from "./FeaturesAndTrackables";


export const MainUI = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>Main UI</p>
      <BackgroundWrapper bgImage={MainUIBGPic}>
        <Header />
        <FeaturesAndTrackables/>
        <SpellList />
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            mb: 1,
            py: 1,
            px: 4,
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '1px',
            backgroundColor: '#8B4513',
            '&:hover': { backgroundColor: '#6d3410' },
            display: 'block',
            mx: 'auto',
          }}
        >
          Back to Character Creation
        </Button>
      </BackgroundWrapper>
    </div>
  );
};

export default MainUI;
