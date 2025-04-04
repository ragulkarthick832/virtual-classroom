import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ParentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    rollno: ""
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/v1/parent/register", form);
      alert("Registration successful. You can now login.");
      router.push("/parent/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191b2a] text-white">
      <form onSubmit={handleRegister} className="bg-[#23273d] p-8 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-3xl font-bold mb-6">Parent Registration</h2>
        <input name="name" type="text" placeholder="Full Name" className="w-full p-2 mb-3 rounded" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="w-full p-2 mb-3 rounded" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-3 rounded" onChange={handleChange} required />
        <input name="phone" type="text" placeholder="Phone Number" className="w-full p-2 mb-3 rounded" onChange={handleChange} required />
        <input name="address" type="text" placeholder="Address" className="w-full p-2 mb-3 rounded" onChange={handleChange} required />
        <input name="rollno" type="text" placeholder="Child's Roll Number" className="w-full p-2 mb-3 rounded" onChange={handleChange} required />
        <button type="submit" className="w-full bg-green-600 p-2 rounded hover:bg-green-700">Register</button>
        <p className="mt-4 text-sm">Already have an account? <a href="/parent/login" className="text-blue-400 underline">Login</a></p>
      </form>
    </div>
  );
}