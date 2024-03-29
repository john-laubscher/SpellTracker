import "./App.css";
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route } from "react-router-dom";
import MainUI from "./components/MainUI/Index";
import React, { useState } from "react";
import { CharacterInfoContext, ClassSpellsDetailsContext } from "./Contexts/Context";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ***NEED FEATURE*** User should be able to enter stats and see them for header 
// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  const [characterInfo, setCharacterInfo] = useState({
    characterName: "Garetjax",
    race: "noRace",
    // default characterClass should be "noClass" rather than empty string
    subrace: "",
    characterClass: "wizard",
    subclass: "bladesinging",
    characterLevel: 1,
    hp: 100,
    spellcastingMod: 2,
    wizardSpellCountMod: 2,
    spellsPrepared: {
      0:[],
      1:[],
      2:[],
      3:[],
      4:[],
      5:[],
      6:[],
      7:[],
      8:[],
      9:[]
    }
  });

  const [classSpellsDetails, setClassSpellsDetails] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  })

  const theme = createTheme({
    // Customize your theme as needed
  });
  // Routes

  return (
    <div className="App">
       <ThemeProvider theme={theme}>
        <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
          <ClassSpellsDetailsContext.Provider value={{ classSpellsDetails, setClassSpellsDetails }}>
            <Routes>
              <Route path="/" element={<CharacterCreationForm />}></Route>
              <Route path="/mainUI" element={<MainUI />}></Route>
            </Routes>
          </ClassSpellsDetailsContext.Provider>
        </CharacterInfoContext.Provider>
       </ThemeProvider>
    </div>
  );
}

export default App;
