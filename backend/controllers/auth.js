const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: "User created successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.login = (req, res) => {
  let currentUser;

  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found!" });
      }

      currentUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((valid) => {
      if (!valid) {
        return res.status(401).json({ error: "Incorrect password!" });
      }

      res.status(200).json({
        userId: currentUser._id,
        token: jwt.sign(
          { userId: currentUser._id },
          "RANDOM_TOKEN_SECRET",
          { expiresIn: "24h" }
        ),
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};