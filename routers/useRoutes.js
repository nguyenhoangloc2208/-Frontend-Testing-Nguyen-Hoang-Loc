const express = require("express");
const router = express.Router();
const {
  upload,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Create a new user
router.post("/", upload.single("avatar"), createUser);

// Get all users
router.get("/", getUsers);

// Update a user
router.put("/:id", upload.single("avatar"), updateUser);

// Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
