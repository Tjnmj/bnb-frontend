"use client";
import { useEffect, useState } from "react";
import { StaffUser, createStaffUser, getStaffUsers } from "@/lib/api";
import Modal from "@/components/modal";

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-lg shadow p-4">
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.number}</p>
              <p className="text-sm text-gray-500">Shift: {u.shift_time}</p>
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${u.duty_status === "on_duty" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
              >
                {u.duty_status === "on_duty" ? "On Duty" : "Off Duty"}
              </span>
            </div>
          ))}
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
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          required
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          required
          placeholder="Shift time (e.g. 8AM - 4PM)"
          value={shiftTime}
          onChange={(e) => setShiftTime(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={dutyStatus}
          onChange={(e) =>
            setDutyStatus(e.target.value as "on_duty" | "off_duty")
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="off_duty">Off Duty</option>
          <option value="on_duty">On Duty</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add User"}
        </button>
      </form>
    </Modal>
  );
}
