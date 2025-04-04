const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');  // Importing the Schedule model

// POST - Save a new scheduled class
router.post('/', async (req, res) => {
    const { subject, classTime, classLink, teacherId, studentsEnrolled } = req.body;

    if (!subject || !classTime || !classLink || !teacherId) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newClass = new Schedule({ subject, classTime, classLink, teacherId, studentsEnrolled: studentsEnrolled || [] });
        await newClass.save();
        res.json({ success: true, message: "Class scheduled successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to schedule the class" });
    }
});

// GET - Fetch scheduled classes for a particular student
router.get('/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Fetch all classes where the student is enrolled
        const classes = await Schedule.find({ studentsEnrolled: studentId });
        
        res.json({ success: true, classes });
    } catch (error) {
        console.error("Error fetching scheduled classes:", error);
        res.status(500).json({ error: "Failed to fetch scheduled classes" });
    }
});

// GET - Fetch scheduled classes for a particular teacher
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        
        // Fetch all classes scheduled by this teacher
        const classes = await Schedule.find({ teacherId });
        
        res.json({ success: true, classes });
    } catch (error) {
        console.error("Error fetching scheduled classes:", error);
        res.status(500).json({ error: "Failed to fetch scheduled classes" });
    }
});
// POST - Fetch scheduled classes based on student courses
router.post('/student', async (req, res) => {
    try {
        const { courseTitles } = req.body;

        if (!courseTitles || courseTitles.length === 0) {
            return res.status(400).json({ success: false, message: "No courses provided." });
        }

        // Find all classes that match the provided course titles
        const scheduledClasses = await Schedule.find({ subject: { $in: courseTitles } });

        res.json({ success: true, classes: scheduledClasses });
    } catch (error) {
        console.error("Error fetching scheduled classes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch scheduled classes" });
    }
});

module.exports = router;
