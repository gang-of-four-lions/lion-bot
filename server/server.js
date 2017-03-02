"use strict";
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const {formatResponse, getSpecificDoc, getHelpText, applyFilter, lookUpUser} = require('./commands.js');

const oauth = require("./oauth.js");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/",oauth); //Oauth2 routes

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

  console.log('body:', req.body, '\ntoken:', process.env.TOKEN);
  if (req.body.token !== process.env.TOKEN) {
   res.end("Invaild token.");
   return;
  } // Validate token
  
  lookUpUser(req.body.user_id,(err,result)=>{
    if(err){ res.status(200).send(err); return; }
    //else the token is valid...
  
  
    //Here we will setup the response JSON object probably with a seperate function
    if (req.body.command === '/lion-bot') {
      // provide help text
      if (req.body.text === 'help') {
        getHelpText((err, doc) => {
          if (err) {
            respond(res, { text: err.toString() });
          } else {
            respond(res, doc);
          }
        });
        return;
      }

      // filtered random
      if (req.body.text === 'filtered') {
        return getSpecificDoc(null, (err, doc) => {
          if (err) {
            respond(res, { text: err.toString() });
          } else {
            respond(res, applyFilter(doc));
          }
        });
      }

      // filtered [id]
      const filterRexEx = /filtered.(\d+)/i;
      const matches = filterRexEx.exec(req.body.text);
      if (matches) {
        const ind = +matches[1];
        return getSpecificDoc(ind, (err, doc) => {
          if (err) {
            respond(res, { text: err.toString() });
          } else {
            respond(res, applyFilter(doc));
          }
        });
      }

      // some [id] specified
      if (!isNaN(parseInt(req.body.text))) {
        const ind = parseInt(req.body.text);
        return getSpecificDoc(ind, (err, doc) => {
          (err) ? (errorObject = err) : (respond(res, doc));
        });
      }
      //fallback to random document if no command matches or no command given
      getSpecificDoc(null, (err, doc) => {
        if (err) {
          respond(res, { text: err.toString() });
        } else {
          respond(res, doc);
        }
      });
    }
  
  });//End of lookUpUser
  
  
});

// use standard get '/' to deliver the landing page
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


module.exports = app;
module.exports.port = port;