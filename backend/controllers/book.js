const Book = require("../models/Book");
const fs = require("fs");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      next(error);
    });
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  book.save()
    .then(() => {
      res.status(201).json({
        message: "Book saved successfully!",
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      next(error);
    });
};
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: "Book not found!",
        });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({
          message: "Unauthorized request!",
        });
      }

      return Book.updateOne(
        { _id: req.params.id },
        {
          ...bookObject,
          _id: req.params.id,
        }
      );
    })
    .then(() => {
      res.status(200).json({
        message: "Book updated successfully!",
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then((book) => {
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({
        message: "Unauthorized request!",
      });
    }
    const filename = book.imageUrl.split("/images/")[1];

fs.unlink(`images/${filename}`, () => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Book deleted successfully!",
      });
    })
    .catch((error) => {
      next(error);
    });
});
  })
  .catch((error) => {
    next(error);
  });
};

exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: "Book not found!",
        });
      }

      const existingRating = book.ratings.find(
        (rating) => rating.userId === req.auth.userId
      );

      if (existingRating) {
        return res.status(400).json({
          message: "You have already rated this book!",
        });
      }
      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating,
      });
      const totalRating = book.ratings.reduce(
          (sum, rating) => sum + rating.grade,
          0
      );

      book.averageRating = totalRating / book.ratings.length;
      return book.save();
    })
    .then((updatedBook) => {
      res.status(200).json(updatedBook);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      next(error);
    });
};