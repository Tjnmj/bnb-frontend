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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button
          onClick={() => setShowAddRoom(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Room
        </button>
      </div>

      {loading && <p>Loading rooms...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`text-left rounded-lg p-4 shadow border ${room.is_available ? "bg-white border-gray-200" : "bg-red-50 border-red-200"} hover:shadow-md transition-shadow`}
          >
            <p className="font-semibold text-lg">Room {room.room_number}</p>
            <p className="text-sm text-gray-500 capitalize">{room.room_type}</p>
            <p className="text-sm mt-1">KSh {room.price}</p>
            <span
              className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${room.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {room.is_available ? "Available" : "Occupied"}
            </span>
          </button>
        ))}
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
      <div className="text-sm text-gray-600 mb-4 space-y-1">
        <p>
          Type: <span className="capitalize">{room.room_type}</span>
        </p>
        <p>Price: KSh {room.price}</p>
        <p>Status: {room.is_available ? "Available" : "Occupied"}</p>
        {room.active_booking && (
          <>
            <p>Guest: {room.active_booking.client_name}</p>
            <p>
              Check-in:{" "}
              {new Date(room.active_booking.check_in).toLocaleString()}
            </p>
          </>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {room.is_available ? (
        <form onSubmit={handleBook} className="space-y-3">
          <input
            required
            placeholder="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            required
            placeholder="Client number"
            value={clientNumber}
            onChange={(e) => setClientNumber(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            required
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <label className="block text-sm text-gray-600">Check-in</label>
          <input
            type="datetime-local"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <label className="block text-sm text-gray-600">
            Check-out (optional)
          </label>
          <input
            type="datetime-local"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Book Room"}
          </button>
        </form>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
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
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
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
          {submitting ? "Adding..." : "Add Room"}
        </button>
      </form>
    </Modal>
  );
}
