"use client";
import { useEffect, useState } from "react";
import { Payment, createPayment, getPayments } from "@/lib/api";
import Modal from "@/components/Modal";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    setPayments(await getPayments());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Record Payment
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Room</th>
                <th className="p-3">Type</th>
                <th className="p-3">Client</th>
                <th className="p-3">Price</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Check-out</th>
                <th className="p-3">Paid at</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.room_number}</td>
                  <td className="p-3 capitalize">{p.room_type}</td>
                  <td className="p-3">{p.client_name}</td>
                  <td className="p-3">KSh {p.price}</td>
                  <td className="p-3">KSh {p.amount_paid}</td>
                  <td className="p-3">
                    {new Date(p.check_in).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {p.check_out ? new Date(p.check_out).toLocaleString() : "-"}
                  </td>
                  <td className="p-3">
                    {new Date(p.paid_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <AddPaymentModal onClose={() => setShowAdd(false)} onCreated={load} />
      )}
    </div>
  );
}

function AddPaymentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [bookingId, setBookingId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createPayment({
        booking: Number(bookingId),
        amount_paid: amountPaid,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Record Payment" onClose={onClose}>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="number"
          placeholder="Booking ID (from Rooms tab)"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          required
          type="number"
          placeholder="Amount paid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Record Payment"}
        </button>
      </form>
    </Modal>
  );
}
