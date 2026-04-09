import type { Booking } from "../types/app";

type BookingStats = {
  total: number;
  byStatus: Record<string, number>;
  topService: string;
  revenue: number;
};

const PRICE_MAP: Record<string, number> = {
  "Self-Service": 8,
  "Express Wash": 25,
  "Spalare Express": 25,
  Express: 25,
  "Premium Detail": 89,
  "Detail Premium": 89,
  "Interior Only": 35,
  Interior: 35,
};

export function calcStats(bookings: Booking[] = []): BookingStats {
  const total = bookings.length;
  const byStatus = bookings.reduce<Record<string, number>>((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  const byService = bookings.reduce<Record<string, number>>((acc, booking) => {
    const service = booking.service || "Unknown";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  const topService = Object.entries(byService).sort((left, right) => right[1] - left[1])[0]?.[0] || "-";
  const revenue = bookings.reduce((sum, booking) => sum + (PRICE_MAP[booking.service] || 0), 0);

  return { total, byStatus, topService, revenue };
}
