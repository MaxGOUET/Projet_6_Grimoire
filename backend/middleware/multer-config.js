// Configuration de Multer pour le téléchargement de fichiers
const multer = require("multer");

// Types MIME acceptés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Stockage en mémoire
const storage = multer.memoryStorage();

// Filtre pour valider le type de fichier
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
