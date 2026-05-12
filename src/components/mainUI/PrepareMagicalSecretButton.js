import * as React from "react";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";

import { CharacterInfoContext } from "../../Contexts/Context";

export const toggleMagicalSecretBtnStyle = makeStyles(() => ({
  addButton: {
    fontSize: "12px",
    padding: "2px 10px",
    borderRadius: "4px",
    textTransform: "none",
    backgroundColor: "#a881af",
    color: "#fff",
    minWidth: "auto",
    lineHeight: 1.4,
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#80669d",
    },
    "&.flashRemove": {
      backgroundColor: "#c62828",
    },
  },
  addedButton: {
    fontSize: "12px",
    padding: "2px 10px",
    borderRadius: "4px",
    textTransform: "none",
    backgroundColor: "#2e7d32",
    color: "#fff",
    minWidth: "auto",
    lineHeight: 1.4,
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
    "&.flashRemove": {
      backgroundColor: "#c62828",
    },
  },
}));

export const PrepareMagicalSecretButton = ({ spell, index = 0 }) => {
  const [clickedButtons, setClickedButtons] = useState([]);
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const secrets = Array.isArray(characterInfo?.magicalSecretsPrepared)
    ? characterInfo.magicalSecretsPrepared
    : [];
  const isAlreadyChosen = secrets.some((s) => s?.index === spell?.index);
  const isRemoveClicked = clickedButtons.includes(`remove-${index}`);

  const toggleMagicalSecret = () => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.magicalSecretsPrepared) ? prev.magicalSecretsPrepared : [];
      const exists = current.some((s) => s?.index === spell.index);
      const next = exists ? current.filter((s) => s?.index !== spell.index) : [...current, spell];
      if (next.length === current.length) return prev;
      return { ...prev, magicalSecretsPrepared: next };
    });
  };

  const classes = toggleMagicalSecretBtnStyle();
  const buttonClass = isAlreadyChosen ? classes.addedButton : classes.addButton;

  return (
    <Button
      className={`${buttonClass} ${isRemoveClicked ? "flashRemove" : ""}`}
      variant="contained"
      onClick={() => {
        if (isAlreadyChosen) {
          setClickedButtons((prev) => [...prev, `remove-${index}`]);
          toggleMagicalSecret();
          setTimeout(() => {
            setClickedButtons((prev) => prev.filter((k) => k !== `remove-${index}`));
          }, 300);
        } else {
          toggleMagicalSecret();
        }
      }}
    >
      {isAlreadyChosen ? "Remove" : "Add"}
    </Button>
  );
};

export default PrepareMagicalSecretButton;

