const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Crée un nouveau compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur dans la création du compte
 */
router.post("/signup", userCtrl.signUp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post("/login", userCtrl.login);

module.exports = router;
