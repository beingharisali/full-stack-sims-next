"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  useRedirectIfAuth();

  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.role) {
      setError("Please fill all fields");
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        form,
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: form.email,
          role: form.role,
          token: res.data.token,
        }),
      );

      toast.success("Login successful!");

      if (form.role === "admin") router.push("/dashboard");
      else if (form.role === "manager") router.push("/manager");
      else if (form.role === "saler") router.push("/saler");
      else router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.msg || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-96 p-6 rounded-2xl bg-white border border-gray-300 shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Login Here</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-semibold text-black">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="abc@gmail.com"
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
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="saler">Saler</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-semibold p-3 rounded transition duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-sky-500 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
