require("dotenv").config();
const mongoose = require("mongoose");

const http = require("http");
const app = require("./app");

const port = process.env.PORT || 4000;

app.set("port", port);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    server.listen(port);
  })
  .catch((error) => {
    console.log("❌ Connection to MongoDB failed");
    console.error(error);
  });