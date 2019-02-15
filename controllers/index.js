const users = require('./users');
const combiner = require('./admin/combiner');

module.exports = {
  users,
  admin: {
    combiner
  }
};
