"use strict";
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const {formatResponse, getSpecificDoc, getHelpText, applyFilter} = require('./commands.js');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

//All slash commands are sent as posts by default
//I think we should setup the routes in /api/ so it won't get in the way of later expansion
app.post('/api/*', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host') + '/';
  let responseObject = null;
  let errorObject = null;

  function respond(res, doc) {
    res.status(200).json(formatResponse(doc, baseUrl));
  }

  if (req.body.token !== process.env.TOKEN) {
    res.end("Invaild token.");
    return;
  } // Validate token

  //Here we will setup the response JSON object probably with a seperate function
  if (req.body.command === '/lion-bot') {

    if (req.body.text === 'help') {
      getHelpText((err, doc) => {
        (err) ? (errorObject = err) : (respond(res, doc));
      });
      return;
    }

    if (req.body.text === 'filtered') {
      getSpecificDoc(null, (err, doc) => {
        if (err) {
          errorObject = err;
        } else {
          respond(res, applyFilter(doc));
        }
      });
      return;
    }

    const filterRexEx = /filtered.(\d+)/i; // filtered NNNNN
    const matches = filterRexEx.exec(req.body.text); // find all matches
    if (matches) { // if matches then ok, I get first
      const ind = +matches[1];
      return getSpecificDoc(ind, (err, doc) => {
        if (err) {
          respond(res, { text: err.toString() });
        } else {
          respond(res, applyFilter(doc));
        }
      });
    }

    if (!isNaN(parseInt(req.body.text))) { // some [id] specified
      const ind = parseInt(req.body.text);
      return getSpecificDoc(ind, (err, doc) => {
        (err) ? (errorObject = err) : (respond(res, doc));
      });
    }

    if (!errorObject) {
      return getSpecificDoc(null, (err, doc) => {
        if (err) {
          respond(res, { text: err.toString() });
        } else {
          respond(res, doc);
        }
      });
    }
  }
  responseObject = responseObject || {
    text: (errorObject || `error. I don\'t know where.\nbtw, url is ${baseUrl}`)
  };
  respond(res, formatResponse(responseObject, baseUrl));
});

// use standard get '/' to deliver the landing page
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


module.exports = app;
module.exports.port = port;