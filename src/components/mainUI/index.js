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
    </div>
  );
};

export default MainUI;
