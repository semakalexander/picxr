const passportJwt = require('passport-jwt');
const mongoose = require('mongoose');
const ROLES = require('../constants/userRoles');

const {
  Strategy,
  ExtractJwt
} = passportJwt;

const User = mongoose.model('users');

const keys = require('./keys');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

module.exports = passport => {
  passport.use('user', new Strategy(options, (jwtPayload, done) => {
    User.findById(jwtPayload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.error(err));
  }));

  passport.use('admin', new Strategy(options, (jwtPayload, done) => {
    User.findById(jwtPayload.id)
      .then(user => {
        if (user && user.role === ROLES.ADMIN) {
          return done(null, user);
        }

        return done(null, false);
      })
      .catch(err => console.error(err));
  }));
};
