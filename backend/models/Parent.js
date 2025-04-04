const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  rollno: { type: String, required: true }, // ✅ just one roll number
});

module.exports = mongoose.model("Parent", ParentSchema);
