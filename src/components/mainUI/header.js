import React, { useContext } from "react";
import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";

export const Header = (props) => {
  const { characterInfo } = useContext(CharacterInfoContext);
  console.log("header info", characterInfo);

  return (
    <div>
      <h1>Character Name: {characterInfo.characterName}</h1>
    </div>
  );
};

export default Header;
