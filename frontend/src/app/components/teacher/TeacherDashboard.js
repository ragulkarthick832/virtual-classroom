import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import Assignments from "./Assignments";
import CreateAssignment from "./CreateAssignment";
import CourseActions from "./CourseActions";
import Grading from "./Grading";
import Resources from "./Resources";
import Submissions from "./Submissions";
import FacultyChatApp from "./FacultyChatApp";
import Schedule from "./Schedule";


export default function TeacherDashboard() {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeSection, setActiveSection] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            console.log("📌 User data from localStorage:", user);  // Log user data from localStorage

            if (!user || !user.rollno) {
                console.error("❌ User not found or rollno missing.");
                return;
            }

            console.log("✅ Attempting to fetch courses for teacher with rollno:", user.rollno);

            const response = await axios.get(
                `http://localhost:5001/api/v1/admin/courses/teacher/${user.rollno}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("✅ Response received from backend:", response.data);

            if (response.data && response.data.courses) {
                console.log("✅ Fetched courses for teacher:", response.data.courses);
                setCourses(response.data.courses);
            } else {
                console.error("❌ No courses found in the response data.");
            }

        } catch (error) {
            console.error("❌ Error fetching teacher courses:", error);
        }
    };

    fetchTeacherCourses();  // Call the function when the component loads

}, []);  // The empty dependency array ensures this runs only once, when the component mounts.
useEffect(() => {
  async function fetchAssignments() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("User is not authenticated.");
        return;
      }

      // Fetch all assignments
      const response = await fetch("http://localhost:5001/api/v1/teacher/assignments", {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Fetched All Assignments:", data);  // Log fetched assignments for debugging

        // Grouping assignments by subject
        const grouped = data.reduce((acc, assignment) => {
          const subject = assignment.subject || "General";
          if (!acc[subject]) acc[subject] = [];
          acc[subject].push(assignment);
          return acc;
        }, {});

        console.log("Grouped Assignments:", grouped);  // Log grouped assignments
        setAssignments(grouped);
      } else {
        console.error("Error fetching assignments:", data.error);
      }
    } catch (error) {
      console.error("Fetch assignments error:", error);
    }
  }

  fetchAssignments();
}, []);

  return (
    <div className="h-screen bg-[#1b1c30] text-white flex flex-col">
      <Header
        teacher={teacher}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`flex flex-1 pt-24 transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-0"
        }`}
      >
        <Sidebar
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          courses={courses} 
        />

        <div className="flex-1 p-6 transition-all duration-300">
          {activeSection === "Home" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">All Assignments</h2>

              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="bg-[#23273D] p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-[#2b2f4a] transition"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setActiveSection("Submissions");
                    }}
                  >
                    <h3 className="font-bold text-lg">
                      {assignment.title} ({assignment.subject})
                    </h3>
                    <p className="text-[#fe99e8] font-medium">
                      🆔 Assignment ID:{" "}
                      <span className="text-white">{assignment._id}</span>
                    </p>
                    <p className="text-[#fe99e8] font-medium">
                      🗓 Due Date: {new Date(assignment.duedate).toDateString()}{" "}
                      at {assignment.duetime}
                    </p>
                    <p className="text-gray-300">
                      📑 Submissions: {assignment.submittedFiles.length}
                    </p>
                    <p className="text-gray-400">
                      📜 Instruction: {assignment.instruction}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center font-semibold">
                  No Assignments Available
                </p>
              )}
            </div>
          )}

          
{activeSection === "Submissions" && selectedAssignment && (
    <Submissions assignment={selectedAssignment} setActiveSection={setActiveSection} />
)}
{activeSection === "Schedule" && (
    <Schedule courses={courses} setActiveSection={setActiveSection} />
)}

          {activeSection === "Profile" && <Profile teacher={teacher} />}

          {activeSection === "CourseActions" && selectedCourse && (
            <CourseActions
              course={selectedCourse}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === "Assignments" && selectedCourse && (
            <Assignments
            course={selectedCourse}
            setActiveSection={setActiveSection}
            setSelectedAssignment={setSelectedAssignment} // Passing the function as a prop
          />
          
          )}

          {activeSection === "CreateAssignment" && selectedCourse && (
            <CreateAssignment
              course={selectedCourse}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === "Grading" && selectedCourse && (
            <Grading
              course={selectedCourse}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === "Resources" && selectedCourse && (
            <Resources
              course={selectedCourse}
              setActiveSection={setActiveSection}
            />
          )}
          

          {activeSection === "Chat" && <FacultyChatApp />} {/* Add Chat Here */}
        </div>
      </div>
    </div>
  );
}
