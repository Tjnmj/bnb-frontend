"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login/`, form);
      Cookies.set("access_token", data.access, { expires: 1 });
      Cookies.set("refresh_token", data.refresh, { expires: 7 });
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof LoginForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-1">
          Login
        </h1>
        <p className="text-sm text-center text-gray-400 mb-8">
          Sign in to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              required
              onChange={handleChange("username")}
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
                onChange={handleChange("password")}
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
            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-500 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
