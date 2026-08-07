"use client";
import { useEffect, useState } from "react";
import {
  Room,
  RoomType,
  bookRoom,
  checkoutRoom,
  createRoom,
  getRooms,
} from "@/lib/api";
import Modal from "@/components/Modal";
import { Plus, DoorOpen, DoorClosed } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    try {
      setRooms(await getRooms());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-500">
            Manage room inventory and occupancy.
          </p>
        </div>
        <button
          onClick={() => setShowAddRoom(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading rooms...</p>}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className="text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition min-w-0"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-bold text-gray-900">Room {room.room_number}</p>
              <div
                className={`p-1.5 rounded-xl flex-shrink-0 ${room.is_available ? "bg-emerald-50" : "bg-red-50"}`}
              >
                {room.is_available ? (
                  <DoorOpen size={14} className="text-emerald-500" />
                ) : (
                  <DoorClosed size={14} className="text-red-500" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 capitalize">{room.room_type}</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              KSh {room.price}
            </p>
            <span
              className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-lg font-medium ${room.is_available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
            >
              {room.is_available ? "Available" : "Occupied"}
            </span>
          </button>
        ))}
        {!loading && rooms.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-sm text-gray-400">
              No rooms yet. Add your first room to get started.
            </p>
          </div>
        )}
      </div>

      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onChanged={loadRooms}
        />
      )}
      {showAddRoom && (
        <AddRoomModal
          onClose={() => setShowAddRoom(false)}
          onCreated={loadRooms}
        />
      )}
    </div>
  );
}

function RoomDetailModal({
  room,
  onClose,
  onChanged,
}: {
  room: Room;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [clientId, setClientId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await bookRoom(room.id, {
        client_name: clientName,
        client_number: clientNumber,
        client_id: clientId,
        check_in: checkIn || new Date().toISOString(),
        check_out: checkOut || undefined,
      });
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book room");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await checkoutRoom(room.id);
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check out");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Room ${room.room_number}`} onClose={onClose}>
      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mb-4 space-y-1">
        <p>
          Type:{" "}
          <span className="capitalize text-gray-900 font-medium">
            {room.room_type}
          </span>
        </p>
        <p>
          Price:{" "}
          <span className="text-gray-900 font-medium">KSh {room.price}</span>
        </p>
        <p>
          Status:{" "}
          <span
            className={`font-medium ${room.is_available ? "text-emerald-600" : "text-red-500"}`}
          >
            {room.is_available ? "Available" : "Occupied"}
          </span>
        </p>
        {room.active_booking && (
          <>
            <p>
              Guest:{" "}
              <span className="text-gray-900 font-medium">
                {room.active_booking.client_name}
              </span>
            </p>
            <p>
              Check-in:{" "}
              {new Date(room.active_booking.check_in).toLocaleString()}
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}
      {room.is_available ? (
        <form onSubmit={handleBook} className="space-y-3">
          <input
            required
            placeholder="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            required
            placeholder="Client number"
            value={clientNumber}
            onChange={(e) => setClientNumber(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            required
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Check-in
          </label>
          <input
            type="datetime-local"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Check-out (optional)
          </label>
          <input
            type="datetime-local"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            {submitting ? "Booking..." : "Book Room"}
          </button>
        </form>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          {submitting ? "Checking out..." : "Check Out"}
        </button>
      )}
    </Modal>
  );
}

function AddRoomModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
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
      await createRoom({ room_number: roomNumber, room_type: roomType, price });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add Room" onClose={onClose}>
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Room number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as RoomType)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          {submitting ? "Adding..." : "Add Room"}
        </button>
      </form>
    </Modal>
  );
}
