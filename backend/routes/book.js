const bookController = require("../controllers/book");
const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/bestrating", bookController.getBestRatedBooks);
router.get("/:id", bookController.getOneBook);

router.post("/", auth, multer, bookController.createBook);
router.post("/:id/rating", auth, bookController.rateBook);

router.put("/:id", auth, multer, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;