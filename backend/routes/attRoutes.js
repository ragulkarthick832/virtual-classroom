const express = require("express");
const router = express.Router();
const attdController = require("../controllers/attdController");


router.post("/student", attdController.getStudentsByCourseName);
router.post("/update", attdController.updateAttendance);

module.exports = router;