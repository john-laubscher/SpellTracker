import * as React from "react";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";

import { CharacterInfoContext } from "../../Contexts/Context";

export const toggleArcanaInitiateBtnStyle = makeStyles(() => ({
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

export const PrepareArcanaInitiateCantripButton = ({ spell, index = 0 }) => {
  const [clickedButtons, setClickedButtons] = useState([]);
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const chosen = Array.isArray(characterInfo?.arcanaInitiateCantrips)
    ? characterInfo.arcanaInitiateCantrips
    : [];

  const isAlreadyChosen = chosen.some((s) => s?.index === spell?.index);
  const isRemoveClicked = clickedButtons.includes(`remove-${index}`);

  const toggle = () => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.arcanaInitiateCantrips) ? prev.arcanaInitiateCantrips : [];
      const exists = current.some((s) => s?.index === spell.index);
      const next = exists ? current.filter((s) => s?.index !== spell.index) : [...current, spell];
      if (next.length === current.length) return prev;
      return { ...prev, arcanaInitiateCantrips: next };
    });
  };

  const classes = toggleArcanaInitiateBtnStyle();
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

export default PrepareArcanaInitiateCantripButton;

