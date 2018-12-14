const express = require('express');
const passport = require('passport');
const controllers = require('../controllers');

const router = express.Router();

router.get('/', controllers.users.getUsers);
router.get('/:id', controllers.users.getUserById);
router.get('/current/', passport.authenticate('jwt', { session: false }), controllers.users.getCurrentUser);
router.post('/', controllers.users.createUser);
router.post('/sign-in', controllers.users.signIn);
router.patch('/:followingUserId/follow', passport.authenticate('jwt', { session: false }), controllers.users.follow);
router.patch('/:followingUserId/unfollow', passport.authenticate('jwt', { session: false }), controllers.users.unfollow);

module.exports = router;
