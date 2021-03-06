const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOURI;

var exports = module.exports = {};

exports.formatResponse = function(doc, baseUrl) {
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
  return out;
};

exports.applyFilter = function(doc) {
  if (doc.text && doc.text !== "") {
    const rx = /\b(fuck|shit|cunt|fucking|fucker|ass|dumbass|bitch)/gi;
    doc.text = doc.text.replace(rx, "****");
  }
  return doc;
}

exports.getSpecificDoc = (ind = null) => {
  return MongoClient.connect(uri)
    .then(db => {
      const col = db.collection('lion-bot');
      return col.count().then(cnt => {
        if (ind === null || ind < 0 || ind >= cnt) {
          ind = Math.floor(Math.random() * (cnt - 1));
        } 
        return col.find().skip(ind).limit(1).toArray().then(docs => {
          db.close();
          let responseObject = docs[0];
          responseObject.ind = ind;
          responseObject.response_type = 'in_channel';
          return responseObject;
        });
      });
    });
};

const getItemsCount = () => {
  return MongoClient.connect(uri)
    .then(db => {
      const col = db.collection('lion-bot');
      return col.count()
        .then(cnt => {
          db.close();
          return cnt;
        });
    });
};

exports.getHelpText = () => {
  return getItemsCount()
    .then(count => {
      return {
        response_type: `ephemeral`, // only 1 user will see the response
        text: [`Lion-bot Help`,
        `*/lion-bot* shows a random item`,
        `*/lion-bot [id]* shows the item with the specified id (0 to ${count - 1})`,
        `*/lion-bot filtered* shows a SFW random item`,
        `*/lion-bot filtered [id]* shows the SFW item with the specified id (0 to ${count - 1})`,
        `*/lion-bot help* shows this text`].join('\n'),
      };
    })
}

exports.lookUpUser = function(user,callback){
  let error = null;
  let result = false;
  MongoClient.connect(uri, (err, db) => {
    if (err) {
      console.log("Error connecting to DB in lookUpToken");
      callback("Error connecting to DB.");
      return;
    }
    let col = db.collection('users');
    col.findOne({ user_id: user },(err,doc)=>{
      if(err){
        console.log("Error in lookUpUser with findOne");
        callback("Error in looking up user.");
        return;
      }
      if(!doc){
        console.log("Invaild user / User not Found: "+ user);
        callback("Error in finding user.");
        return;
      }
      db.close();
      callback(null, true);
      return;
    });
  });
  //Remove this after app setup is done:
  //if(token===process.env.TOKEN){ error=null; result=true; }
  //----------------
};
