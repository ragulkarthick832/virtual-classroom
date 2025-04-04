"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaEdit,
  FaFolderOpen,
  FaCalendarAlt,
  FaClock,
  FaUpload,
  FaFileAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function Assignments({ course, setActiveSection ,setSelectedAssignment }) {
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedInstructions, setEditedInstructions] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedDueTime, setEditedDueTime] = useState("");
  const [editedFiles, setEditedFiles] = useState([]);

  // Fetch assignments based on course (subject)
  useEffect(() => {
    async function fetchAssignments() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/v1/teacher/assignments",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          // Filter assignments by subject matching the course prop
          const filtered = data.filter(
            (assignment) => assignment.subject === course
          );
          setAssignments(filtered);
        } else {
          console.error("Error fetching assignments:", data.error);
        }
      } catch (error) {
        console.error("Fetch assignments error:", error);
      }
    }
    if (course) {
      fetchAssignments();
    }
  }, [course]);

  // Open Edit Mode
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment.id || assignment._id);
    setEditedTitle(assignment.title);
    setEditedInstructions(assignment.instruction);
    setEditedDueDate(assignment.duedate ? assignment.duedate.slice(0, 10) : "");
    setEditedDueTime(assignment.duetime);
    setEditedFiles(assignment.relatedfile ? [assignment.relatedfile] : []);
  };

  // Handle File Uploads in edit mode (this example just appends file objects to the list)
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setEditedFiles([...editedFiles, ...uploadedFiles]);
  };

  // Save Edited Assignment (for demo, this updates local state only)
  const handleSave = () => {
    setAssignments(
      assignments.map((assignment) =>
        (assignment.id || assignment._id) === editingAssignment
          ? {
              ...assignment,
              title: editedTitle,
              instruction: editedInstructions,
              duedate: editedDueDate,
              duetime: editedDueTime,
              relatedfile:
                editedFiles.length > 0
                  ? editedFiles[0]
                  : assignment.relatedfile,
            }
          : assignment
      )
    );
    setEditingAssignment(null);
  };

  // Simple date formatter (if needed)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  return (
    <div className="bg-[#23273D] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{course} Assignments</h2>
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <div
            key={assignment.id || assignment._id}
            className="bg-[#2D314B] p-4 rounded-lg shadow-md mb-4"
          >
            {editingAssignment === (assignment.id || assignment._id) ? (
              // Edit Mode UI
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-2 mb-4 bg-[#3A3F5C] text-white rounded"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />

                <label className="block mb-2">Instructions</label>
                <textarea
                  className="w-full p-2 mb-4 bg-[#3A3F5C] text-white rounded"
                  rows="3"
                  value={editedInstructions}
                  onChange={(e) => setEditedInstructions(e.target.value)}
                ></textarea>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 flex items-center gap-2">
                      <FaCalendarAlt /> Due Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 bg-[#3A3F5C] text-white rounded"
                      value={editedDueDate}
                      onChange={(e) => setEditedDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 flex items-center gap-2">
                      <FaClock /> Due Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 bg-[#3A3F5C] text-white rounded"
                      value={editedDueTime}
                      onChange={(e) => setEditedDueTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="mt-4">
                  <label className="block mb-2">Upload Related Files</label>
                  <label className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2">
                    <FaUpload /> Choose Files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Uploaded Files List */}
                {editedFiles.length > 0 && (
                  <div className="mt-4 bg-[#3A3F5C] p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">
                      📂 Uploaded Files
                    </h3>
                    <ul className="text-gray-300">
                      {editedFiles.map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaFileAlt className="text-white" />
                          {/* If file is an object, display file.name; otherwise, display string */}
                          {file.name ? file.name : file}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Save & Cancel Buttons */}
                <div className="mt-4 flex gap-4">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2"
                    onClick={handleSave}
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition flex items-center gap-2"
                    onClick={() => setEditingAssignment(null)}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Normal Mode UI
              <div>
                <h3 className="font-bold text-lg">{assignment.title}</h3>
                <p className="text-gray-300">{assignment.instruction}</p>
                <p className="text-[#fe99e8] font-medium flex items-center gap-2">
                  <FaCalendarAlt /> Deadline: {formatDate(assignment.duedate)}{" "}
                  at {assignment.duetime}
                </p>
                <p className="text-gray-300 flex items-center gap-2">
                  <FaFileAlt /> Submissions:{" "}
                  {assignment.submittedFiles?.length || 0}
                </p>

                {/* Buttons Row */}
                <div className="mt-4 flex gap-4">
                  {/* View Submissions Button */}
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2"
                    onClick={() => {
                      setActiveSection("Submissions");
                      setSelectedAssignment(assignment);
                  }}                  
                  
                  >
                    <FaFolderOpen /> View Submissions
                  </button>

                  {/* Edit Button */}

                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center font-semibold">
          No Assignments Available
        </p>
      )}
    </div>
  );
}
