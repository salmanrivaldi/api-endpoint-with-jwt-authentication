const express = require("express");
const router = express.Router();
const { login, register, refreshToken, logout } = require("../controllers/authController");

router.get("/", (req, res) => {
  return res.render("login");
});
router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
