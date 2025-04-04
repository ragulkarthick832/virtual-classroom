"use client";

import { useState, useEffect } from "react";
import axios from "axios";  // Make sure to install axios: npm install axios
import Header from "./Header";
import Sidebar from "./Sidebar";
import AdminProfile from "./AdminProfile.js";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(''); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [admin, setAdmin] = useState(null);


  const [courseData, setCourseData] = useState({
    courseId: '',
    title: '',
    description: '',
    rollno: ''  // Changed to 'rollno'
  });

  const correctUsername = "admin";
  const correctPassword = "password123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === correctUsername && password === correctPassword) {
      setIsAuthenticated(true);
      setErrorMessage("");
    } else {
      setErrorMessage("❌ Incorrect username or password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleCourseSubmit = async () => {
    try {
        const response = await axios.post('http://localhost:5001/api/v1/admin/courses', {
            courseId: courseData.courseId,
            title: courseData.title,
            description: courseData.description,
            rollno: courseData.rollno  // Make sure rollno is passed here
        });

        if (response.data.message) {
            alert(response.data.message);
        }

        setCourseData({ courseId: '', title: '', description: '', rollno: '' }); // Clear the form
    } catch (error) {
        console.error("Error:", error.response?.data?.error || error.message);
        alert(error.response?.data?.error || 'Failed to add course');
    }
  };
  const handleDeleteCourse = async () => {
    if (!courseData.courseId) {
        alert("Please enter a valid Course ID to delete.");
        return;
    }

    try {
        const response = await axios.delete('http://localhost:5001/api/v1/admin/courses', {
            data: { courseId: courseData.courseId }  // Make sure it's being sent correctly
        });

        if (response.data.message) {
            alert(response.data.message);
        }

        setCourseData({ ...courseData, courseId: '' }); // Clear the courseId field
    } catch (error) {
        console.error("Error:", error.response?.data?.error || error.message);
        alert(error.response?.data?.error || 'Failed to delete course');
    }
};
const handleAddStudent = async () => {
  if (!courseData.courseId || !courseData.studentRollNo) {
      alert("Please enter both Course ID and Student Roll Number.");
      return;
  }

  try {
      console.log("📌 Frontend: Sending Data to Backend", {
          courseId: courseData.courseId,
          studentRollNo: courseData.studentRollNo
      });

      const response = await axios.post('http://localhost:5001/api/v1/admin/courses/add-student', {
          courseId: courseData.courseId,
          studentRollNo: courseData.studentRollNo  // Make sure it's passed as a string
      });

      if (response.data.message) {
          alert(response.data.message);
      }

      setCourseData({ ...courseData, courseId: '', studentRollNo: '' }); // Clear input fields
  } catch (error) {
      console.error("❌ Error:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Failed to add student to the course.');
  }
};



  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <h2 className="text-2xl font-bold mb-4">🔒 Admin Login</h2>
          {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <label className="block mb-2">
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded mt-1 text-black"
                required
              />
            </label>
            <label className="block mb-4">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1 text-black"
                required
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1b1c30] text-white flex flex-col">
      <Header
        admin={admin}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex flex-1">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setActiveSection={setActiveSection}
        />

        <div className="flex-1 p-6">
          {activeSection === 'addCourse' && (
            <div className="p-6 bg-[#222539] rounded-lg w-full max-w-2xl mx-auto">
              <h2 className="text-2xl mb-4">Add New Course</h2>
              <input 
                name="courseId"
                value={courseData.courseId}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
                placeholder="Course ID"
              />
              <input 
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
                placeholder="Title"
              />
              <textarea 
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
                placeholder="Description"
              ></textarea>
              <input 
                name="rollno"
                value={courseData.rollno}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
                placeholder="Teacher Roll No"
              />
              <button 
                onClick={handleCourseSubmit} 
                className="bg-green-500 text-white p-2 rounded w-full"
              >
                Add Course
              </button>
            </div>
          )}
        </div>
        {activeSection === 'deleteCourse' && (
    <div className="p-6 bg-[#222539] rounded-lg w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl mb-4">Delete Course</h2>
      <input 
        name="courseId"
        value={courseData.courseId}
        onChange={handleInputChange}
        className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
        placeholder="Enter Course ID to delete"
      />
      <button 
        onClick={handleDeleteCourse} 
        className="bg-red-500 text-white p-2 rounded w-full"
      >
        Delete Course
      </button>
    </div>
    
  )}
  {activeSection === 'addStudent' && (
  <div className="p-6 bg-[#222539] rounded-lg w-full max-w-2xl mx-auto mt-6">
    <h2 className="text-2xl mb-4">Add Student to Course</h2>
    <input 
      name="courseId"
      value={courseData.courseId}
      onChange={handleInputChange}
      className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
      placeholder="Enter Course ID"
    />
    <input 
      name="studentRollNo"
      value={courseData.studentRollNo}
      onChange={handleInputChange}
      className="mb-2 w-full p-2 rounded bg-[#1b1c30] text-white"
      placeholder="Enter Student Roll Number"
    />
    <button 
      onClick={handleAddStudent} 
      className="bg-blue-500 text-white p-2 rounded w-full"
    >
      Add Student
    </button>
  </div>
)}

      </div>
    </div>
  );
      
  
}
