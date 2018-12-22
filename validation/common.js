const reduceValidations = values =>
  Object.keys(values).reduce((res, key) =>
    values[key].error ? ({
      ...res,
      error: {
        ...res.error,
        [key]: values[key].error
      }
    }) : ({
      ...res,
      [key]: values[key]
    }), {});

const validateUsername = (value = '') => {
  const username = value.trim();

  if (!/^([a-z]|[A-Z])[\w-]{1,21}([A-z\d])$/.test(username)) {
    return {
      error: 'Username must be a word, contains only mix of letters/digits/underscores/hyphens. Length must be between 3 and 22 symbols. The password can starts only with letter and ends with letter/digit'
    };
  }

  return value;
};

const validateEmail = (value = '') => {
  const email = value.trim().toLowerCase();

  if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return {
      error: 'Email is invalid'
    };
  }

  return email;
};

const validatePassword = (value = '') => {
  const password = value.trim();

  if (!/^([a-z]|[A-Z]|\d){6,28}$/.test(password)) {
    return {
      error: 'Password must contains only letters and digits. Length must be between 6 and 28 symbols.'
    };
  }

  return password;
};

const validateEmailOrUsername = (value = '') => {
  const emailOrUsername = value.trim();

  const email = validateEmail(emailOrUsername);

  const username = validateUsername(emailOrUsername);

  if (email.error && username.error) {
    return {
      error: 'Provided value neither correct email address nor username.'
    };
  }

  return email.error ? username : email;
}

module.exports = {
  reduceValidations,
  validateUsername,
  validateEmail,
  validatePassword,
  validateEmailOrUsername
};
