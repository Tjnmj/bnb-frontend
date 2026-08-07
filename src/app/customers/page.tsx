"use client";
import { useEffect, useState } from "react";
import { Customer, RoomType, createCustomer, getCustomers } from "@/lib/api";
import Modal from "@/components/Modal";
import { Plus, Users } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    setCustomers(await getCustomers());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">
            Everyone currently or previously booked in.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">Loading...</p>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Number
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    ID
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Room
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="p-3 font-medium text-gray-900">{c.name}</td>
                    <td className="p-3 text-gray-600">{c.number}</td>
                    <td className="p-3 text-gray-600">{c.id_number}</td>
                    <td className="p-3 text-gray-600">{c.room_number}</td>
                    <td className="p-3 capitalize text-gray-600">
                      {c.room_type}
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      KSh {c.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <AddCustomerModal onClose={() => setShowAdd(false)} onCreated={load} />
      )}
    </div>
  );
}

function AddCustomerModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("bedsitter");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createCustomer({
        name,
        number,
        id_number: idNumber,
        room_number: roomNumber,
        room_type: roomType,
        price,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add customer");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <Modal title="Add Customer" onClose={onClose}>
      {error && (
        <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2 mb-3">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          required
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className={inputClass}
        />
        <input
          required
          placeholder="ID number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          className={inputClass}
        />
        <input
          required
          placeholder="Room number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className={inputClass}
        />
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as RoomType)}
          className={inputClass}
        >
          <option value="bedsitter">Bedsitter</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="deluxe">Deluxe</option>
        </select>
        <input
          required
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>
    </Modal>
  );
}
