const express = require("express");
const router = express.Router();
const {
    addCourse,
    deleteCourse,
    addStudentToCourse,
    getStudentCourses,
    getTeacherCourses
} = require("../controllers/adminController");  // ✅ Make sure this path is correct

// Existing Routes
router.post("/courses", addCourse);
router.delete("/courses", deleteCourse);
router.post("/courses/add-student", addStudentToCourse);

// New Routes for Fetching Courses
router.get("/courses/student/:rollno", getStudentCourses);
router.get("/courses/teacher/:teacherRollno", getTeacherCourses);


module.exports = router;
