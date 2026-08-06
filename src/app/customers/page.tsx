"use client";
import { useEffect, useState } from "react";
import { Customer, RoomType, createCustomer, getCustomers } from "@/lib/api";
import Modal from "@/components/Modal";

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Customer
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Number</th>
                <th className="p-3">ID</th>
                <th className="p-3">Room</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.number}</td>
                  <td className="p-3">{c.id_number}</td>
                  <td className="p-3">{c.room_number}</td>
                  <td className="p-3 capitalize">{c.room_type}</td>
                  <td className="p-3">KSh {c.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

  return (
    <Modal title="Add Customer" onClose={onClose}>
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
          placeholder="ID number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          required
          placeholder="Room number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as RoomType)}
          className="w-full border rounded px-3 py-2"
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
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>
    </Modal>
  );
}
