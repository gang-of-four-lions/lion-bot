const app = require('./server/server.js');
const port = app.port;

app.listen(port, () => console.log(`listening on port ${port}`));