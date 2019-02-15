const express = require('express');
const passport = require('passport');
const multer = require('multer');
const combinerContrller = require('../../controllers').admin.combiner;

const router = express.Router();
const upload = multer();

router.put(
  '/background-image',
  passport.authenticate('admin', { session: false }),
  upload.single('image'),
  combinerContrller.saveBackgroundImage
);

module.exports = router;
