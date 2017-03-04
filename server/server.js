"use strict";
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const { formatResponse, lookUpUser } = require('./commands');
const getRoute = require('./routes');
const oauth = require("./oauth");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/",oauth); //Oauth2 routes

app.use(express.static(path.join(__dirname, '..', 'public')));

//All slash commands are sent as posts by default
//I think we should setup the routes in /api/ so it won't get in the way of later expansion
app.post('/api/*', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host') + '/';

  getRoute(req.body)
    .then(respond)
    .catch(err => {
      respond({ text: err.toString() });
    });

  function respond(doc) {
    res.status(200).json(formatResponse(doc, baseUrl));
  }
});

// use standard get '/' to deliver the landing page
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
module.exports.port = port;
