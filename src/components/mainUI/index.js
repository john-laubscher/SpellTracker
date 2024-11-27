import SpellList from "./spellList";
import React from "react";

import { BackgroundWrapper, MainUIBGPic } from "../ThemeConfig";


import Header from "./header";

export const MainUI = () => {

  return (
    <div>
      <p>Main UI</p>
      <BackgroundWrapper bgImage={MainUIBGPic}>
        <Header />
        <SpellList />
      </BackgroundWrapper>
      {/* ***NEED FEATURE*** need section for racial and subclass spells */}
      {/* ***NEED FEATURE*** section for keeping track of other abilities or items that have limited use that should be tracked*/}
    </div>
  );
};

export default MainUI;
