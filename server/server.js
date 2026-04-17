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
    const numerical_spell_level = parseInt(req.params.numerical_spell_level);
    const character_class = req.params.character_class;

    if (numerical_spell_level === 0) {
        axios.get(`https://www.dnd5eapi.co/api/2014/classes/${character_class}/spells`)
            .then(response => {
                const allSpells = response.data.results || [];
                const cantripPromises = allSpells.map(spell =>
                    axios.get(`https://www.dnd5eapi.co/api/spells/${spell.index}`)
                        .then(r => r.data)
                        .catch(() => null)
                );
                return Promise.all(cantripPromises);
            })
            .then(spellDetails => {
                const cantrips = spellDetails
                    .filter(s => s && s.level === 0)
                    .map(s => ({ index: s.index, name: s.name, url: `/api/spells/${s.index}` }));
                res.json({ count: cantrips.length, results: cantrips });
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
    } else {
        axios.get(`https://www.dnd5eapi.co/api/classes/${character_class}/levels/${numerical_spell_level}/spells`)
            .then(response => {
                res.json(response.data)
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
    }
})

// function that gets the individual spell 
    // uses base then url value from the spell list 

// Should my server by 3000 or 3001? 
// If making changes, be sure to restart server

app.listen(3001, () => {
    console.log('Server is running')
})