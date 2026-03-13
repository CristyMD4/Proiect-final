import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteBooking, listBookings, listLocations, updateBooking } from "../lib/storage.js";
import { getAdminLocation, setAdminLocation } from "../lib/adminLocation.js";

function StatusBadge({ status }) {
  const s = (status || "new").toLowerCase();
  const cls = `sw-badge sw-badge-${s}`;
  return <span className={cls}>{status || "new"}</span>;
}

export default function AdminBookings() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [locationId, setLocationId] = useState(() => getAdminLocation());
  const [rows, setRows] = useState(() => listBookings());
  const [selectedDate, setSelectedDate] = useState("");
  const locations = useMemo(() => listLocations(), []);
  const locName = useMemo(() => {
    const m = new Map(locations.map(l => [l.id, l.name]));
    return id => m.get(id) || id || "—";
  }, [locations]);

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return rows
      .filter(b => locationId === "all" || (b.locationId || "loc_1") === locationId)
      .filter(b => status === "all" || (b.status || "new") === status)
      .filter(b => !selectedDate || (b.date || "").slice(0, 10) === selectedDate)
      .filter(b => {
        if (!qn) return true;
        return `${b.fullName || b.name || ""} ${b.email || ""} ${b.phone || ""} ${b.id || ""} ${locName(b.locationId)}`.toLowerCase().includes(qn);
      });
  }, [q, status, selectedDate, rows, locationId, locName]);

  function refresh() { setRows(listBookings()); }
  function mutate(id, patch) { updateBooking(id, patch); refresh(); }
  function remove(id) { if (!confirm("Delete this booking?")) return; deleteBooking(id); refresh(); }

  const counts = useMemo(() => {
    const c = {};
    rows.forEach(b => { const s = b.status || "new"; c[s] = (c[s] || 0) + 1; });
    return c;
  }, [rows]);

  return (
    <div>
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="sw-page-h1">Bookings</h1>
          <p className="sw-page-sub">{filtered.length} of {rows.length} bookings</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(counts).map(([s, n]) => (
            <span key={s} className={`sw-badge sw-badge-${s}`}>{n} {s}</span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px 200px", gap: 10, marginBottom: 20 }}>
        <input
          className="sw-input"
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search name, email, phone…"
        />
        <select className="sw-input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="new">new</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="completed">completed</option>
          <option value="canceled">canceled</option>
        </select>
        <input className="sw-input" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <select
          className="sw-input"
          value={locationId}
          onChange={e => { setLocationId(e.target.value); setAdminLocation(e.target.value); }}
        >
          <option value="all">All locations</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="sw-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="sw-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Service</th>
                <th>Date / Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.fullName || b.name || "—"}</strong>
                    <div style={{ fontSize: 11, marginTop: 2 }}>{b.email || "—"}</div>
                    <div style={{ fontSize: 11 }}>{b.phone || "—"}</div>
                    <div style={{ fontSize: 9, color: "#1e293b", marginTop: 4 }}>{b.id}</div>
                  </td>
                  <td><span style={{ color: "#64748b" }}>{locName(b.locationId || "loc_1")}</span></td>
                  <td>
                    <strong>{b.service || "—"}</strong>
                    <div style={{ fontSize: 11 }}>{b.vehicle || "—"}</div>
                  </td>
                  <td>
                    <strong>{b.date || "—"}</strong>
                    <div style={{ fontSize: 11 }}>{b.time || "—"}</div>
                    {b.notes && <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>Note: {b.notes}</div>}
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <button className="sw-btn sw-btn-success" onClick={() => mutate(b.id, { status: "confirmed" })}>Confirm</button>
                      <button className="sw-btn sw-btn-primary" onClick={() => mutate(b.id, { status: "completed" })}>Complete</button>
                      <button className="sw-btn sw-btn-ghost" onClick={() => mutate(b.id, { status: "canceled" })}>Cancel</button>
                      <button className="sw-btn sw-btn-danger" onClick={() => remove(b.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#1e293b" }}>
                    No bookings match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
