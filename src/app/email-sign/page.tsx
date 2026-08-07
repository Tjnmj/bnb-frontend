"use client";
import { useState, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmailSignPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/password-reset/`, { email });
      setSubmitted(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch {
      toast.error(
        "Couldn't send reset email. Check the address and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm"
            >
              {loading ? "Sending..." : "Confirm"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-400">
              We've sent a reset link to your email. Open it in your inbox to
              continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
