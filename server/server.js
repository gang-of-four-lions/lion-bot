const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOURI;

const port = process.env.PORT || 3000;

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

const NUM_ITEMS = 5;

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
      let helpText = {
        response_type: `ephemeral`, // only 1 user will see the response
        text: [`*lion-bot help*`,
          `*/lion-bot* shows a random item`,
          `*/lion-bot [id]* shows the item with the specified id (0 to ${NUM_ITEMS - 1})`,
          `*/lion-bot filtered* shows a SFW random item`,
          `*/lion-bot filtered [id]* shows the SFW item with the specified id (0 to ${NUM_ITEMS - 1})`,
          `*/lion-bot help* shows this text`].join('\n'),

      };
      res.json(helpText);
      return;
    }

    if (req.body.text === 'filtered') {
      let filteredText = {
        response_type: `in_channel`, // all user in channel will see the response
        text: [`some filtered item`,
          `randomly selected from database`].join('\n'),
      };
      res.json(filteredText);
      return;
    }
    
    if (req.body.text === '') {
      let rand = getRandomDoc();
      let randomText = {
        response_type: `in_channel`,
        text: [rand.text, rand.author].join('\n'),
      };
      res.json(randomText);
      return;
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

//function to grab a random document from db
function getRandomDoc() {
  MongoClient.connect(uri, function(err, db) {
    if (err) { return; }
    let rand = db['lion-bot'].aggregate(
      [{ $sample: { size: 1 } }]
    );
    let doc = rand.toArray();
    db.close();
    return doc[0];
  });
}

module.exports = app;
module.exports.port = port;