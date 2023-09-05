const express = require("express");
const app = express();
const router = express.Router();
const { Book } = require("../models/book");
const passport = require("passport");
require("../auth/passport-config")(passport);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { title, author, published_year, description } = req.body;

    if (req.body === "") {
      res.send("enter all details pleease");
    }
    const newBook = {
      title: title,
      author: author,
      published_year: published_year,
      description: description,
    };
    try {
      const book = await Book.create(newBook);
      res.status(201).send(book);
    } catch (error) {
      console.log(error);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const book = await Book.find();
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
  }
});
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "book deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json({
        message: "book updated successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
// patch request
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      const patchedBook = Book.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json({
        message: "book patched successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
app.use(passport.initialize());

module.exports = router;
