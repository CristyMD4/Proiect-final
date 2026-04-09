import type { BookingDraft } from "../types/app";
import { apiFetch } from "./apiClient";
import { getClientSession } from "./clientAuth";
import { addBooking, listBookings, updateBooking } from "./storage";

type BookingQuery = {
  email?: string;
};

function toQueryString(query: BookingQuery = {}) {
  const params = new URLSearchParams();
  if (query.email) params.set("email", query.email);
  const value = params.toString();
  return value ? `?${value}` : "";
}

function localBookings(query: BookingQuery = {}) {
  const items = listBookings();
  if (!query.email) return items;
  return items.filter((booking) => (booking.email || "").toLowerCase() === query.email?.toLowerCase());
}

export async function getBookings(query: BookingQuery = {}) {
  try {
    return await apiFetch(`/api/Bookings${toQueryString(query)}`);
  } catch {
    return localBookings(query);
  }
}

export async function getMyBookings() {
  const session = getClientSession();
  return getBookings({ email: session?.email || undefined });
}

export async function createBooking(payload: BookingDraft) {
  try {
    return await apiFetch("/api/Bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return addBooking(payload);
  }
}

export async function cancelBooking(id: string) {
  try {
    return await apiFetch(`/api/Bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "canceled" }),
    });
  } catch {
    updateBooking(id, { status: "canceled" });
    const items = listBookings();
    return items.find((booking) => booking.id === id) || null;
  }
}
