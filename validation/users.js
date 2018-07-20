const {
  validateUsername,
  validateEmail,
  validatePassword,
  reduceValidations
} = require('./common');

const validateSignup = ({ username, email, password }) => {
  const values = {};

  values.username = validateUsername(username);

  values.email = validateEmail(email);

  values.password = validatePassword(password);

  return reduceValidations(values);
};

const validateSignIn = ({ username, password }) => {
  const values = {};

  values.username = validateUsername(username);

  values.password = validatePassword(password);

  return reduceValidations(values);
};

module.exports = {
  validateSignup,
  validateSignIn
};
