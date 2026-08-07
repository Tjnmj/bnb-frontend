"use client";
import { useState, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function PassChangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Missing or invalid reset link");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/password-reset/confirm/`, {
        token,
        password,
      });
      toast.success("Password changed successfully!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Link expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm"
          >
            {loading ? "Changing..." : "Change"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PassChangePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      }
    >
      <PassChangeContent />
    </Suspense>
  );
}
