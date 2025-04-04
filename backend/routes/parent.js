const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Parent = require("../models/Parent");
const User = require("../models/User"); // 👈 Student records are here

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, rollno } = req.body;

    // ✅ Check if student with this roll number exists
    const studentExists = await User.findOne({ rollno });
    if (!studentExists) {
      return res.status(400).json({ message: "Child with this roll number does not exist." });
    }

    const existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ message: "Parent already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = await Parent.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      rollno, // array for future support
    });

    res.status(201).json({ message: "Parent registered successfully", parent });
  } catch (error) {
    res.status(500).json({ message: "Error registering parent", error: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(400).json({ message: "Parent not found" });

    const match = await bcrypt.compare(password, parent.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: parent._id, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ message: "Login successful", token, parent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});
module.exports = router;