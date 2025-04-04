"use client";

import { useState, useEffect } from "react";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Use Next.js router

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  student,
  teacher,
}) {
  const router = useRouter();
  const [user, setUser] = useState(student || teacher || null);

  // On mount, if no user prop is provided, try to retrieve it from localStorage.
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    localStorage.removeItem("user"); // Optionally remove the stored user
    router.push("./"); // Redirect to home
    router.refresh(); // Ensure the page refreshes to reflect logout
  };

  return (
    <div className="w-full bg-[#1E2235] p-6 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
      {/* Sidebar Toggle Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="text-3xl font-bold px-2 py-1 bg-[#2b2d4c] rounded-lg"
        >
          <FaBars />
        </button>
        <span className="text-4xl font-bold tracking-wide uppercase">
          LEARNIFY
        </span>
      </div>

      {/* User Info (Student, Teacher, or from localStorage) */}
      <div className="flex items-center gap-4">
        <img
          src={user?.image || "/images/Teacher.jpg"} // Fallback image
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <span className="text-lg">{user?.name || "Guest"}</span>
        <button
          className="text-gray-400 text-2xl hover:text-white"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}
