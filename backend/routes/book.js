const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp");
const bookCtrl = require("../controllers/book");

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Récupère tous les livres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste de tous les livres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/", bookCtrl.getAllBooks);

/**
 * @swagger
 * /api/books/bestrating:
 *   get:
 *     summary: Récupère les 3 meilleurs livres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Les 3 livres les mieux notés
 */
router.get("/bestrating", bookCtrl.getBestRatingBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Récupère un livre par ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Le livre demandé
 *       404:
 *         description: Livre non trouvé
 */
router.get("/:id", bookCtrl.getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Crée un nouveau livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *       400:
 *         description: Erreur dans la création
 */
router.post("/", auth, multer, sharp, bookCtrl.createBook);

/**
 * @swagger
 * /api/books/{id}/rating:
 *   post:
 *     summary: Ajoute une note à un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Note ajoutée avec succès
 *       400:
 *         description: Erreur dans l'ajout de la note
 */
router.post("/:id/rating", auth, bookCtrl.rateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Supprime un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *       404:
 *         description: Livre non trouvé
 */
router.delete("/:id", auth, bookCtrl.deleteBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Modifie un livre existant
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Livre modifié avec succès
 *       404:
 *         description: Livre non trouvé
 */
router.put("/:id", auth, multer, sharp, bookCtrl.modifyBook);

module.exports = router;
