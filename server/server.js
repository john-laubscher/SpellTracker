const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/allspells', (req, res) => {
    console.log('top of endpoint')
    axios.get('https://www.dnd5eapi.co/api/classes/druid/levels/0/spells')
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