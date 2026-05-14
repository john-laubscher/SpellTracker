import * as React from "react";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";

import { CharacterInfoContext } from "../../Contexts/Context";

export const toggleReaperCantripBtnStyle = makeStyles(() => ({
  addButton: {
    fontSize: "12px",
    padding: "2px 10px",
    borderRadius: "4px",
    textTransform: "none",
    backgroundColor: "#075985",
    color: "#fff",
    minWidth: "auto",
    lineHeight: 1.4,
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#0c4a6e",
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

export const PrepareReaperCantripButton = ({ spell, index = 0 }) => {
  const [clickedButtons, setClickedButtons] = useState([]);
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const chosen = characterInfo?.reaperCantrip || null;
  const isAlreadyChosen = String(chosen?.index || "") === String(spell?.index || "");

  const isRemoveClicked = clickedButtons.includes(`remove-${index}`);

  const toggle = () => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const current = prev?.reaperCantrip || null;
      const exists = String(current?.index || "") === String(spell.index || "");
      const next = exists ? null : { ...spell };
      if (!current && !next) return prev;
      if (String(current?.index || "") === String(next?.index || "")) return prev;
      return { ...prev, reaperCantrip: next };
    });
  };

  const classes = toggleReaperCantripBtnStyle();
  const buttonClass = isAlreadyChosen ? classes.addedButton : classes.addButton;

  return (
    <Button
      className={`${buttonClass} ${isRemoveClicked ? "flashRemove" : ""}`}
      variant="contained"
      onClick={() => {
        if (isAlreadyChosen) {
          setClickedButtons((prev) => [...prev, `remove-${index}`]);
          toggle();
          setTimeout(() => {
            setClickedButtons((prev) => prev.filter((k) => k !== `remove-${index}`));
          }, 300);
        } else {
          toggle();
        }
      }}
      disabled={!spell?.index}
    >
      {isAlreadyChosen ? "Remove" : "Add"}
    </Button>
  );
};

export default PrepareReaperCantripButton;
