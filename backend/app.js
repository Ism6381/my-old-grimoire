const bookRoutes = require("./routes/book");
const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static("images"));

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;