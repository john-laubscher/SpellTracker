import "./App.css";
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route } from "react-router-dom";
import MainUI from "./components/MainUI/Index";
import React, { useState } from "react";
import { CharacterInfoContext, ClassSpellsDetailsContext } from "./Contexts/Context";
import ThemeConfig, { BackgroundWrapper } from "./components/ThemeConfig";

// ***NEED FEATURE*** User should be able to enter stats and see them for header 
// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  const [characterInfo, setCharacterInfo] = useState({
    characterName: "Garetjax",
    race: "Dwarf",
    // default characterClass should be "noClass" rather than empty string
    subrace: "Hill",
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

  return (
    <div className="App">
       <ThemeConfig>
        <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
          <ClassSpellsDetailsContext.Provider value={{ classSpellsDetails, setClassSpellsDetails }}>
            <Routes>
              <Route path="/" element={
                <BackgroundWrapper>
                  <CharacterCreationForm />
                </BackgroundWrapper>
              }></Route>

              <Route path="/mainUI" element={<MainUI />}></Route>
            </Routes>
          </ClassSpellsDetailsContext.Provider>
        </CharacterInfoContext.Provider>
       </ThemeConfig>
    </div>
  );
}

export default App;
