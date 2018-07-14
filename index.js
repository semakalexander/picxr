const Express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const PORT = process.env.PORT || 3000;

const app = new Express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', routes.users);

app.listen(PORT, () => console.log(`Server successfully started at http://localhost:${PORT}/`));
