const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

//All slash commands are sent as posts by default
//I think we should setup the routes in /api/ so it won't get in the way of later expansion
app.post('/api/*',(req,res)=>{
    if(req.body.token !== process.env.TOKEN){ res.end("Invaild token."); return; } //Validate token
    //Here we will setup the response JSON object probably with a seperate function

    res.status(200); //We must include this with all JSON object responses
    //res.send(theResponse);
});

//use standard get '/' to deliver the landing page
app.get('/', (req, res) => {
	//res.end('lion-bot says hello!');
	res.sendFile("index.html",{root: __dirname+"/public/" });
});

app.listen(port, () => console.log(`Listening on port ${port}...\nNavigate to http://localhost:${port}`));
