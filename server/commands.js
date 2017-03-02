const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOURI; // || require('./config.js').MONGOURI;
const NUM_ITEMS = 5;

var exports = module.exports = {};

console.log(uri);

exports.formatResponse = function(doc, baseUrl) {
  console.log('formatResponse is invoked');
  let out = {};
  if (doc.text && doc.text !== "") {
    out.text = doc.text;
  }
  if (doc.image_url && doc.image_url !== "") {
    out.attachments = [{
      image_url: `${baseUrl}items_img/${doc.image_url}`
    }];
  }
  out.response_type = doc.response_type || "ephemeral";
  console.log("Doc:", doc);
  console.log("Out:", out);
  //You can apply any additional formatting here
  return out;
};

exports.getRandomDoc = function(callback) {
  console.log('getRandomDoc is invoked');
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      return callback("DB error.");
    }
    let col = db.collection("lion-bot");
    col.count().then((cnt) => {
      col.find().skip(Math.floor(Math.random() * (cnt - 1))).limit(1).toArray((err, doc) => {
        if (err) {
          return callback("another DB error.");
        }
        db.close();
        let responseObject = doc[0];
        responseObject.response_type = `in_channel`;
        callback(null, responseObject);
      });
    });
  });
};

exports.getSpecificDoc = function(ind, callback) {
  console.log('getSpecificDoc is invoked');
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      return callback(err);
    }
    console.log('---and getSpecificDoc keeps working---');
    let col = db.collection("lion-bot");
    col.count().then((cnt) => {
      if (ind < 0 || ind >= cnt) {
        return callback("Invaild index. Select a # between 0 and " + (cnt - 1)); // TODO: use random + msg
      }
      col.find().skip(ind).limit(1).toArray((err, doc) => {
        if (err) {
          return callback(err);
        }
        db.close();
        let responseObject = doc[0];
        responseObject.response_type = `in_channel`; // all user in channel will see the response
        callback(null, responseObject);
      });
    });
  });
};

exports.getHelpText = function(callback) {
  // TODO: throw an error if can not get num items
  let helpText = {
    response_type: `ephemeral`, // only 1 user will see the response
    text: [`*lion-bot help*`,
      `*/lion-bot* shows a random item`,
      `*/lion-bot [id]* shows the item with the specified id (0 to ${NUM_ITEMS - 1})`,
      `*/lion-bot filtered* shows a SFW random item`,
      `*/lion-bot filtered [id]* shows the SFW item with the specified id (0 to ${NUM_ITEMS - 1})`,
      `*/lion-bot help* shows this text`].join('\n'),
  };
  callback(null, helpText);
};

exports.getFilteredText = function(callback) {
  let randomDoc = exports.getRandomDoc(callback);
  let trueIfObscene = filterText(randomDoc.text);
  let filteredText = {};
  if (trueIfObscene) {
    exports.getFilteredText(callback);
  } else {
    filteredText = randomDoc;
  }
  /*{
    response_type: `in_channel`, // all user in channel will see the response
    text: [`some filtered item`,
      `randomly selected from database`].join('\n'),
  };*/
  callback(null, filteredText);
};

function filterText(text) {
  let rx = new RegExp("\\b(fuck|shit|cunt|fucking|fucker|ass|dumbass|bitch)\\b","i");
  return rx.test(text);
}