"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ParentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    rollno: "",
  });

  const router = useRouter();

  const validateForm = () => {
    const { name, email, password, confirmPassword, phone, address, rollno } = form;

    if (!name || !email || !password || !confirmPassword || !phone || !address || !rollno) {
      alert("Please fill all fields.");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must be 10 digits.");
      return false;
    }


    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...rest } = form; // exclude confirmPassword
      await axios.post("http://localhost:5001/api/v1/parent/register", rest);
      alert("Registration successful! You can now log in.");
      router.push("/parent/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191b2a] text-white">
      <form onSubmit={handleRegister} className="bg-[#23273d] p-8 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-3xl font-bold mb-6">Parent Registration</h2>
        <input name="name" type="text" placeholder="Full Name" className="w-full p-2 mb-3 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" className="w-full p-2 mb-3 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-3 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full p-2 mb-3 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <input name="phone" type="text" placeholder="Phone Number" className="w-full p-2 mb-3 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <input name="address" type="text" placeholder="Address" className="w-full p-2 mb-3 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <input name="rollno" type="text" placeholder="Child's Roll Number" className="w-full p-2 mb-4 rounded bg-[#2e3148] text-white placeholder-gray-400" onChange={handleChange} />
        <button type="submit" className="w-full bg-[#4b5dff] p-2 rounded hover:bg-[#3b4ce2]">Register</button>
        <p className="mt-4 text-sm">Already have an account? <a href="/parent/login" className="text-blue-400 underline">Login</a></p>
      </form>
    </div>
  );
}