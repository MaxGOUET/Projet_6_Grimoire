// Importation des modules nécessaires
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const helmet = require("helmet");

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Importation des routes
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création de l'application Express
const app = express();

// Configuration Swagger pour la documentation de l'API
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mon Vieux Grimoire API",
      description: "API pour la gestion des livres",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Serveur local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

// Génération de la spécification Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configuration du limiteur de débit (rate limiting)
// Limite à 100 requêtes par IP toutes les 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
  standardHeaders: true, // Retourne les infos de rate limit dans les headers RateLimit-*
  legacyHeaders: false, // Désactive les headers X-RateLimit-*
  ipv6Subnet: 56, // Configuration du subnet IPv6
});
// Activation des middlewares
// Helmet : sécurise les headers HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
  }),
);
// Rate limiting : limite le nombre de requêtes
app.use(limiter);
// Express JSON : parse les requêtes JSON
app.use(express.json());
// Serveur statique : accès aux images
app.use("/images", express.static(path.join(__dirname, "images")));
// Documentation Swagger : accessible à /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware CORS : autorise les requêtes cross-origin
app.use((req, res, next) => {
  // Autorise les requêtes depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Définit les headers autorisés dans les requêtes
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  // Définit les méthodes HTTP autorisées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// Routes de l'API
// Routes pour les livres
app.use("/api/books", bookRoutes);
// Routes pour l'authentification
app.use("/api/auth", userRoutes);

// Middleware de gestion des erreurs : capte toutes les erreurs et les retourne en JSON
app.use((error, req, res, next) => {
  res.status(error.status || 400).json({ message: error.message });
});

// Exportation de l'application
module.exports = app;
