"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";
import { toast } from "react-hot-toast"; // ✅ import toast

export default function SignUpPage() {
  useRedirectIfAuth();
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      setError("Please fill all fields");
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        form,
      );

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("User registered successfully!"); // ✅ toast success

      // Redirect based on role
      if (form.role === "admin") router.push("/dashboard");
      else if (form.role === "manager") router.push("/manager");
      else if (form.role === "saler") router.push("/saler");
      else router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.msg || "Registration failed";
      setError(msg);
      toast.error(msg); // ✅ toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-96 p-6 rounded-2xl bg-white border border-gray-300 shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Sign Up Here</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">
              First Name
            </label>
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
            <label className="block mb-1 font-semibold text-black">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              value={form.lastName}
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">
              Password
            </label>
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
              <option value="saler">Saler</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex mx-auto text-center text-white bg-blue-500 border-0 py-2 px-10 focus:outline-none hover:bg-blue-900 disabled:bg-gray-400 rounded-lg text-lg transition duration-200"
          >
            {isLoading ? "Registering..." : "Register"}
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
