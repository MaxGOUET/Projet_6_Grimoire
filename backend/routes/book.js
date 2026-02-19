const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.post("/", auth, multer, bookCtrl.createBook);
router.get("/bestrating", bookCtrl.getBestRatingBooks);
router.get("/:id", bookCtrl.getBookById);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
