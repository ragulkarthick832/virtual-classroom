const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    subject: { type: String, required: true },
    classTime: { type: Date, required: true },
    classLink: { type: String, required: true },
    teacherId: { type: String, required: true },
    studentsEnrolled: [{ type: String }]  // Array of student roll numbers
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
