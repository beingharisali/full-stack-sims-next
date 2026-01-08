"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.role) {
      alert("Please select a role first!");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        form
      );
      console.log(res.data);
      alert("User registered successfully!");

      if (form.role === "admin") {
        router.push("/dashboard");
      } else if (form.role === "manager") {
        router.push("/manager");
      } else if (form.role === "sales") {
        router.push("/Sale");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      alert(error.response?.data?.msg || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-96 p-6 rounded-2xl bg-white border border-gray-300 shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Sign Up Here</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">First Name</label>
            <input
              name="firstName"
              type="text"
              value={form.firstName}
              placeholder="First Name"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">Last Name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">Email</label>
            <input
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              placeholder="*********"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-1 font-semibold text-black">Role</label>
            <select
              name="role"
              onChange={handleChange}
              value={form.role}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex mx-auto text-center text-white bg-blue-500 border-0 py-2 px-10 focus:outline-none hover:bg-blue-900 rounded-lg text-lg transition duration-200 disabled:opacity-50"
          >
            Register
          </button>
        </form>

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
