"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-96 p-6 rounded-2xl bg-white border border-gray-300 shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 ">
          Login Here
        </h2>

        {/* Email */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-black">Email</label>
          <input
            name="email"
            type="email"
            placeholder="rehanali@gmail.com"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-black">Password</label>
          <input
            name="password"
            type="password"
            placeholder="*********"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold text-black">Role</label>
          <select
            name="role"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Login Button */}
        <button
          type="button"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold p-3 rounded transition duration-200"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-3 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link href="./signup" className="text-sky-500 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
  }
