// ThemeConfig.js
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from '@mui/material';


// Define your theme here
const theme = createTheme({
  typography: {
    fontFamily: "'Cinzel', serif",
    whiteSpace: 'nowrap',
    body1: {
      fontWeight: 400,
      fontSize: "18px",
      letterSpacing: "0.5px",
      lineHeight: "1.5",
    },
    h6: {
      fontWeight: 700,
      fontSize: "20px",
    },
    fontFamily: "'Cinzel', serif",
    h5: {
      fontWeight: 700,
      fontSize: "24px",
    },
    body2: {
      fontWeight: 400,
      fontSize: "16px",
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: "18px",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#f5deb3",
            borderRadius: "6px",
            border: "1px solid #8B4513",
            boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
          },
          "& .MuiInputBase-input": {
            fontFamily: "'Cinzel', serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "#3e2723",
            letterSpacing: "0.5px",
          },
          "& .Mui-focused": {
            borderColor: "#d4af37",
            boxShadow: "0 0 6px #d4af37",
          },
          "&.EditableHP": {
            width: "80px",
            margin: "5px",
            "& .MuiInputBase-root": {
              height: "30px",
              fontSize: "16px",
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
              fontSize: "20px",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5deb3",
          borderRadius: "6px",
          border: "1px solid #8B4513",
          boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
          fontFamily: "'Cinzel', serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "#3e2723",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Cinzel', serif",
          fontWeight: 600,
          color: "#5d4037",
          fontSize: "14px",
        },
      },
    },

    CharacterHeader: {
        styleOverrides: {
          root: {
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
          },
          gridContainer: {
            alignItems: "center",
            justifyContent: "space-between",
          },
          gridItem: {
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          },
          expandedDetails: {
            marginTop: "10px",
          },
          backButton: {
            marginTop: "10px",
            textTransform: "none",
          },
        },
    },
  },
});

export const  MainUIBGPic = "url('/images/dragonCave.jpg')"
export const CharCreationBGPic = "url('/images/theHunt.jpg')"


export const BackgroundWrapper = ({ children, bgImage }) => {
    return (
      <div
        style={{
          backgroundImage: bgImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh", // Ensure it fills the viewport
          display: "flex", // Center content vertically and horizontally
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: '10px',
            padding: '28px 32px',
            maxWidth: '560px',
            width: '100%',
            minWidth: '360px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          }}
        >
          {children}
        </Box>
      </div>
    );
  };


// Wrap the ThemeProvider around children components
export default function ThemeConfig({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
