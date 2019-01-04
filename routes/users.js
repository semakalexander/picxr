const express = require('express');
const passport = require('passport');
const userController = require('../controllers').users;

const router = express.Router();

router.get('/', passport.authenticate('user', { session: false }), userController.getUsers);
router.get('/current', passport.authenticate('user', { session: false }), userController.getCurrentUser);
router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);
router.post('/sign-in', userController.signIn);

router.patch('/:followingUserId/follow', passport.authenticate('user', { session: false }), userController.follow);
router.patch('/:followingUserId/unfollow', passport.authenticate('user', { session: false }), userController.unfollow);

router.delete('/:id', passport.authenticate('admin', { session: false }), userController.remove);

module.exports = router;
