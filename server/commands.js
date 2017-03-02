const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOURI //|| require('./config.js').MONGOURI;

var exports = module.exports = {};

console.log(uri);

exports.formatResponse = function(doc, baseUrl) {
  console.log('formatResponse is invoked');
  let out = {};
  out.attachments = [{}];
  out.attachments[0].color = '#e65100';
  out.attachments[0].mrkdwn_in = ['title', 'text', 'footer'];

  // first line of text will be title
  // for most responses, this is the only line, however
  // the help command has several lines, but on the first line
  // should be the title
  if (doc.text && doc.text !== "") {
    const arr = doc.text.split('\n');
    out.attachments[0].title = arr[0];
    if (arr[1]) {
      out.attachments[0].text = arr.slice(1).join('\n');  
    }
  }

  if (doc.image_url && doc.image_url !== "") {
    out.attachments[0].image_url = `${baseUrl}items_img/${doc.image_url}`
  }

  // for the footer, place an ind only if ind is specified, and filter
  // the array to make sure there is no falsey value in the array
  out.attachments[0].footer = [
    '<http://lion-bot.herokuapp.com/|Lion-bot>',
    '<http://github.com/gang-of-four-lions/lion-bot|GitHub>',
    ((doc.ind !== undefined) ? 'No. ' + doc.ind : undefined)
  ].filter(el => el).join(' | ');

  out.response_type = doc.response_type || "ephemeral";
  console.log("Doc:", doc);
  console.log("Out:", out);
  //You can apply any additional formatting here
  return out;
};

exports.applyFilter = function(doc) {
  if (doc.text && doc.text !== "") {
    const rx = /\b(fuck|shit|cunt|fucking|fucker|ass|dumbass|bitch)/gi;
    doc.text = doc.text.replace(rx, "****");
  }
  return doc;
}

exports.getSpecificDoc = function(ind, callback) {
  console.log('getSpecificDoc is invoked');
  MongoClient.connect(uri, function(err, db) {
    if (err) {
      return callback(err);
    }
    console.log('---and getSpecificDoc keeps working---');
    let col = db.collection("lion-bot");
    col.count().then((cnt) => {
      if (ind === null || ind < 0 || ind >= cnt) {
        ind = Math.floor(Math.random() * (cnt - 1));
      }
      col.find().skip(ind).limit(1).toArray((err, doc) => {
        if (err) {
          return callback(err);
        }
        db.close();
        let responseObject = doc[0];
        responseObject.ind = ind;
        responseObject.response_type = `in_channel`; // all user in channel will see the response
        callback(null, responseObject);
      });
    });
  });
};

const getItemsCount = (callback) => {
  MongoClient.connect(uri, (err, db) => {
    if (err) {
      return callback(err);
    }
    let col = db.collection('lion-bot');
    col.count().then(cnt => {
      db.close();
      callback(null, cnt);
    });
  });
};

exports.getHelpText = function(callback) {
  // TODO: throw an error if can not get num items
  getItemsCount((err, count) => {
    let helpText = {
      response_type: `ephemeral`, // only 1 user will see the response
      text: [`Lion-bot Help`,
        `*/lion-bot* shows a random item`,
        `*/lion-bot [id]* shows the item with the specified id (0 to ${count - 1})`,
        `*/lion-bot filtered* shows a SFW random item`,
        `*/lion-bot filtered [id]* shows the SFW item with the specified id (0 to ${count - 1})`,
        `*/lion-bot help* shows this text`].join('\n'),
    };
    callback(null, helpText);
  })
};


