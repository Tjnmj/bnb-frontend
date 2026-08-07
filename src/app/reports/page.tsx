"use client";
import { useState } from "react";
import {
  ReportSummary,
  getCustomReport,
  getDailyReport,
  getMonthlyReport,
  getWeeklyReport,
} from "@/lib/api";
import { FileText, Calendar } from "lucide-react";

type Period = "daily" | "weekly" | "monthly" | "custom";

export default function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePeriod, setActivePeriod] = useState<Period | null>(null);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const run = async (period: Period) => {
    setLoading(true);
    setActivePeriod(period);
    try {
      let data: ReportSummary;
      if (period === "daily") data = await getDailyReport();
      else if (period === "weekly") data = await getWeeklyReport();
      else if (period === "monthly") data = await getMonthlyReport();
      else {
        if (!customStart || !customEnd) return;
        data = await getCustomReport(customStart, customEnd);
      }
      setReport(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">
          Review sales and bookings by period.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => run(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              activePeriod === p
                ? "bg-emerald-500 text-white"
                : "bg-white text-gray-600 shadow-sm hover:bg-emerald-50 hover:text-emerald-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-emerald-50 rounded-xl">
            <Calendar size={14} className="text-emerald-500" />
          </div>
          <p className="font-semibold text-gray-900 text-sm">Custom period</p>
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <button
            onClick={() => run("custom")}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Run
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading report...</p>}

      {report && (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 rounded-xl">
                <FileText size={14} className="text-emerald-500" />
              </div>
              <p className="font-semibold text-gray-900 capitalize">
                {report.period} report
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-gray-500">Total sales</p>
                <p className="text-sm font-bold text-emerald-600">
                  KSh {report.total_sales}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total bookings</p>
                <p className="text-sm font-bold text-gray-900">
                  {report.total_bookings}
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Room
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Paid at
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.payments.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-2 text-gray-900 font-medium">
                      {p.room_number}
                    </td>
                    <td className="p-2 capitalize text-gray-600">
                      {p.room_type}
                    </td>
                    <td className="p-2 text-gray-600">{p.client_name}</td>
                    <td className="p-2 font-semibold text-emerald-600">
                      KSh {p.amount_paid}
                    </td>
                    <td className="p-2 text-gray-400 text-xs">
                      {new Date(p.paid_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.payments.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No payments in this period
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
