"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ParentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:5001/api/v1/parent/login", {
        email,
        password,
      });
  
      const { token, parent } = res.data;
  
      localStorage.setItem("parentToken", token);
      localStorage.setItem("user", JSON.stringify({ name: parent.name, role: "parent" }));
  
      router.push("/parent"); // ✅ redirect to dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191b2a] text-white">
      <form onSubmit={handleLogin} className="bg-[#23273d] p-8 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-3xl font-bold mb-6">Parent Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded bg-[#2e3148] text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-[#2e3148] text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-[#4b5dff] p-2 rounded hover:bg-[#3b4ce2]">
          Login
        </button>
        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/parent/register" className="text-blue-400 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}