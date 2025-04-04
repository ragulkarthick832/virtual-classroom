"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function CourseActions({ course, setActiveSection, activeSection }) {
  console.log("🧐 Course Data:", course); // Debugging log
  const [file, setFile] = useState(null);

  // Handle File Selection
  const handleFileChange = (event) => {
    console.log("📂 File Selected:", event.target.files[0]); // Debugging log
    setFile(event.target.files[0]);
  };

  // Handle Upload
  const handleUpload = async () => {
    if (!file) {
      console.error("❌ No file selected.");
      alert("Please select an Excel file first.");
      return;
    }

    try {
      console.log("⏳ Reading Excel File...");

      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = async (e) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });

        console.log("📖 Parsed Workbook:", workbook);

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("✅ Extracted JSON Data from Excel:", jsonData);

        // Ensure required columns exist
        if (!jsonData[0]?.["Roll No"] || !jsonData[0]?.["Classes Taken"] || !jsonData[0]?.["Present"]) {
          console.error("❌ Excel file format is incorrect. Missing columns.");
          alert("Invalid Excel file format. Ensure 'Roll No', 'Classes Taken', and 'Present' columns exist.");
          return;
        }

        // Format data as required by backend
        const formattedData = {
          subjectName: course,
          students: jsonData.map((row) => ({
            rollNo: row["Roll No"],
            classTaken: parseInt(row["Classes Taken"], 10),
            present: row["Present"],
          })),
        };

        console.log("📤 Sending API Request to Backend with Data:", formattedData);

        // Send request to backend API
        const response = await fetch("http://localhost:5001/api/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        });

        const result = await response.json();

        console.log("🔄 API Response:", result);

        if (response.ok) {
          alert("✅ Attendance updated successfully!");
        } else {
          console.error("❌ Failed to update attendance:", result.message);
          alert("Failed to update attendance: " + result.message);
        }
      };
    } catch (error) {
      console.error("🚨 Error processing Excel file:", error);
      alert("Error reading the Excel file.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{course} Management</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Other Buttons */}
        <button
          className={`p-4 rounded-lg transition ${
            activeSection === "Assignments" ? "bg-pink-500 text-white" : "bg-[#222539] text-white hover:bg-pink-500"
          }`}
          onClick={() => setActiveSection("Assignments")}
        >
          View Assignments
        </button>
        
        <button
          className={`p-4 rounded-lg transition ${
            activeSection === "CreateAssignment" ? "bg-pink-500 text-white" : "bg-[#222539] text-white hover:bg-pink-500"
          }`}
          onClick={() => setActiveSection("CreateAssignment")}
        >
          Create Assignment
        </button>

        <button
          className={`p-4 rounded-lg transition ${
            activeSection === "Grading" ? "bg-pink-500 text-white" : "bg-[#222539] text-white hover:bg-pink-500"
          }`}
          onClick={() => setActiveSection("Grading")}
        >
          Grading
        </button>

        <button
          className={`p-4 rounded-lg transition ${
            activeSection === "Resources" ? "bg-pink-500 text-white" : "bg-[#222539] text-white hover:bg-pink-500"
          }`}
          onClick={() => setActiveSection("Resources")}
        >
          Resources
        </button>

        {/* New Attendance Upload Button */}
        <div className="col-span-2 md:col-span-4 flex flex-col items-center gap-2 mt-4">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="p-2 border rounded-md" />
          <button
            className="p-4 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
            onClick={handleUpload}
          >
            Upload Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
