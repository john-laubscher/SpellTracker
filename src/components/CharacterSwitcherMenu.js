import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { CharacterSessionContext } from "../Contexts/Context";

export default function CharacterSwitcherMenu() {
  const navigate = useNavigate();
  const {
    characters,
    activeCharacterId,
    activeCharacter,
    switchCharacter,
    isCharactersLoading,
    canManageCharacters,
  } = React.useContext(CharacterSessionContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  if (!canManageCharacters) return null;

  const open = Boolean(anchorEl);
  const activeName = String(activeCharacter?.name || activeCharacter?.profile?.characterInfo?.characterName || "Choose Character");

  return (
    <>
      <Tooltip title="Switch characters" arrow>
        <Button
          variant="text"
          size="small"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          endIcon={<ArrowDropDownIcon />}
          sx={{ textTransform: "none", maxWidth: 220 }}
        >
          <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeName}</Box>
        </Button>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} keepMounted>
        <Box sx={{ px: 2, py: 1, minWidth: 250 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>Characters</Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
            {isCharactersLoading ? "Loading..." : `${characters.length}/5 used`}
          </Typography>
        </Box>
        <Divider />
        {characters.map((character) => {
          const selected = character.id === activeCharacterId;
          return (
            <MenuItem
              key={character.id}
              selected={selected}
              onClick={async () => {
                setAnchorEl(null);
                await switchCharacter(character.id);
                navigate("/mainUI");
              }}
            >
              <ListItemText
                primary={character.name}
                secondary={selected ? "Current character" : null}
                primaryTypographyProps={{ noWrap: true }}
              />
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/characters");
          }}
        >
          Manage Characters
        </MenuItem>
      </Menu>
    </>
  );
}
