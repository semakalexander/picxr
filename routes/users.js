const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { validateSignup, validateSignIn } = require('../validation/users');

const keys = require('../config/keys');

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
// @desc   sign up. Create user and return token
// @access public
router.post('/', (req, res) => {
  const { username, email, password } = req.body;

  const values = validateSignup({ username, email, password });

  if (values.error) {
    return res.status(400).json(values);
  }

  User
    .findOne({ email })
    .then(user => {
      if (user) {
        res.status(400).json({
          error: {
            email: 'Email is already taken'
          }
        });
      }

      return User.findOne({ username });
    })
    .then(user => {
      if (user) {
        res.status(400).json({
          error: {
            username: 'Username is already taken'
          }
        });
      }
    })
    .then(() => bcrypt.genSalt(10))
    .then(salt => bcrypt.hash(values.password, salt))
    .then(hash => {
      values.password = hash;
      return new User(values).save();
    })
    .then(record => res.json(record))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});


// @route api/users/sign-in
// @desc sign in
// @access public
router.post('/sign-in', (req, res) => {
  const { username, password } = req.body;

  const values = validateSignIn({ username, password });

  if (values.error) {
    return res.status(400).json(values);
  }

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        return res.json({
          error: {
            email: 'There is no user with this username'
          }
        });
      }

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({
              error: {
                password: 'Passwords do not match'
              }
            });
          }

          const payload = {
            id: user.id,
            name: user.name,
          };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 60 * 60 },
            (err, token) => {
              if (err) {
                throw err;
              }

              res.json({
                token: `Bearer ${token}`,
                user: {
                  email: user.email,
                  name: user.name,
                  avatar: user.avatar
                }
              });
            }
          );
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error });
    });
});

module.exports = router;
