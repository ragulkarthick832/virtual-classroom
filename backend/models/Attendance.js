const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    courseId: { type: String, required: true },
    studentRollNo: { type: String, required: true },
    totalClasses: { type: Number, default: 0 },
    classesAttended: { type: Number, default: 0 },
    attendancePercentage: { type: Number, default: 0 },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
