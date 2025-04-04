const express = require("express");
const authMiddleware = require('../middleware/authMiddleware')
const {
    uploadAssignment,
    getTeacherAssignments,
    viewSubmissions,
    getPendingSubmissions,
    upload
} = require("../controllers/teacherController");


const router = express.Router();

router.post("/assignments",authMiddleware, upload.single("file"), uploadAssignment);
router.get("/assignments",authMiddleware, getTeacherAssignments);
router.get("/assignments/:id/submissions",authMiddleware, viewSubmissions);
router.get("/assignments/:id/pending",authMiddleware, getPendingSubmissions);

module.exports = router;
