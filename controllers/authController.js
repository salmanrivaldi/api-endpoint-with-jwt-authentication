const { User } = require("../models");
const JWT = require("jsonwebtoken");
const Validator = require("fastest-validator");
const v = new Validator();

const privateKey = process.env.ACCESS_TOKEN;
const refreshPrivateKey = process.env.REFRESH_TOKEN;
const expTime = process.env.EXPIRE_TOKEN;

const generateToken = (user) => {
  return JWT.sign(user, privateKey, { expiresIn: expTime });
};

// USER REGISTER
const register = async (req, res) => {
  const schema = {
    name: "string",
    email: "email",
    password: "string",
  };

  const result = v.validate(req.body, schema);
  if (result.length) {
    return res.status(400).send(result);
  }

  const user = await User.create(req.body);
  return res.json({
    message: "User created successfully",
    data: user,
  });
};

// USER LOGIN
const login = async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ where: { name } });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).send({ message: "Invalid password" });
  }
  const accessToken = generateToken(req.body);
  const refreshToken = JWT.sign(req.body, refreshPrivateKey);

  user.update({ accessToken, refreshToken });

  return res.json({
    message: "User logged in successfully",
    data: {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    },
  });
};

// USER LOGOUT
const logout = async (req, res) => {
  const { name } = req.body;
  const user = await User.findOne({ where: { name } });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  user.update({ accessToken: null, refreshToken: null });

  return res.json({
    message: "User logged out successfully",
  });
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken == null) return res.sendStatus(401);

  const user = await User.findOne({ where: { refreshToken } });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  JWT.verify(refreshToken, refreshPrivateKey, async (err, user) => {
    if (err) return res.sendStatus(403);

    // update new token to database
    const accessToken = generateToken({ name: user.name });
    await User.update({ accessToken }, { where: { refreshToken } });

    return res.json({
      message: "Token refreshed successfully",
      newToken: accessToken,
    });
  });
};

module.exports = { login, register, logout, refreshToken };
