const Parent = require("../models/Parent");
const User = require("../models/User"); // assuming student data is here

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, phone, address, rollno } = req.body;

  try {
    // ✅ Check if roll number exists in students
    const student = await User.findOne({ rollno });
    if (!student) {
      return res.status(400).json({ message: "Child with this roll number does not exist." });
    }

    const parentExists = await Parent.findOne({ email });
    if (parentExists) {
      return res.status(400).json({ message: "Parent already registered." });
    }

    const newParent = new Parent({ name, email, password, phone, address, rollno });
    await newParent.save();

    res.status(201).json({ message: "Parent registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(400).json({ message: "Parent not found" });

    if (parent.password !== password) return res.status(400).json({ message: "Incorrect password" });

    // ✅ Verify the roll number still exists in student collection
    const student = await User.findOne({ rollno: parent.rollno });
    if (!student) return res.status(400).json({ message: "Linked student roll number no longer exists" });

    res.status(200).json({ token: "parent-auth-token", message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
