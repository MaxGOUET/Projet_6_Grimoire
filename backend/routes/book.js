const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatingBooks);
router.get("/:id", bookCtrl.getBookById);

module.exports = router;
