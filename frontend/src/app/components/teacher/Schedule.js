import React, { useState, useEffect } from "react";
import axios from "axios";

const Schedule = ({ courses, setActiveSection }) => {
    const [subject, setSubject] = useState("");
    const [classTime, setClassTime] = useState("");
    const [scheduledClasses, setScheduledClasses] = useState([]);

    const fetchScheduledClasses = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const teacherId = user?.rollno;

            const response = await axios.get(`http://localhost:5001/api/v1/schedule/teacher/${teacherId}`);

            if (response.data.success) {
                setScheduledClasses(response.data.classes);
            }
        } catch (error) {
            console.error("Error fetching scheduled classes:", error);
        }
    };

    useEffect(() => {
        fetchScheduledClasses(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject || !classTime) {
            alert("Please fill in all the details.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const teacherId = user?.rollno;

        const newClass = { subject, classTime, classLink: "http://localhost:3001/", teacherId };

        try {
            const response = await axios.post("http://localhost:5001/api/v1/schedule", newClass);

            if (response.data.success) {
                alert("Class Scheduled Successfully");
                fetchScheduledClasses();  // Refresh the list after scheduling a class
                setSubject("");
                setClassTime("");
            } else {
                alert("Failed to schedule the class");
            }
        } catch (error) {
            console.error("Error scheduling class:", error);
        }
    };

    return (
        <div className="bg-[#1b1c30] text-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Schedule a Class</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Select Subject:</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 rounded bg-[#23273D] text-white"
                    >
                        <option value="">Select a Subject</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course.title}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label>Class Time:</label>
                    <input
                        type="datetime-local"
                        value={classTime}
                        onChange={(e) => setClassTime(e.target.value)}
                        className="w-full p-2 rounded bg-[#23273D] text-white"
                    />
                </div>

                <div className="mb-4">
                    <label>Class Link:</label>
                    <input
                        type="text"
                        value="http://localhost:3001/"
                        readOnly
                        className="w-full p-2 rounded bg-[#23273D] text-white"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#fe99e8] text-black py-2 px-4 rounded hover:bg-[#f07fc1] transition"
                >
                    Schedule Class
                </button>
            </form>

            {scheduledClasses.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Scheduled Classes</h3>
                    {scheduledClasses.map((classItem, index) => (
                        <div key={index} className="bg-[#23273D] p-4 rounded-lg mb-4">
                            <p><strong>Subject:</strong> {classItem.subject}</p>
                            <p><strong>Time:</strong> {new Date(classItem.classTime).toLocaleString()}</p>
                            <a
                                href={classItem.classLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#fe99e8] underline"
                            >
                                Join Class
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Schedule;
