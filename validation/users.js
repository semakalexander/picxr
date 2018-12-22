const {
  validateUsername,
  validateEmail,
  validatePassword,
  validateEmailOrUsername,
  reduceValidations
} = require('./common');

const validateSignup = ({ username, email, password }) => {
  const values = {};

  values.username = validateUsername(username);

  values.email = validateEmail(email);

  values.password = validatePassword(password);

  return reduceValidations(values);
};

const validateSignIn = ({ emailOrUsername, password }) => {
  const values = {};

  values.emailOrUsername = validateEmailOrUsername(emailOrUsername);

  values.password = validatePassword(password);

  return reduceValidations(values);
};

module.exports = {
  validateSignup,
  validateSignIn
};
