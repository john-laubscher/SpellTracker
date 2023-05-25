import "./App.css";
import axios from 'axios';
import CharacterCreationForm from "./components/characterCreationForm";
import { Routes, Route, Link } from "react-router-dom";
import MainUI from "./components/MainUI/Index";
import React, { useState } from "react";
import { CharacterInfoContext } from "./Contexts/CharacterInfoContext";

// Should this be routes or just a modal that needs to be finished before access is given to the mainUI?
function App() {
  const [characterInfo, setCharacterInfo] = useState({
    characterName: "Garetjax",
    race: "Dwarf",
    characterClass: "paladin",
    subclass: "ancients",
    characterLevel: 2,
    hp: 100,
    // spellcastingAbility: "",    ---I think handle this when we are actually making an api call and can use local state a the index to check this info
    spellcastingMod: 2,
    spellsPrepared: {
      0:[
        {index: 'dancing-lights', name: 'Dancing Lights', url: '/api/spells/dancing-lights'},
        {index: 'light', name: 'Light', url: '/api/spells/light'},
        {index: 'mage-hand', name: 'Mage Hand', url: '/api/spells/mage-hand'}
      ],
      1:[
        {index: 'animal-friendship', name: 'Animal Friendship', url: '/api/spells/animal-friendship'},
        {index: 'bane', name: 'Bane', url: '/api/spells/bane'},    
        {index: 'charm-person', name: 'Charm Person', url: '/api/spells/charm-person'}
      ],
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

  // Routes

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
