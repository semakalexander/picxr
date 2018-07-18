const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const { validateSignup } = require('../validation/users');

const router = express.Router();

// @route  api/users
// @desc   get all users
// @access public
router.get('/', (req, res) => {
  User
    .find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));
});

// @route  api/users/:id
// @desc   get user by id
// @access public
router.get('/:id', (req, res) => {
  const { id } = req.params;

  User
    .findById(id)
    .then(record => {
      if (!record) {
        return res.status(404).json({ error: 'There is no user with this id' });
      }

      return res.json(record);
    })
    .catch(() => res.status(404).json({ error: 'There is no user with this id' }));
});

// @route  api/users
// @desc   create user
// @access public
router.post('/', (req, res) => {
  const { username, email, password } = req.body;

  const values = validateSignup({ username, email, password });

  if (values.error) {
    return res.json(values);
  }

  bcrypt.genSalt(10, (saltErr, salt) => {
    if (saltErr) {
      console.error(saltErr);
      return res.json({ error: 'Something went wrong.' });
    }

    bcrypt.hash(values.password, salt, (hashErr, hash) => {
      if (hashErr) {
        console.error(hashErr);
        return res.json({ error: 'Something went wrong.' });
      }

      values.password = hash;

      new User(values)
        .save()
        .then(record => res.json(record))
        .catch(err => res.json(err));
    });
  });
});

module.exports = router;
