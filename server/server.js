"use strict";
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const commands = require('./commands.js');


app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static(path.join(__dirname, '..', 'public')));

//All slash commands are sent as posts by default
//I think we should setup the routes in /api/ so it won't get in the way of later expansion
app.post('/api/*', (req, res) => {
  if (req.body.token !== process.env.TOKEN) {
    res.end("Invaild token.");
    return;
  } //Validate token

  //Here we will setup the response JSON object probably with a seperate function
  const RESPONSE_URL = req.body.response_url;
  res.status(200); //We must include this with all JSON object responses
  if (req.body.command === '/lion-bot') {

    if (req.body.text === 'help') {
      res.json(commands.getHelpText());
      return;
    }

    if (req.body.text === 'filtered') {
      res.json(commands.getFilteredText());
      return;
    }

    if (!isNaN(parseInt(req.body.text))) {
      const ind = parseInt(req.body.text);
      let specificItem = commands.getSpecificDoc(ind, res);
      return formatImageURL(req, specificItem);
    }

    if (!req.body.text || req.body.text === '') {
      let randomItem = commands.getRandomDoc(res);
      return formatImageURL(req, randomItem);
    }

  }
  res.json({
    text: 'error: no command'
  });
});

//use standard get '/' to deliver the landing page
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

function formatImageURL(req, out) {
  if (out.attachments !== null) {
    out.attachments[0].image_url = "http://" + req.hostname + out.attachments[0].image_url;
  }
  return out;
}


module.exports = app;
module.exports.port = port;