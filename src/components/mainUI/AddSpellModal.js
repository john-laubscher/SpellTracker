import * as React from 'react';
import {useContext} from 'react'
import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const AddSpellsModal = ({ isModalOpen, onClose, spellLevel }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  React.useEffect(() => {
    if(isModalOpen) {
      axios.get(`http://localhost:3001/allspells/${spellLevel}/${characterInfo.characterClass}`)
      .then(res => {
        console.log("spell res", res.data.results)
        setSpells(spells => ({ ...spells, 0: res.data.results}));
        console.log('state spells', spells)
      })
      .catch(error => {
        console.log(`Error fetching ${spellLevel} level spells:`, error);
      });
    }
  }, [isModalOpen]);

  const [spells, setSpells] = React.useState({
    0:[],
    1:[],
    2:[],
    3:[],
    4:[],
    5:[],
    6:[],
    7:[],
    8:[],
    9:[],
  })

  const prepareSpell = (spell, spellLevel) => {
    // This should add the spell to state (preparedSpells)
    console.log('spell:', spell)
    console.log('spellLevel', spellLevel)
  }

  const renderSpells = () => {
    console.log(spells)
      return spells[0].map((spell, index) => {
        console.log('spell.name', spell.name)
        return(
        <ListItem disableGutters>
          <ListItemButton onClick={() => prepareSpell(spell, spellLevel)} key={index}>
            <ListItemText primary={spell.name} />
          </ListItemButton>
        </ListItem>
        )
      })
    }

  return (

    <Dialog onClose={onClose} open={isModalOpen}>
      <DialogTitle>Choose spells to prepare</DialogTitle>
      <List sx={{ pt: 0 }}>
        {renderSpells()}
        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={onClose}>
            <ListItemText primary="Exit Spell List" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default AddSpellsModal