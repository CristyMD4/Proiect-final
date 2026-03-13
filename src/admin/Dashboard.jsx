import React, { useEffect, useMemo, useState } from "react";
import { listBookings, listLocations, listMessages, listTestimonials } from "../lib/storage.js";
import { getAdminLocation, setAdminLocation, subscribeAdminLocation } from "../lib/adminLocation.js";

function StatCard({ label, value, sub, accent = "#22d3ee" }) {
  return (
    <div className="sw-stat-card" style={{ borderColor: `${accent}18` }}>
      <div className="sw-stat-label">{label}</div>
      <div className="sw-stat-value" style={{ color: accent }}>{value}</div>
      {sub && <div className="sw-stat-sub">{sub}</div>}
    </div>
  );
}

function MiniBar({ label, value, max, color = "#22d3ee" }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "#475569" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 4,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          boxShadow: `0 0 8px ${color}44`,
          transition: "width 0.6s ease"
        }} />
      </div>
    </div>
  );
}

function ActivityItem({ label, time, type }) {
  const colors = {
    booking: "#22d3ee",
    message: "#a78bfa",
    testimonial: "#34d399",
  };
  const c = colors[type] || "#475569";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)"
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%", background: c,
        marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px ${c}`
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{label}</div>
        <div style={{ fontSize: 10, color: "#1e293b", marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );
}

function LocationCard({ loc, stats, active, onSelect }) {
  const f = loc.features || {};
  const features = [
    f.selfWashBoxes && `${f.selfWashBoxes} self-wash`,
    f.carWashLanes && `${f.carWashLanes} lanes`,
    f.hasStore && "store",
  ].filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onSelect(loc.id)}
      style={{
        all: "unset", display: "block", width: "100%", boxSizing: "border-box",
        background: active ? "rgba(34,211,238,0.06)" : "rgba(10,18,32,0.7)",
        border: `1px solid ${active ? "rgba(34,211,238,0.28)" : "rgba(34,211,238,0.09)"}`,
        borderRadius: 12, padding: "16px 18px",
        cursor: "pointer", transition: "all 0.18s",
        textAlign: "left"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#67e8f9" : "#64748b" }}>
          {loc.name}
        </div>
        {active && (
          <div style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.15em",
            color: "#22d3ee", background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.2)", borderRadius: 99, padding: "2px 8px"
          }}>ACTIVE</div>
        )}
      </div>
      <div style={{ fontSize: 10, color: "#334155", marginTop: 5 }}>{features.join(" · ") || "—"}</div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 8, color: "#1e293b", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>Bookings</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#67e8f9", fontFamily: "'Syne', sans-serif" }}>{stats?.total || 0}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, color: "#1e293b", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>Revenue</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399", fontFamily: "'Syne', sans-serif" }}>
            ${((stats?.revenue) || 0).toFixed(0)}
          </div>
        </div>
      </div>
    </button>
  );
}

function calcStats(bookings) {
  const byStatus = {};
  let revenue = 0;
  const svcCount = {};
  for (const b of bookings) {
    const s = b.status || "new";
    byStatus[s] = (byStatus[s] || 0) + 1;
    if (s === "completed") revenue += 35; // demo estimate
    const svc = b.service || "Unknown";
    svcCount[svc] = (svcCount[svc] || 0) + 1;
  }
  const topService = Object.entries(svcCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  return { total: bookings.length, byStatus, revenue, topService, svcCount };
}

function relTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 2) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminDashboard() {
  const [selected, setSelected] = useState(() => getAdminLocation());
  useEffect(() => subscribeAdminLocation(setSelected), []);

  const locations = useMemo(() => listLocations(), []);
  const allBookings = useMemo(() => listBookings(), []);
  const messages = useMemo(() => listMessages(), []);
  const testimonials = useMemo(() => listTestimonials(), []);

  const filteredBookings = useMemo(() =>
    selected === "all" ? allBookings : allBookings.filter(b => (b.locationId || "loc_1") === selected),
    [allBookings, selected]
  );

  const stats = useMemo(() => calcStats(filteredBookings), [filteredBookings]);
  const byLocStats = useMemo(() => {
    const res = {};
    for (const l of locations) {
      res[l.id] = calcStats(allBookings.filter(b => (b.locationId || "loc_1") === l.id));
    }
    return res;
  }, [allBookings, locations]);

  const unread = useMemo(() => messages.filter(m => !m.read).length, [messages]);
  const pendingTestimonials = useMemo(() => testimonials.filter(t => t.status === "pending" || !t.approved).length, [testimonials]);

  // Build activity feed
  const activity = useMemo(() => {
    const items = [
      ...filteredBookings.slice(0, 5).map(b => ({
        label: `Booking from ${b.fullName || b.name || "—"} · ${b.service || "—"}`,
        time: relTime(b.at || Date.now()),
        ts: b.at || 0, type: "booking"
      })),
      ...messages.slice(0, 3).map(m => ({
        label: `Message from ${m.name || "—"}: "${(m.message || "").slice(0, 40)}…"`,
        time: relTime(m.at || Date.now()),
        ts: m.at || 0, type: "message"
      })),
    ];
    return items.sort((a, b) => b.ts - a.ts).slice(0, 8);
  }, [filteredBookings, messages]);

  const maxSvc = Math.max(...Object.values(stats.svcCount || {}), 1);

  function select(id) {
    const v = id || "all";
    setAdminLocation(v);
    setSelected(v);
  }

  return (
    <div>
      {/* Header */}
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Dashboard</h1>
        <p className="sw-page-sub">
          {selected === "all"
            ? "Showing metrics across all locations"
            : `Showing metrics for ${locations.find(l => l.id === selected)?.name || selected}`}
        </p>
      </div>

      {/* Location pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {[{ id: "all", name: "All Locations" }, ...locations].map(l => (
          <button
            key={l.id}
            type="button"
            onClick={() => select(l.id)}
            style={{
              all: "unset", cursor: "pointer",
              padding: "5px 14px", borderRadius: 99,
              fontSize: 11, fontWeight: 600, fontFamily: "inherit",
              transition: "all 0.15s",
              background: selected === l.id ? "rgba(34,211,238,0.12)" : "transparent",
              color: selected === l.id ? "#67e8f9" : "#334155",
              border: `1px solid ${selected === l.id ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* KPI Stats */}
      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total Bookings" value={stats.total} sub={`${stats.byStatus.new || 0} new`} />
        <StatCard label="Revenue (est.)" value={`$${stats.revenue.toFixed(0)}`} sub="from completed" accent="#34d399" />
        <StatCard label="Unread Messages" value={unread} sub={`${messages.length} total`} accent="#a78bfa" />
        <StatCard label="Pending Reviews" value={pendingTestimonials} sub="testimonials" accent="#f59e0b" />
      </div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>

        {/* Services breakdown */}
        <div className="sw-card" style={{ padding: 22 }}>
          <div className="sw-section-title">Service Breakdown</div>
          {Object.entries(stats.svcCount || {}).length > 0 ? (
            Object.entries(stats.svcCount)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([svc, cnt]) => (
                <MiniBar key={svc} label={svc} value={cnt} max={maxSvc} />
              ))
          ) : (
            <div style={{ fontSize: 12, color: "#1e293b" }}>No bookings yet.</div>
          )}

          <div className="sw-divider" style={{ margin: "18px 0" }} />
          <div className="sw-section-title">Status Overview</div>
          {Object.entries(stats.byStatus).map(([s, cnt]) => (
            <MiniBar
              key={s} label={s} value={cnt} max={stats.total}
              color={s === "confirmed" ? "#34d399" : s === "canceled" || s === "cancelled" ? "#f87171" : s === "completed" ? "#22d3ee" : "#a78bfa"}
            />
          ))}
          {Object.keys(stats.byStatus).length === 0 && (
            <div style={{ fontSize: 12, color: "#1e293b" }}>No data.</div>
          )}
        </div>

        {/* Activity feed */}
        <div className="sw-card" style={{ padding: 22 }}>
          <div className="sw-section-title">Recent Activity</div>
          {activity.length > 0 ? (
            activity.map((a, i) => <ActivityItem key={i} {...a} />)
          ) : (
            <div style={{ fontSize: 12, color: "#1e293b" }}>No recent activity.</div>
          )}
        </div>
      </div>

      {/* Locations row */}
      <div className="sw-section-title" style={{ marginTop: 8 }}>Location Overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {locations.map(l => (
          <LocationCard
            key={l.id} loc={l}
            stats={byLocStats[l.id]}
            active={selected === l.id}
            onSelect={select}
          />
        ))}
      </div>
    </div>
  );
}
