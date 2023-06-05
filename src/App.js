import "./App.css";
import axios from 'axios';
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route, Link } from "react-router-dom";
import MainUI from "./components/MainUI/Index";
import React, { useState } from "react";
import { CharacterInfoContext } from "./Contexts/CharacterInfoContext";
import { createTheme, ThemeProvider } from '@mui/material/styles';


// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  const [characterInfo, setCharacterInfo] = useState({
    characterName: "Garetjax",
    race: "Dwarf",
    characterClass: "wizard",
    subclass: "abjuration",
    characterLevel: 1,
    hp: 100,
    // spellcastingAbility: "",    ---I think handle this when we are actually making an api call and can use local state a the index to check this info
    spellcastingMod: 2,
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

  const theme = createTheme({
    // Customize your theme as needed
  });
  // Routes

  return (
    <div className="App">
       <ThemeProvider theme={theme}>
        <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
          <Routes>
            <Route path="/" element={<CharacterCreationForm />}></Route>
            <Route path="/mainUI" element={<MainUI />}></Route>
          </Routes>
        </CharacterInfoContext.Provider>
       </ThemeProvider>
    </div>
  );
}

export default App;
