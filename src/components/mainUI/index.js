import SpellList from "./spellList";
import React, { useState, useContext } from "react";
import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import Header from "./Header";

export const MainUI = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);
  return (
    <div>
      <p>Main UI</p>
      <Header />
      <SpellList />
      {/* ***NEED FEATURE*** need section for racial and subclass spells */}
      {/* ***NEED FEATURE*** section for keeping track of other abilities or items that have limited use that should be tracked*/}
    </div>
  );
};

export default MainUI;
