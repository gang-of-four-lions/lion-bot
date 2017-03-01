"use strict";
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const {formatResponse, getRandomDoc, getSpecificDoc, getHelpText, getFilteredText} = require('./commands.js');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

//All slash commands are sent as posts by default
//I think we should setup the routes in /api/ so it won't get in the way of later expansion
app.post('/api/*', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host') + '/';
  let responseObject = null;

  if (req.body.token !== process.env.TOKEN) {
    res.end("Invaild token.");
    return;
  } // Validate token

  //Here we will setup the response JSON object probably with a seperate function
  if (req.body.command === '/lion-bot') {

    if (req.body.text === 'help') {
      res.json(getHelpText());
      return;
    }

    if (req.body.text === 'filtered') {
      res.json(getFilteredText());
      return;
    }

    if (!isNaN(parseInt(req.body.text))) {
      const ind = parseInt(req.body.text);
      getSpecificDoc(ind, (err, doc) => {
        if (err) {
          console.log(err)
        } else {
          responseObject = doc;
        }
      })
    }

    if (!req.body.text || req.body.text === '') {
      let randomItem = getRandomDoc(res);
      return randomItem;
    }
  }
  responseObject = responseObject || {
    text: 'error: no command'
  }
  res.status(200).json(formatResponse(responseObject, baseUrl))
});

// use standard get '/' to deliver the landing page
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
module.exports.port = port;