import * as React from "react";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

import { CharacterInfoContext } from "../../Contexts/Context";

const useStyles = makeStyles(() => ({
  addButton: {
    fontSize: "12px",
    padding: "2px 10px",
    borderRadius: "4px",
    textTransform: "none",
    backgroundColor: "#6a1b9a",
    color: "#fff",
    minWidth: "auto",
    lineHeight: 1.4,
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#4a148c",
    },
    "&.flashRemove": {
      backgroundColor: "#c62828",
    },
    "&.disabledLike": {
      backgroundColor: "#9e9e9e",
      color: "rgba(255,255,255,0.92)",
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

const PrepareMysticArcanumButton = ({ spell, index = 0, maxSelections = 10 }) => {
  const classes = useStyles();
  const [clickedButtons, setClickedButtons] = React.useState([]);
  const { characterInfo, setCharacterInfo } = React.useContext(CharacterInfoContext);

  const current = Array.isArray(characterInfo?.warlockMysticArcanum)
    ? characterInfo.warlockMysticArcanum
    : [];

  const isAlreadyChosen = current.some((entry) => entry?.index === spell?.index);
  const isRemoveClicked = clickedButtons.includes(`remove-${index}`);
  const isAtCap = !isAlreadyChosen && current.length >= Math.max(1, Number(maxSelections) || 10);

  const toggleSpell = () => {
    if (!spell?.index) return;
    setCharacterInfo((prev) => {
      const selected = Array.isArray(prev?.warlockMysticArcanum) ? prev.warlockMysticArcanum : [];
      const exists = selected.some((entry) => entry?.index === spell.index);
      if (exists) {
        return {
          ...prev,
          warlockMysticArcanum: selected.filter((entry) => entry?.index !== spell.index),
        };
      }
      if (selected.length >= Math.max(1, Number(maxSelections) || 10)) return prev;
      return {
        ...prev,
        warlockMysticArcanum: [...selected, spell],
      };
    });
  };

  const buttonClass = isAlreadyChosen ? classes.addedButton : classes.addButton;

  return (
    <Button
      className={`${buttonClass} ${isRemoveClicked ? "flashRemove" : ""} ${isAtCap ? "disabledLike" : ""}`}
      variant="contained"
      disabled={isAtCap}
      onClick={() => {
        if (isAlreadyChosen) {
          setClickedButtons((prev) => [...prev, `remove-${index}`]);
          toggleSpell();
          setTimeout(() => {
            setClickedButtons((prev) => prev.filter((key) => key !== `remove-${index}`));
          }, 300);
          return;
        }
        toggleSpell();
      }}
    >
      {isAlreadyChosen ? "Remove" : isAtCap ? "Max 10" : "Add"}
    </Button>
  );
};

export default PrepareMysticArcanumButton;
