const fs = require('fs');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const URI = process.env.MONGOURI || 'mongodb://localhost:27017/lion-bot'
if (!process.env.MONGOURI) {
  fs.writeFile('./.env', 'MONGOURI=' + URI, (err) => {
    console.log('write file complete');
    if (err) {
      console.log(err);
    }
  });
}

if (/ds111940/gi.test(URI)) {
  console.log('You are trying to add records to the production db. Shame on you.');
  process.exit();
}

MongoClient.connect(URI).then(db => {
  console.log('Connected to db');
  const objs = [
    { text: 'test object 1' },
    { image_url: 'joke-1.jpg' },
    { text: 'test numbah 3' },
    { image_url: 'joke-2.jpg' },
    { image_url: 'joke-3.jpg' },
    { text: 'this is a final test' }
  ];

  db.collection('lion-bot').insertMany(objs).then(() => {
    console.log('Documents inserted into collection "lion-bot"');
    db.close().then(() => process.exit(0));
  })
}).catch(() => console.log('There was an error connecting to the db. Please ensure you have mongod running and listening on port 27017. Alternatively, you can put your custom URI inside the .env file.'));
