// Modèle Book avec schéma de rating
const mongoose = require("mongoose");

// Schéma pour les évaluations
const ratingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
});

// Schéma du livre
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [ratingSchema],
  averageRating: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
