const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;

exports.addUser = async (req, res) => {
  const { ...data } = req.body;
  try {
    if (
      !data.email ||
      !data.username ||
      !data.password ||
      !data.role ||
      !data.status
    )
      return res.status(400).json("All Fields are mandatory!");
    if (!validator.isEmail(data.email))
      return res.status(400).json("Invalid Email format provided!");

    if (
      typeof data.email != "string" ||
      typeof data.username != "string" ||
      typeof data.password != "string" ||
      typeof data.role != "string" ||
      typeof data.status != "string"
    )
      return res.status(400).json("Invalid input provided!");

    if (data.role != "admin" && data.role != "analyst" && data.role != "viewer")
      return res.status(400).json("invalid role");
    if (data.status != "active" && data.status != "inactive")
      return res.status(400).json("invalid status type!");

    const existingUser = await userModel.findOne({ email: data.email });
    if (existingUser) return res.status(400).json("User already exists");

    const hashedpassword = await bcryptjs.hash(data.password, 10);

    let newUser = new userModel({
      username: data.username,
      email: data.email,
      password: hashedpassword,
      role: data.role,
      status: data.status,
    });

    await newUser.save();

    return res.status(201).json({
      message: "new user created",
      userDetails: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json("Invalid input!");
    if (typeof email != "string" || typeof password != "string")
      return res
        .status(400)
        .json("Email and password should be provided in string");

    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) return res.status(404).json("User not found!");

    if (existingUser.status !== "active")
      return res.status(403).json({ message: "User is inactive" });
    const validPassword = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
      },
      jwt_secret,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: `welcome ${existingUser.role}`,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json("Internal Server error!");
  }
};

exports.getAllUsers = async (req, res) => {
  const user = req.user;

  try {
    if (user.role != "admin")
      return res.status(403).json({ message: "unauthorized" });

    let users = await userModel.find({}, "-password");
    if (users.length == 0)
      return res.status(404).json({ message: "no users to display" });
    return res
      .status(200)
      .json({ message: "All users retrieved!", users: users });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.changeUserRole = async (req, res) => {
  const user = req.user;
  const {id} = req.params;
  const  {newRole } = req.body;
  try {
    if (user.role != "admin") return res.status(403).json("Unauthorized!");
    if (typeof newRole != "string")
      return res.status(400).json("Invalid input type!");
    if (newRole != "admin" && newRole != "viewer" && newRole != "analyst")
      return res.status(400).json("invalid data!");

    const changedUser = await userModel.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true, runValidators: true },
    );
    return res.status(201).json({
      message: "User role changed successfully",
      newRole: changedUser.role,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.changeUserStatus = async (req, res) => {
  const user = req.user;
  const {id} = req.params;
  const { newStatus } = req.body;
  try {
    if (user.role != "admin") return res.status(403).json("Unauthorized!");

    if (typeof newStatus != "string")
      return res.status(403).json("Invalid input type!");
    if (newStatus != "active" && newStatus != "inactive")
      return res.status(403).json("Invalid status provided!");

    let changedUser = await userModel.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true },
    );
    return res.status(200).json({
      message: "Status changed successfully!",
      userDetails: {
        id,
        status: changedUser.status,
      },
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
