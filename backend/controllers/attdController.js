const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
exports.getStudentsByCourseName = async (req, res) => {
    try {
      const { courseName } = req.body; // Extract courseName from request body
  
      if (!courseName) {
        return res.status(400).json({ message: "Course name is required" });
      }

      // Find the course by title and populate the students
      const course = await Course.findOne({ title: courseName }).populate("students");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.status(200).json({ students: course.students });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        console.log("Received request to update attendance:", JSON.stringify(req.body, null, 2)); // Log full request body

        const { subjectName, students } = req.body; // Extract subject name and student list

        if (!subjectName || !students || !Array.isArray(students)) {
            console.log("Invalid input data:", subjectName, students);
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Find the course by title
        console.log("Searching for course with courseId:", subjectName);
        const course = await Course.findOne({ courseId: subjectName });

        if (!course) {
            console.log("Course not found for courseId:", subjectName);
            return res.status(404).json({ message: "Course not found" });
        }

        console.log("Found course:", course);

        // Process each student's attendance update
        for (const student of students) {
            const { rollNo, classTaken, present } = student;
            console.log(`Processing student: Roll No: ${rollNo}, Class Taken: ${classTaken}, Present: ${present}`);

            // Find existing attendance record
            let attendance = await Attendance.findOne({
                courseId: course.courseId,
                studentRollNo: rollNo,
            });

            console.log("Fetched attendance record:", attendance ? attendance : "No existing record found");

            if (!attendance) {
                console.log("Creating new attendance record for:", rollNo);
                // Create new attendance record if not found
                attendance = new Attendance({
                    courseId: course._id,
                    studentRollNo: rollNo,
                    totalClasses: 0,
                    classesAttended: 0,
                    attendancePercentage: 0,
                });
            }

            // Update attendance details
            attendance.totalClasses += classTaken;
            if (present.toLowerCase() === "yes") {
                attendance.classesAttended += classTaken;
            }

            // Recalculate attendance percentage
            attendance.attendancePercentage = 
                (attendance.classesAttended / attendance.totalClasses) * 100;

            console.log(`Updated attendance: Total Classes: ${attendance.totalClasses}, Classes Attended: ${attendance.classesAttended}, Attendance %: ${attendance.attendancePercentage.toFixed(2)}%`);

            await attendance.save(); // Save updated record
            console.log("Attendance record saved successfully for:", rollNo);
        }

        console.log("Attendance update process completed successfully.");
        res.status(200).json({ message: "Attendance updated successfully" });

    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
