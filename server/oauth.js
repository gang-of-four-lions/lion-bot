"use strict";
const express = require('express');
const request = require('request');

var MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGOURI;

var router = express.Router();

router.get('/auth/redirect', (req, res) =>{
    var options = {
        uri: 'https://slack.com/api/oauth.access?code='
            +req.query.code+
            '&client_id='+process.env.CLIENT_ID+            //App's client ID
            '&client_secret='+process.env.CLIENT_SECRET+    //App's client Secret
            '&redirect_uri='+process.env.REDIRECT_URI,      //The URI to this
        method: 'GET'
    }
    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            console.log("Error with JSONresponse.ok"+JSONresponse);
            res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end("Error -A02")
        }else{

            //JSONresponse example:
            /*
            {
                "ok":true,
                "access_token":"xoxp-...",
                "scope":"YOUR_SCOPES",
                "user_id":"U...",
                "team_name":"TEAM_NAME",
                "team_id":"TEAM_ID",
                "incoming_webhook": {
                    "channel":"#general",
                    "channel_id":"C...",
                    "configuration_url":"https:\\/\\/my.slack.com\\/services\\/B...",
                    "url":"https:\\/\\/hooks.slack.com\\/services\\/TEAM_ID\\/B...\\/..."
                    }
            }
            */
        MongoClient.connect(uri, (err, db) => { //Here we save the info returned to later verify that this is a valid user
            if (err) { console.log("Error saving Oauth Response"); res.status(200).res.send("Error -A01");   }
            let col = db.collection('users');
                col.insertOne(JSONresponse).then(()=>{ db.close(); res.status(200).send("Success!") }); 
            });
        }
    });

});