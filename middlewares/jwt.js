require("dotenv").config();
const JWT = require("jsonwebtoken");

const privateKey = process.env.ACCESS_TOKEN;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  JWT.verify(token, privateKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
