const express = require("express");
const router = express.Router();
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/userController");
const authenticateToken = require("../middlewares/jwt");

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", authenticateToken, createUser);
router.patch("/:uuid", authenticateToken, updateUser);
router.delete("/:uuid", authenticateToken, deleteUser);

module.exports = router;
