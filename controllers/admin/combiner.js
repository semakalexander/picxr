const fs = require('fs');

// @route  api/admin/background
// @desc   return background image
// @access private // admin
const saveBackgroundImage = (req, res) => {
  fs.writeFile('./static/images/background-image.png', req.file.buffer, (err, result) => {
    console.log(req.file);
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }

    res.json(result);
  });
};

module.exports = {
  saveBackgroundImage
};
