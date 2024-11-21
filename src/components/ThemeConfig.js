// ThemeConfig.js
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from '@mui/material';


// Define your theme here
const theme = createTheme({
  typography: {
    fontFamily: "'Cinzel', serif",
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
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#f5deb3",
            borderRadius: "8px",
            border: "1px solid #8B4513",
            padding: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          },
          "& .MuiInputBase-input": {
            fontFamily: "'Cinzel', serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "#3e2723",
            letterSpacing: "0.75px",
          },
          "& .Mui-focused": {
            borderColor: "#d4af37",
            boxShadow: "0 0 8px #d4af37",
          },
        },
      },
    },
  },
});

// export const BackgroundWrapper = ({ children }) => {
//     return (
//       <div
//         style={{
//           backgroundImage: "url('/images/theHunt.jpg')", // Add your image path
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           minHeight: "100vh", // Ensure it fills the viewport
//           padding: "20px",
//         }}
//       >
//        <Box
//           sx={{
//             backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white (adjust opacity)
//             borderRadius: '8px',
//             padding: '20px',
//             margin: '0 auto',
//             maxWidth: '800px', // Adjust the width as needed
//             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
//           }}
//         >
//           {children}
//         </Box>
//       </div>
//     );
//   };


// export const BackgroundOverlay = ({ children }) => {
//     return (
//       <Box
//         sx={{
//           backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white (adjust opacity)
//           borderRadius: '8px',
//           padding: '20px',
//           maxWidth: '800px', // Adjust the width as needed
//           margin: '0 auto',
//           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
//         }}
//       >     
//         {children}
//       </Box>
//     );
//   };

export const  MainUIBGPic = "url('/images/dragonCave.jpg')"
export const CharCreationBGPic = "url('/images/theHunt.jpg')"


export const BackgroundWrapper = ({ children, bgImage }) => {
    return (
      <div
        style={{
          backgroundImage: bgImage, // Add your image path
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white (adjust opacity)
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '800px', // Adjust the width as needed
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
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
