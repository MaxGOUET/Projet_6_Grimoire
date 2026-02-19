const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!MIME_TYPES[file.mimetype]) {
    callback(new Error("Invalid file type"), false);
  } else {
    callback(null, true);
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image",
);
