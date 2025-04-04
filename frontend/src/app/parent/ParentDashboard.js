// src/app/parent/ParentDashboard.js
"use client";

import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import ChatApp from "./ChatApp";

export default function ParentDashboard() {
  const [activeSection, setActiveSection] = useState("Home");
  const [parentUser, setParentUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setParentUser(JSON.parse(storedUser));
    } else {
      window.location.href = "/parent/login";
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col bg-[#1a1b2f] text-white">
        <header className="bg-[#191b2a] px-6 py-4 shadow text-xl font-bold">
          Parent Dashboard
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === "Home" && (
            <div className="text-center mt-10">
              <h2 className="text-2xl font-semibold text-white">
  Welcome, {parentUser?.name || "Parent"}!
</h2>

              <p className="text-gray-400 mt-2">Click the chat option in the sidebar to talk with your child's teacher.</p>
            </div>
          )}
          {activeSection === "Chat" && <ChatApp />}
        </main>
      </div>
    </div>
  );
}