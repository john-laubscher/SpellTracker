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
          variant="text"
          size="small"
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            mb: 1,
            fontFamily: "'Cinzel', serif",
            fontSize: '11px',
            color: '#5d4037',
            opacity: 0.7,
            textTransform: 'none',
            '&:hover': { opacity: 1, backgroundColor: 'rgba(139,69,19,0.08)' },
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
