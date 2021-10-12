const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: "./public/upload",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      checkFIleType(file, cb);
    },
  }).single("imagefile");
  
  function checkFIleType(file, cb) {
    const filetype = /jpeg|jpg|png|gif/;
    const imagetype = filetype.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
  
    const mimetype = filetype.test(file.mimetype);
  
    if (imagetype && mimetype) {
      return cb(null, true);
    } else {
      cb("Enter the image");
    }
  }

module.exports = upload;
