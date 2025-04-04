const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { getFacultyMembers } = require("../controllers/authController");
// ✅ Send a message (POST)
router.post("/send", chatController.createChat);

// ✅ Get all messages between two users (GET)
router.get("/chatBetweenUsers", chatController.getChatsBetweenUsers);

// Get all the faculty
router.get("/faculty", getFacultyMembers);

// Get all the students
// router.get("/faculty/:facultyName/students", chatController.getStudentsWhoMessagedFaculty);
router.get("/faculty/:facultyName/recipients", chatController.getRecipientsWhoMessagedFaculty);
module.exports = router;
