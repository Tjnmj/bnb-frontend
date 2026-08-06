"use client";
import { useState } from "react";
import {
  ReportSummary,
  getCustomReport,
  getDailyReport,
  getMonthlyReport,
  getWeeklyReport,
} from "@/lib/api";

type Period = "daily" | "weekly" | "monthly" | "custom";

export default function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const run = async (period: Period) => {
    setLoading(true);
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => run("daily")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Daily
        </button>
        <button
          onClick={() => run("weekly")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Weekly
        </button>
        <button
          onClick={() => run("monthly")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Monthly
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 max-w-md">
        <p className="font-medium mb-2">Custom period</p>
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500">Start</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">End</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            onClick={() => run("custom")}
            className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900"
          >
            Run
          </button>
        </div>
      </div>

      {loading && <p>Loading report...</p>}

      {report && (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="font-semibold mb-2 capitalize">
            {report.period} report
          </p>
          <p>Total sales: KSh {report.total_sales}</p>
          <p className="mb-4">Total bookings: {report.total_bookings}</p>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-2">Room</th>
                <th className="p-2">Type</th>
                <th className="p-2">Client</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Paid at</th>
              </tr>
            </thead>
            <tbody>
              {report.payments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.room_number}</td>
                  <td className="p-2 capitalize">{p.room_type}</td>
                  <td className="p-2">{p.client_name}</td>
                  <td className="p-2">KSh {p.amount_paid}</td>
                  <td className="p-2">
                    {new Date(p.paid_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
