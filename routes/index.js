const express = require('express');

const users = require('./users');

const combiner = require('./admin/combiner');

const router = express.Router();

router.use('/users', users);
router.use('/admin/combiner', combiner);

module.exports = router;
