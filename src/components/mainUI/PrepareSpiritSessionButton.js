import * as React from "react";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";

import { CharacterInfoContext } from "../../Contexts/Context";

export const toggleSpiritSessionBtnStyle = makeStyles(() => ({
  addButton: {
    fontSize: "12px",
    padding: "2px 10px",
    borderRadius: "4px",
    textTransform: "none",
    backgroundColor: "#0f766e",
    color: "#fff",
    minWidth: "auto",
    lineHeight: 1.4,
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#115e59",
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

export const PrepareSpiritSessionButton = ({ spell, index = 0 }) => {
  const [clickedButtons, setClickedButtons] = useState([]);
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const chosen = Array.isArray(characterInfo?.spiritSessionPrepared)
    ? characterInfo.spiritSessionPrepared
    : [];

  const isAlreadyChosen = chosen.some((s) => s?.index === spell?.index);

  const isRemoveClicked = clickedButtons.includes(`remove-${index}`);

  const toggleSpiritSession = () => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.spiritSessionPrepared) ? prev.spiritSessionPrepared : [];
      const exists = current.some((s) => s?.index === spell.index);
      const next = exists ? current.filter((s) => s?.index !== spell.index) : [...current, spell];
      if (next.length === current.length) return prev;
      return { ...prev, spiritSessionPrepared: next };
    });
  };

  const classes = toggleSpiritSessionBtnStyle();
  const buttonClass = isAlreadyChosen ? classes.addedButton : classes.addButton;

  return (
    <Button
      className={`${buttonClass} ${isRemoveClicked ? "flashRemove" : ""}`}
      variant="contained"
      onClick={() => {
        if (isAlreadyChosen) {
          setClickedButtons((prev) => [...prev, `remove-${index}`]);
          toggleSpiritSession();
          setTimeout(() => {
            setClickedButtons((prev) => prev.filter((k) => k !== `remove-${index}`));
          }, 300);
        } else {
          toggleSpiritSession();
        }
      }}
      disabled={!spell?.index}
    >
      {isAlreadyChosen ? "Remove" : "Add"}
    </Button>
  );
};

export default PrepareSpiritSessionButton;
