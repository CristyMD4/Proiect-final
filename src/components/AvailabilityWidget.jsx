import { useState, useEffect, useCallback } from "react";
import { getBookingsForLocationDate, listLocations } from "../lib/storage.js";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function BoxGrid({ total, occupiedSet, label }) {
  const free = total - occupiedSet.size;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <span className={`text-xs font-semibold ${free > 0 ? "text-emerald-600" : "text-rose-500"}`}>
          {free} / {total} libere
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total }, (_, i) => {
          const num = i + 1;
          const occupied = occupiedSet.has(num);
          return (
            <div
              key={num}
              className={[
                "flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-xs font-bold select-none",
                occupied
                  ? "border-rose-200 bg-rose-50 text-rose-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
              ].join(" ")}
            >
              <span className="text-base leading-none">{occupied ? "✕" : "✓"}</span>
              <span className="mt-1">Box {num}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParkingGrid({ total, occupied }) {
  const free = total - occupied;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parcări</span>
        <span className={`text-xs font-semibold ${free > 0 ? "text-emerald-600" : "text-rose-500"}`}>
          {free} / {total} libere
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const isOccupied = i < occupied;
          return (
            <div
              key={i}
              className={[
                "flex h-10 w-12 items-center justify-center rounded-lg border text-[11px] font-bold",
                isOccupied
                  ? "border-rose-200 bg-rose-50 text-rose-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
              ].join(" ")}
            >
              {isOccupied ? "✕" : "P"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityWidget() {
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(() => {
    const locs = listLocations();
    setLocations(locs);

    const date = today();
    const next = {};
    locs.forEach((loc) => {
      const bookings = getBookingsForLocationDate(loc.id, date);
      const occupiedBoxes = new Set(
        bookings.map((b) => Number(b.box)).filter((n) => n > 0)
      );
      // Simulare parcări ocupate bazată pe ora curentă (variază în timp)
      const hour = new Date().getHours();
      const totalParking = loc.features?.parkingSpots || 8;
      const occupiedParking = Math.min(
        Math.floor((Math.sin(hour + loc.id.charCodeAt(loc.id.length - 1)) + 1) * (totalParking / 4)),
        totalParking - 1
      );
      next[loc.id] = { occupiedBoxes, occupiedParking };
    });

    setData(next);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!locations.length) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {locations.map((loc) => {
        const totalBoxes   = loc.features?.selfWashBoxes || 4;
        const totalParking = loc.features?.parkingSpots  || 8;
        const locData = data[loc.id] || {};
        const occupiedBoxes = locData.occupiedBoxes ?? new Set();
        const occupiedParking = locData.occupiedParking ?? 0;

        return (
          <div key={loc.id} className="card p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">{loc.name}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            <BoxGrid
              total={totalBoxes}
              occupiedSet={occupiedBoxes}
              label="Boxuri Self-Wash"
            />

            <ParkingGrid total={totalParking} occupied={occupiedParking} />
          </div>
        );
      })}

      <div className="lg:col-span-3 flex items-center justify-between text-xs text-slate-400">
        <span>
          Actualizat la{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
            : "—"}
        </span>
        <button
          onClick={refresh}
          className="rounded-lg border border-slate-200 px-3 py-1 hover:border-slate-300 hover:bg-slate-50 transition"
        >
          ↻ Reîmprospătează
        </button>
      </div>
    </div>
  );
}
