import React from "react";
import { BackgroundWrapper, MainUIBGPic } from "../ThemeConfig";

import SpellList from "./spellList";
import { Header } from "./header";
import FeaturesAndTrackables from "./FeaturesAndTrackables";


export const MainUI = () => {

  return (
    <div>
      <p>Main UI</p>
      <BackgroundWrapper bgImage={MainUIBGPic}>
        <Header />
        <FeaturesAndTrackables/>
        <SpellList />
      </BackgroundWrapper>
      {/* ***NEED FEATURE*** need section for racial and subclass spells */}
      {/* ***NEED FEATURE*** section for keeping track of other abilities or items that have limited use that should be tracked*/}
    </div>
  );
};

export default MainUI;
