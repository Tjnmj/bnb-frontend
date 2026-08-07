"use client";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Hotel details and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <SettingsIcon size={18} className="text-emerald-500" />
        </div>
        <p className="text-sm text-gray-500">
          Hotel name, currency, tax rate, etc. will go here once you tell me the
          fields you want.
        </p>
      </div>
    </div>
  );
}
