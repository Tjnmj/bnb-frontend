"use client";
import { useEffect, useState } from "react";
import { SalesOverview, getSalesOverview } from "@/lib/api";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  DoorOpen,
  DoorClosed,
  Home,
} from "lucide-react";

export default function DashboardPage() {
  const [overview, setOverview] = useState<SalesOverview | null>(null);

  useEffect(() => {
    getSalesOverview().then(setOverview);
  }, []);

  const cards = overview
    ? [
        {
          label: "Today's Sales",
          icon: DollarSign,
          value: `KSh ${overview.today_sales}`,
        },
        {
          label: "Today's Transactions",
          icon: ShoppingCart,
          value: overview.today_transactions,
        },
        {
          label: "All-time Sales",
          icon: TrendingUp,
          value: `KSh ${overview.all_time_sales}`,
        },
        { label: "Total Rooms", icon: Home, value: overview.total_rooms },
        {
          label: "Occupied Rooms",
          icon: DoorClosed,
          value: overview.occupied_rooms,
        },
        {
          label: "Available Rooms",
          icon: DoorOpen,
          value: overview.available_rooms,
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of today's activity.</p>
      </div>

      {!overview ? (
        <p className="text-sm text-gray-400 text-center py-10">Loading...</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 sm:gap-4">
          {cards.map(({ label, icon: Icon, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <p className="text-xs text-gray-500 leading-tight break-words">
                  {label}
                </p>
                <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-xl flex-shrink-0">
                  <Icon size={14} className="text-emerald-500" />
                </div>
              </div>
              <p
                className="font-bold text-gray-900 break-words leading-tight"
                style={{ fontSize: "clamp(1rem, 5vw, 1.5rem)" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
