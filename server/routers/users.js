const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new user
router.post("/", async (req, res) => {
  const { username, password, email, firstName, lastName, phoneNumber, role } =
    req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  try {
    // Check if username or email already exists
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      phoneNumber,
      role,
    });

    // Save new user to database
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a user by id
router.put("/:id", async (req, res) => {
  const { username, password, email, firstName, lastName, phoneNumber, role } =
    req.body;

  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.username = username;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.role = role;

    // If password provided, hash it and update
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save updated user to database
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a user by id
router.delete("/:id", async (req, res) => {
  try {
    // Find user by id and delete
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
