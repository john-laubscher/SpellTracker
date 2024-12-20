import "./App.css";
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route } from "react-router-dom";
import MainUI from "./components/MainUI/Index";
import React, { useState } from "react";
import { CharacterInfoContext, ClassSpellsDetailsContext } from "./Contexts/Context";
import ThemeConfig, { BackgroundWrapper, CharCreationBGPic } from "./components/ThemeConfig";

// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  const [characterInfo, setCharacterInfo] = useState({
    characterName: "Garetjax",
    race: "Dwarf",
    subrace: "Hill",
    // default characterClass should be "noClass" rather than empty string
    characterClass: "cleric",
    subclass: "grave",
    characterLevel: 10,
    proficiencyMod: 2,
    hp: 100,
    ac: 17,
    weapons: [
      {
        name: "Longsword",      
        dmgType: "slashing",    
        mod: 1,
        statMod: "str",
        proficient: true,
      },
    ],
    spellcastingMod: 2,
    wizardSpellCountMod: 2,
    stats: {
      'str': {value:8, mod:-1},
      'dex': {value:10, mod:0},
      'con': {value:11, mod:0},
      'int': {value:13, mod:1},
      'wis': {value:15, mod:2}, 
      'cha': {value:17, mod:3}
    },
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
                <BackgroundWrapper bgImage={CharCreationBGPic}>
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
