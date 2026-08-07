"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    document.getElementById("code-0")?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5)
      document.getElementById(`code-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);
    const nextEmpty = newCode.findIndex((c) => !c);
    document
      .getElementById(`code-${nextEmpty === -1 ? 5 : nextEmpty}`)
      ?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/signup/verify/`, {
        email,
        code: fullCode,
      });
      toast.success("Email verified! You can now sign in.");
      router.push("/login");
    } catch {
      toast.error("Invalid code. Please try again.");
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(`${API_URL}/api/auth/signup/resend/`, { email });
      toast.success("A new code has been sent to your email");
    } catch {
      toast.error("Failed to resend code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Confirm your email address
        </h1>
        <p className="text-sm text-center text-gray-400 mb-1">
          We sent an email to
        </p>
        <p className="text-sm text-center font-semibold text-gray-700 mb-2">
          {email || "your email address"}
        </p>
        <p className="text-sm text-center text-gray-400 mb-8">
          Please confirm your email address by entering the code we just sent to
          your inbox.
        </p>
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-12 text-center text-lg font-bold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${digit ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"} text-gray-900`}
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          disabled={loading || code.join("").length < 6}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 text-sm mb-5"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
        <p className="text-center text-sm text-gray-400">
          Didn't receive a code?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!resending) handleResend();
            }}
            className={`text-blue-500 font-medium hover:underline ${resending ? "opacity-50 pointer-events-none" : ""}`}
          >
            {resending ? "Sending..." : "Resend verification email"}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
