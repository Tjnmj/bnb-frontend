export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export type RoomType = "bedsitter" | "single" | "double" | "suite" | "deluxe";

export interface Booking {
  id: number;
  room: number;
  client_name: string;
  client_number: string;
  client_id: string;
  price: string;
  room_type: RoomType;
  check_in: string;
  check_out: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Room {
  id: number;
  room_number: string;
  room_type: RoomType;
  price: string;
  is_available: boolean;
  created_at: string;
  active_booking: Booking | null;
}

export interface Payment {
  id: number;
  booking: number;
  room_number: string;
  room_type: RoomType;
  price: string;
  client_name: string;
  amount_paid: string;
  check_in: string;
  check_out: string | null;
  paid_at: string;
}

export interface StaffUser {
  id: number;
  name: string;
  number: string;
  shift_time: string;
  duty_status: "on_duty" | "off_duty";
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  number: string;
  id_number: string;
  room_number: string;
  room_type: RoomType;
  price: string;
  created_at: string;
}

export interface ReportSummary {
  period: string;
  total_sales: number;
  total_bookings: number;
  payments: {
    id: number;
    room_number: string;
    room_type: string;
    client_name: string;
    amount_paid: string;
    paid_at: string;
  }[];
  [key: string]: unknown;
}

export interface SalesOverview {
  today_sales: number;
  today_transactions: number;
  all_time_sales: number;
  all_time_transactions: number;
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
}

export const getRooms = () => request<Room[]>("/rooms/");
export const createRoom = (data: {
  room_number: string;
  room_type: RoomType;
  price: string;
}) => request<Room>("/rooms/", { method: "POST", body: JSON.stringify(data) });
export const bookRoom = (
  roomId: number,
  data: {
    client_name: string;
    client_number: string;
    client_id: string;
    check_in: string;
    check_out?: string;
  },
) =>
  request<Booking>(`/rooms/${roomId}/book/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
export const checkoutRoom = (roomId: number) =>
  request<Booking>(`/rooms/${roomId}/checkout/`, { method: "POST" });

export const getPayments = () => request<Payment[]>("/payments/");
export const createPayment = (data: { booking: number; amount_paid: string }) =>
  request<Payment>("/payments/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getStaffUsers = () => request<StaffUser[]>("/users/");
export const createStaffUser = (data: {
  name: string;
  number: string;
  shift_time: string;
  duty_status: "on_duty" | "off_duty";
}) =>
  request<StaffUser>("/users/", { method: "POST", body: JSON.stringify(data) });

export const getCustomers = () => request<Customer[]>("/customers/");
export const createCustomer = (data: {
  name: string;
  number: string;
  id_number: string;
  room_number: string;
  room_type: RoomType;
  price: string;
}) =>
  request<Customer>("/customers/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getDailyReport = (date?: string) =>
  request<ReportSummary>(`/reports/daily/${date ? `?date=${date}` : ""}`);
export const getWeeklyReport = (date?: string) =>
  request<ReportSummary>(`/reports/weekly/${date ? `?date=${date}` : ""}`);
export const getMonthlyReport = (year?: number, month?: number) =>
  request<ReportSummary>(
    `/reports/monthly/${year && month ? `?year=${year}&month=${month}` : ""}`,
  );
export const getCustomReport = (start: string, end: string) =>
  request<ReportSummary>(`/reports/custom/?start=${start}&end=${end}`);

export const getSalesOverview = () =>
  request<SalesOverview>("/sales/overview/");
