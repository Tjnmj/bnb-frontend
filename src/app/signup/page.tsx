"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/signup/`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success("Verification code sent! Please check your email.");
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      const data = err.response?.data;
      const msg =
        typeof data === "object"
          ? Object.values(data).flat()[0]
          : "Something went wrong";
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    form.confirmPassword === "" || form.password === form.confirmPassword;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              required
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.password && form.password.length < 8 && (
              <p className="text-xs text-red-400 mt-1">
                At least 8 characters required
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                required
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 transition ${!passwordsMatch ? "border-red-300 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-xs text-red-400 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-indigo-500 font-medium cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
