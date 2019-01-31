const Express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const keys = require('./config/keys');
const routes = require('./routes/index');

const passportConfig = require('./config/passport');

const setup = require('./setup');

const PORT = process.env.PORT || 9000;

mongoose
  .connect(keys.dbUri, { useNewUrlParser: true })
  .then(() => console.log('MongodDB is connected'))
  .then(setup.createAdmin)
  // .then(setup.createUsers)
  .catch(err => console.error(err));


const app = new Express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
passportConfig(passport);

app.use('/api/', routes);

app.listen(PORT, () => console.log(`Server successfully started at http://localhost:${PORT}/`));
