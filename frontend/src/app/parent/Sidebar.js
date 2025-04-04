// src/app/parent/Sidebar.js
"use client";

import { FaComments, FaHome } from "react-icons/fa";

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="w-64 bg-[#191b2a] h-full p-4">
      <div className="text-white font-bold text-xl mb-6">LEARNIFY</div>
      <div className="space-y-4">
        <button
          onClick={() => setActiveSection("Home")}
          className={`flex items-center gap-2 px-4 py-2 rounded w-full text-left ${
            activeSection === "Home" ? "bg-[#6A5BFF] text-white" : "text-white hover:bg-[#2e3148]"
          }`}
        >
          <FaHome /> Home
        </button>
        <button
          onClick={() => setActiveSection("Chat")}
          className={`flex items-center gap-2 px-4 py-2 rounded w-full text-left ${
            activeSection === "Chat" ? "bg-[#6A5BFF] text-white" : "text-white hover:bg-[#2e3148]"
          }`}
        >
          <FaComments /> Chat with Teacher
        </button>
      </div>
    </div>
  );
}