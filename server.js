const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

app.get('/*', (req, res) => {
	res.end('lion-bot says hello!');
});

app.listen(port, () => console.log(`Listening on port ${port}...\nNavigate to http://localhost:${port}`));
