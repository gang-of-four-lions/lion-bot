const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOURI;
const NUM_ITEMS = 5;

var exports = module.exports = {};



exports.formatResponse = function(doc) {
  let out = {};
  if (doc.text && doc.text !== "") {
    out.text = doc.text;
  }

  if (doc.image_url && doc.image_url !== "") {
    out.attachments = [{
      image_url: 'http://lion-bot.herokuapp.com/items_img/' + doc.image_url
    }];
  }
  console.log("Doc:", doc);
  console.log("Out:", out);
  //You can apply any additional formatting here
  return out;
};

exports.getRandomDoc = function(res) {
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      console.log(err);
      res.status(200).send("DB error.");
    }
    var col = db.collection("lion-bot");
    col.count().then((cnt) => {
      col.find().skip(Math.floor(Math.random() * (cnt - 1))).limit(1).toArray((err, doc) => {
        if (err) {
          return null;
        }
        db.close();
        let responseObject = exports.formatResponse(doc[0]);
        responseObject.response_type = `in_channel`;
        res.status(200).json(responseObject);
      });
    });
  });
};

exports.getSpecificDoc = function(ind, res) {
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      console.log(err);
      res.status(200).send("DB Error"); return;
    }
    let col = db.collection("lion-bot");
    col.count().then((cnt) => {
      if (ind < 0 || ind >= cnt) {
        res.status(200).send("Invaild index. Select a # between 0 and " + (cnt - 1)); return;
      }
      col.find().skip(ind).limit(1).toArray((err, doc) => {
        if (err) {
          return null;
        }
        db.close();
        let responseObject = exports.formatResponse(doc[0]);
        responseObject.response_type = `in_channel`; // all user in channel will see the response
        res.status(200).json(responseObject);
        return;
      });
      return;
    });
  });
};

exports.getHelpText = function() {
  let helpText = {
    response_type: `ephemeral`, // only 1 user will see the response
    text: [`*lion-bot help*`,
      `*/lion-bot* shows a random item`,
      `*/lion-bot [id]* shows the item with the specified id (0 to ${NUM_ITEMS - 1})`,
      `*/lion-bot filtered* shows a SFW random item`,
      `*/lion-bot filtered [id]* shows the SFW item with the specified id (0 to ${NUM_ITEMS - 1})`,
      `*/lion-bot help* shows this text`].join('\n'),
  };
  return helpText;
};

exports.getFilteredText = function() {
  let filteredText = {
    response_type: `in_channel`, // all user in channel will see the response
    text: [`some filtered item`,
      `randomly selected from database`].join('\n'),
  };
  return filteredText;
};