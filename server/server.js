const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/singlespell/:spell_index', (req, res) => {
        // const spell_index= 'acid-splash'

    const spell_index= req.params.spell_index
    console.log('SPELLURL', spell_index)
    axios.get(`https://www.dnd5eapi.co/api/spells/${spell_index}`)
        .then(response => {
            res.json(response.data)
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
          });
})

app.get('/allspells/:numerical_spell_level/:character_class', (req, res) => {
    const numerical_spell_level= req.params.numerical_spell_level;
    const character_class = req.params.character_class
    console.log('top of endpoint')
    axios.get(`https://www.dnd5eapi.co/api/classes/${character_class}/levels/${numerical_spell_level}/spells`)
        .then(response => {
            res.json(response.data)
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
          });
})

// function that gets the individual spell 
    // uses base then url value from the spell list 

// Should my server by 3000 or 3001? 
// If making changes, be sure to restart server

app.listen(3001, () => {
    console.log('Server is running')
})