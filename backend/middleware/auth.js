const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("Authorization:", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    req.auth = {
      userId: userId,
    };

    if (req.body?.userId && req.body.userId !== userId) {
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
  console.log(error);
  res.status(401).json({ error: error.message });
}
};