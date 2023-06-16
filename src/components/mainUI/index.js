import SpellList from "./spellList";
import React from "react";

import Header from "./Header";

export const MainUI = () => {

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
