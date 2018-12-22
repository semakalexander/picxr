const omit = (nonOmitted, omitKey) =>
  Object
    .keys(nonOmitted)
    .reduce((o, key) => key !== omitKey ? { ...o, [key]: nonOmitted[key] } : o, {});


module.exports = {
  omit
};
