const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// Would it be better to run all the api calls at once and add them to state so they can more quickly swap between spells and use the spell list feature?

app.get('/allspells/:numerical_spell_level/:character_class', (req, res) => {
    const numerical_spell_level= req.params.numerical_spell_level;
    const character_class = req.params.character_class
    console.log('top of endpoint')
    // **************use template literals to dynamical render the class and level of the spell**************
    axios.get(`https://www.dnd5eapi.co/api/classes/${character_class}/levels/${numerical_spell_level}/spells`)
        .then(response => {
            res.json(response.data)
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
          });
})

// Should my server by 3000 or 3001? 
// If making changes, be sure to restart server

app.listen(3001, () => {
    console.log('Server is running')
})