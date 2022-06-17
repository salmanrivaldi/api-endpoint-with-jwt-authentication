const { User } = require("../models");
const Validator = require("fastest-validator");
const v = new Validator();

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    // const { uuid, name, email, token } = users[0];
    // res.status(200).json({ uuid, name, email, token });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER BY ID
const getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    return res.status(200).json(user);
  }

  return res.status(404).json({ message: "User not found" });
};

// CREATE A NEW USER
const createUser = async (req, res) => {
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
    message: "An user created successfully",
    data: user,
  });
};

// UPDATE AN USER
const updateUser = async (req, res) => {
  const schema = {
    name: "string",
    email: "email",
    password: "string",
  };

  const result = v.validate(req.body, schema);
  if (result.length) {
    return res.status(400).send(result);
  }

  const user = await User.findOne({ where: { uuid: req.params.uuid } });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  const updatedUser = await user.update(req.body);
  return res.json({
    message: "An user updated successfully",
    data: updatedUser,
  });
};

// DELETE AN USER
const deleteUser = async (req, res) => {
  const user = await User.findOne({ where: { uuid: req.params.uuid } });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  await user.destroy();
  return res.json({
    message: "An user deleted successfully",
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
