const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const path = require("path");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const express = require("express");
const app = express();

const helmet = require("helmet");

// Configuration Swagger
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use((error, req, res, next) => {
  res.status(error.status || 400).json({ message: error.message });
});

module.exports = app;
