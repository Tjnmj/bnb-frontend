"use client";
import { useEffect, useState } from "react";
import { Payment, createPayment, getPayments } from "@/lib/api";
import Modal from "@/components/Modal";
import { Plus, Receipt } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">
            Every payment recorded against a booking.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Room
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Paid
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Check-in
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Check-out
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Paid at
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-3 font-medium text-gray-900">
                      {p.room_number}
                    </td>
                    <td className="p-3 capitalize text-gray-600">
                      {p.room_type}
                    </td>
                    <td className="p-3 text-gray-600">{p.client_name}</td>
                    <td className="p-3 text-gray-600">KSh {p.price}</td>
                    <td className="p-3 font-semibold text-emerald-600">
                      KSh {p.amount_paid}
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(p.check_in).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {p.check_out
                        ? new Date(p.check_out).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(p.paid_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length === 0 && (
            <div className="text-center py-10">
              <Receipt size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No payments recorded yet</p>
            </div>
          )}
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
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="number"
          placeholder="Booking ID (from Rooms tab)"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
          required
          type="number"
          placeholder="Amount paid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          {submitting ? "Saving..." : "Record Payment"}
        </button>
      </form>
    </Modal>
  );
}
