"use client";
import { useEffect, useState } from "react";
import { SalesOverview, getSalesOverview } from "@/lib/api";

export default function DashboardPage() {
  const [overview, setOverview] = useState<SalesOverview | null>(null);

  useEffect(() => {
    getSalesOverview().then(setOverview);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {!overview ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card label="Today's Sales" value={`KSh ${overview.today_sales}`} />
          <Card
            label="Today's Transactions"
            value={overview.today_transactions}
          />
          <Card
            label="All-time Sales"
            value={`KSh ${overview.all_time_sales}`}
          />
          <Card label="Total Rooms" value={overview.total_rooms} />
          <Card label="Occupied Rooms" value={overview.occupied_rooms} />
          <Card label="Available Rooms" value={overview.available_rooms} />
        </div>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
