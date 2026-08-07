"use client";
import { useEffect, useState } from "react";
import { StaffUser, createStaffUser, getStaffUsers } from "@/lib/api";
import Modal from "@/components/Modal";
import { Plus, User } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    setUsers(await getStaffUsers());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">
            Staff on your team and their shifts.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 min-w-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.number}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Shift: {u.shift_time}</p>
              <span
                className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-lg font-medium ${u.duty_status === "on_duty" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
              >
                {u.duty_status === "on_duty" ? "On Duty" : "Off Duty"}
              </span>
            </div>
          ))}
          {users.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-8 text-center">
              <p className="text-sm text-gray-400">No staff added yet.</p>
            </div>
          )}
        </div>
      )}

      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onCreated={load} />
      )}
    </div>
  );
}

function AddUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [dutyStatus, setDutyStatus] = useState<"on_duty" | "off_duty">(
    "off_duty",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createStaffUser({
        name,
        number,
        shift_time: shiftTime,
        duty_status: dutyStatus,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add User" onClose={onClose}>
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
          required
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
          required
          placeholder="Shift time (e.g. 8AM - 4PM)"
          value={shiftTime}
          onChange={(e) => setShiftTime(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={dutyStatus}
          onChange={(e) =>
            setDutyStatus(e.target.value as "on_duty" | "off_duty")
          }
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="off_duty">Off Duty</option>
          <option value="on_duty">On Duty</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          {submitting ? "Adding..." : "Add User"}
        </button>
      </form>
    </Modal>
  );
}
