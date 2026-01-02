"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function Page() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      alert("Please fill all fields");
      return;
    }
    alert("Signup Successful ✅");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-96 p-6 rounded-2xl bg-white border border-gray-300 shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          Sign Up Here
        </h2>

        {/* First Name */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-black">
            First Name
          </label>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-black">
            Last Name
          </label>
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-black">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="rehanali@gmail.com"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-black">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="*********"
            onChange={handleChange}
            className="w-full border border-gray-300  p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold text-black">
            Role
          </label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold p-3 rounded transition duration-200"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center mt-3 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-sky-500 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
