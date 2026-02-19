const sharp = require("sharp");
const path = require("path");

const convertImage = (req, res, next) => {
  if (!req.file) {
    return next();
  } else {
    const filePath = path
      .parse(req.file.originalname)
      .name.split(" ")
      .join("_");

    const outputFilePath = `images/${filePath}-converted.webp`;
    req.file.path = outputFilePath;
    sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(outputFilePath)
      .then(() => {
        next();
      })
      .catch((error) => {
        console.error("Error during image conversion:", error);
        next(error);
      });
  }
};

module.exports = convertImage;
