// Importation des modules et modèles
const Book = require("../models/Book.js");
const Rating = require("../models/Book.js");
const fs = require("fs");

// Récupère tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupère les 3 livres les mieux notés
exports.getBestRatingBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupère un livre par son ID
exports.getBookById = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Crée un nouveau livre avec image
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Modifie un livre existant
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        if (req.file) {
          const filename = book.imageUrl.split("/images/")[1];
          if (fs.existsSync(`images/${filename}`)) {
            fs.unlink(`images/${filename}`, (error) => {
              if (error) {
                throw new Error(
                  "Erreur lors de la suppression de l'ancienne image : " +
                    error,
                );
              }
            });
          }
        }
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id },
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Supprime un livre et son image associée
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Ajoute une note à un livre
exports.rateBook = (req, res, next) => {
  const userId = req.body.userId;
  const rating = req.body.rating;
  Book.findOne({ _id: req.params.id })

    .then((book) => {
      const ratingAlreadyExist = book.ratings.find(
        (rate) => rate.userId === userId,
      );
      if (ratingAlreadyExist) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre." });
      }
      book.ratings.push({ userId: userId, grade: rating });
      book.averageRating =
        book.ratings.reduce((sum, rate) => sum + rate.grade, 0) /
        book.ratings.length;
      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
