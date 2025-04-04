const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

const addCourse = async (req, res) => {
    try {
        const { courseId, title, description, rollno } = req.body;

        console.log("🔥 Backend: Received Data from Frontend:", req.body);

        if (!rollno) {
            console.error("❌ Backend Error: Roll Number is missing!");
            return res.status(400).json({ message: "Roll Number is required." });
        }

        // Find the teacher by rollno
        const teacher = await User.findOne({ rollno });

        if (!teacher) {
            console.error("❌ Backend Error: No teacher found with the rollno:", rollno);
            return res.status(404).json({ message: "Teacher not found." });
        }

        console.log("✅ Backend: Found teacher with ID:", teacher._id);

        const newCourse = new Course({
            courseId,
            title,
            description,
            teacher: teacher._id,  // Store the ObjectId of the teacher
            students: []
        });

        console.log("📌 Backend: Saving Course to DB:", newCourse);

        await newCourse.save();

        console.log("✅ Backend: Course successfully saved:", newCourse);

        res.status(201).json({ message: "Course added successfully." });
    } catch (error) {
        console.error("❌ Backend Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOneAndDelete({ courseId });

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.json({ message: "Course deleted successfully." });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addStudentToCourse = async (req, res) => {
    try {
        const { courseId, studentRollNo } = req.body;

        console.log("🔥 Backend: Received Data from Frontend:", req.body);  // Log incoming data

        if (!studentRollNo || !courseId) {
            console.error("❌ Backend Error: Missing courseId or studentRollNo");
            return res.status(400).json({ message: "courseId and studentRollNo are required." });
        }

        // Find the course by courseId
        const course = await Course.findOne({ courseId });

        if (!course) {
            console.error("❌ Backend Error: Course not found with courseId:", courseId);
            return res.status(404).json({ message: "Course not found." });
        }

        console.log("✅ Backend: Found course with ID:", course._id);

        // Add the student roll number to the students array if not already present
        if (!course.students.includes(studentRollNo)) {
            course.students.push(String(studentRollNo));  // Ensure it's stored as a string
            await course.save();
            console.log("✅ Backend: Student successfully added to the course.");

            // Check if attendance record exists for the student in this course
            const existingAttendance = await Attendance.findOne({ courseId, studentRollNo });

            if (!existingAttendance) {
                // Create a new attendance record
                const newAttendance = new Attendance({
                    courseId,
                    studentRollNo,
                    totalClasses: 0,
                    classesAttended: 0,
                    attendancePercentage: 0
                });

                await newAttendance.save();
                console.log("✅ Backend: Attendance record created for student:", studentRollNo);
            } else {
                console.log("⚠️ Backend: Attendance record already exists for student:", studentRollNo);
            }

        } else {
            console.log("⚠️ Student already enrolled in this course.");
        }

        res.status(200).json({ message: "Student added successfully." });
    } catch (error) {
        console.error("❌ Backend Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Fetch courses for a specific student (by rollno)
const getStudentCourses = async (req, res) => {
    try {
        const { rollno } = req.params;

        const courses = await Course.find({ students: rollno });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this student." });
        }

        res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error("Error fetching student courses:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Courses for Teacher by Roll Number
const getTeacherCourses = async (req, res) => {
  try {
      const teacherRollno = req.params.teacherRollno;
      console.log("Backend: Received teacherRollno:", teacherRollno);

      if (!teacherRollno) {
          return res.status(400).json({ message: "Teacher roll number is required" });
      }

      // Find the teacher by roll number
      const teacher = await User.findOne({ rollno: teacherRollno });
      
      if (!teacher) {
          return res.status(404).json({ message: "Teacher not found" });
      }

      console.log("Backend: Found teacher with ID:", teacher._id);

      // Fetch the courses taught by this teacher
      const courses = await Course.find({ teacher: teacher._id });

      if (courses.length === 0) {
          return res.status(404).json({ message: "No courses found for this teacher" });
      }

      console.log("Backend: Found courses for teacher:", courses);

      res.status(200).json({ success: true, courses });
  } catch (error) {
      console.error("Backend: Error fetching teacher courses:", error);
      res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
module.exports = { 
    addCourse, 
    deleteCourse, 
    addStudentToCourse, 
    getStudentCourses, 
    getTeacherCourses 
};
