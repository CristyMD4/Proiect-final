export function calcStats(bookings = []) {
  const total = bookings.length;
  const byStatus = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const byService = bookings.reduce((acc, b) => {
    const s = b.service || "Unknown";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const topService = Object.entries(byService).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // simple revenue estimate (edit prices to match your app)
  const priceMap = {
    "Self-Service": 8,
    "Express Wash": 25, "Spălare Express": 25, "Express": 25,
    "Premium Detail": 89, "Detail Premium": 89, "Детейлинг": 89,
    "Interior Only": 35, "Interior": 35, "Интерьер": 35,
  };
  const revenue = bookings.reduce((sum, b) => sum + (priceMap[b.service] || 0), 0);

  return { total, byStatus, topService, revenue };
}
