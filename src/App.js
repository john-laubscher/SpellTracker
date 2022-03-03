import "./App.css";
import CharacterCreationForm from "./components/CharacterCreationForm";
import { Routes, Route, Link } from "react-router-dom";
import MainUI from "./components/MainUI/Index";
import React, { useState } from "react";
import { CharacterInfoContext } from "./Contexts/CharacterInfoContext";

// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  const [characterInfo, setCharacterInfo] = useState({
    characterName: "",
    race: "",
    characterClass: "noClass",
    subclass: "",
    characterLevel: "",
    hp: "",
    // spellcastingAbility: "",    ---I think handle this when we are actually making an api call and can use local state a the index to check this info
    spellcastingMod: "",
  });

  return (
    <div className="App">
      <CharacterInfoContext.Provider value={{ characterInfo, setCharacterInfo }}>
        <Routes>
          <Route path="/" element={<CharacterCreationForm />}></Route>
          <Route path="/mainUI" element={<MainUI />}></Route>
        </Routes>
      </CharacterInfoContext.Provider>
    </div>
  );
}

export default App;
