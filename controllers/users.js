const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const helper = require('../helpers/common');

const User = require('../models/User');

const { validateSignup, validateSignIn } = require('../validation/users');

const keys = require('../config/keys');

// @route  api/users
// @desc   get all users
// @access public
const getUsers = (req, res) => {
  User
    .find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));
};

// @route  api/users/:id
// @desc   get user by id
// @access public
const getUserById = (req, res) => {
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
};

// @route  api/users/current
// @desc   get current user
// @access private
const getCurrentUser = (req, res) => {
  const { id, name, email } = req.user;

  res.json({
    id,
    name,
    email
  });
};

// @route  api/users
// @desc   sign up. Create user and return token
// @access public
const createUser = (req, res) => {
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
    .then(record => res.status(200).json(helper.omit(record.toObject(), 'password')))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
};

// @route api/users/sign-in
// @desc sign in
// @access public
const signIn = (req, res) => {
  const { emailOrUsername, password } = req.body;

  const values = validateSignIn({ emailOrUsername, password });

  if (values.error) {
    return res.status(400).json(values);
  }

  User
    .findOne({ $or: [{ username: emailOrUsername }, { email: emailOrUsername }] })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: {
            emailOrUsername: 'There is no user with this email/username'
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
            username: user.username,
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
                  username: user.username
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
};

// @route api/users/:followingUserId/follow
// @desc follow user with followingUserId
// @access private
const follow = (req, res) => {
  const { id: currentUserId } = req.user;
  const { followingUserId } = req.params;

  User
    .findById(followingUserId)
    .then(followingUserRecord => {
      if (!followingUserRecord) {
        res.status(400).json({
          error: {
            id: `There is no user with id "${followingUserId}"`
          }
        });
      }

      return User.update({ _id: currentUserId }, {
        $addToSet: {
          followers: followingUserId
        }
      });
    })
    .then(() =>
      User.update({ _id: followingUserId }, {
        $addToSet: {
          following: currentUserId
        }
      }))
    .then(result => res.json(result))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error });
    });
};

// @route api/users/:followingUserId/unfollow
// @desc unfollow user with followingUserId
// @access private
const unfollow = (req, res) => {
  const { id: currentUserId } = req.user;
  const { followingUserId } = req.params;

  User
    .findById(followingUserId)
    .then(followingUserRecord => {
      if (!followingUserRecord) {
        res.status(400).json({
          error: {
            id: `There is no user with id "${followingUserId}"`
          }
        });
      }

      return User.update({ _id: currentUserId }, {
        $pull: {
          followers: followingUserId
        }
      });
    })
    .then(() =>
      User.update({ _id: followingUserId }, {
        $pull: {
          following: currentUserId
        }
      }))
    .then(result => res.json(result))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error });
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  signIn,
  follow,
  unfollow
};
