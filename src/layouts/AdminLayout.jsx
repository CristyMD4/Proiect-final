import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminLogout, requireAdmin } from "../lib/adminAuth.js";
import { seedIfEmpty } from "../lib/storage.js";

const NAV_ITEMS = [
  { to: "/admin/employees", label: "Employees", icon: "E" },
  { to: "/admin/schedules", label: "Schedules", icon: "S" },
  { to: "/admin/dashboard", label: "Dashboard", icon: "⬡" },
  { to: "/admin/locations", label: "Locations", icon: "◈" },
  { to: "/admin/bookings", label: "Bookings", icon: "◧" },
  { to: "/admin/messages", label: "Messages", icon: "◫" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "◩" },
];

const ADMIN_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');

.sw-admin-root {
  min-height: 100vh;
  background: #04080f;
  color: #e2e8f0;
  font-family: 'DM Mono', 'Fira Code', ui-monospace, monospace;
  display: flex;
  flex-direction: column;
  position: relative;
}
.sw-admin-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
  z-index: 0;
}
.sw-admin-root::after {
  content: '';
  position: fixed;
  bottom: -200px; left: -200px;
  width: 700px; height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* TOPBAR */
.sw-topbar {
  position: sticky; top: 0; z-index: 50;
  height: 56px;
  background: rgba(4,8,15,0.85);
  border-bottom: 1px solid rgba(34,211,238,0.1);
  backdrop-filter: blur(24px);
  display: flex; align-items: center;
  padding: 0 24px; gap: 14px;
  position: relative; z-index: 10;
}
.sw-logo {
  font-family: 'Syne', sans-serif;
  font-size: 13px; font-weight: 800;
  letter-spacing: 0.12em;
  color: #22d3ee;
  text-transform: uppercase;
}
.sw-logo span { color: #475569; }
.sw-sep { width: 1px; height: 18px; background: rgba(34,211,238,0.15); }
.sw-breadcrumb {
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #334155;
}
.sw-topbar-spacer { flex: 1; }
.sw-top-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px;
  font-family: inherit; font-size: 10px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #64748b;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.07);
  cursor: pointer; text-decoration: none; transition: all 0.15s;
}
.sw-top-btn:hover { color: #94a3b8; border-color: rgba(255,255,255,0.15); }

/* BODY */
.sw-body {
  display: grid;
  grid-template-columns: 210px 1fr;
  flex: 1; min-height: 0; position: relative; z-index: 1;
}
@media (max-width: 768px) {
  .sw-body { grid-template-columns: 1fr; }
  .sw-sidebar { display: none; }
}

/* SIDEBAR */
.sw-sidebar {
  border-right: 1px solid rgba(34,211,238,0.07);
  background: rgba(4,8,15,0.5);
  padding: 20px 12px 24px;
  display: flex; flex-direction: column; gap: 2px;
}
.sw-nav-section {
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: #1e293b; padding: 6px 14px 10px;
}
.sw-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; border-radius: 9px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  color: #334155; text-decoration: none;
  transition: all 0.15s; border: 1px solid transparent;
  position: relative; overflow: hidden;
}
.sw-nav-item:hover { color: #94a3b8; background: rgba(255,255,255,0.03); }
.sw-nav-item.active {
  color: #67e8f9;
  background: rgba(34,211,238,0.07);
  border-color: rgba(34,211,238,0.15);
}
.sw-nav-item.active::before {
  content: '';
  position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 2px; border-radius: 0 2px 2px 0;
  background: #22d3ee;
  box-shadow: 0 0 10px rgba(34,211,238,0.7);
}
.sw-nav-icon { font-size: 13px; line-height: 1; opacity: 0.5; transition: opacity 0.15s; }
.sw-nav-item.active .sw-nav-icon,
.sw-nav-item:hover .sw-nav-icon { opacity: 1; }
.sw-sidebar-spacer { flex: 1; }
.sw-logout {
  all: unset; display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; border-radius: 9px;
  font-family: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  color: #334155; cursor: pointer; transition: all 0.15s;
  width: 100%; box-sizing: border-box;
}
.sw-logout:hover { color: #f87171; background: rgba(248,113,113,0.06); }

/* MAIN */
.sw-main { overflow: auto; padding: 32px; }
@media (max-width: 768px) { .sw-main { padding: 18px; } }

/* SHARED ADMIN COMPONENTS */
.sw-page-h1 {
  font-family: 'Syne', sans-serif;
  font-size: 22px; font-weight: 800;
  color: #f1f5f9; margin: 0 0 6px; letter-spacing: -0.02em;
}
.sw-page-sub { font-size: 12px; color: #334155; margin: 0; }
.sw-page-header { margin-bottom: 28px; }

.sw-card {
  background: rgba(10,18,32,0.7);
  border: 1px solid rgba(34,211,238,0.09);
  border-radius: 14px; backdrop-filter: blur(12px);
}

.sw-input {
  height: 42px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(34,211,238,0.12);
  border-radius: 9px; padding: 0 13px;
  color: #e2e8f0; font-family: inherit; font-size: 12px;
  width: 100%; box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s; outline: none;
}
.sw-input:focus { border-color: rgba(34,211,238,0.35); box-shadow: 0 0 0 3px rgba(34,211,238,0.07); }
.sw-input::placeholder { color: #1e293b; }
.sw-input option { background: #0f172a; color: #e2e8f0; }

.sw-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 0 16px; height: 38px; border-radius: 9px;
  font-family: inherit; font-size: 11px; font-weight: 700;
  letter-spacing: 0.07em; text-transform: uppercase;
  cursor: pointer; transition: all 0.15s; border: none;
  text-decoration: none; white-space: nowrap;
}
.sw-btn-primary {
  background: rgba(34,211,238,0.13); color: #67e8f9;
  border: 1px solid rgba(34,211,238,0.28);
}
.sw-btn-primary:hover {
  background: rgba(34,211,238,0.22); border-color: rgba(34,211,238,0.55);
  box-shadow: 0 0 20px rgba(34,211,238,0.12);
}
.sw-btn-ghost {
  background: transparent; color: #475569;
  border: 1px solid rgba(255,255,255,0.07);
}
.sw-btn-ghost:hover { color: #94a3b8; background: rgba(255,255,255,0.04); }
.sw-btn-danger {
  background: rgba(248,113,113,0.07); color: #fca5a5;
  border: 1px solid rgba(248,113,113,0.18);
}
.sw-btn-danger:hover { background: rgba(248,113,113,0.14); }
.sw-btn-success {
  background: rgba(52,211,153,0.09); color: #6ee7b7;
  border: 1px solid rgba(52,211,153,0.22);
}
.sw-btn-success:hover { background: rgba(52,211,153,0.16); }

.sw-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.sw-table th {
  padding: 11px 16px; text-align: left;
  font-size: 8px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: #1e293b; border-bottom: 1px solid rgba(34,211,238,0.07);
}
.sw-table td {
  padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
  color: #64748b; vertical-align: top;
}
.sw-table tr:last-child td { border-bottom: none; }
.sw-table tr:hover td { background: rgba(34,211,238,0.018); }
.sw-table td strong { color: #94a3b8; font-weight: 600; }

.sw-badge {
  display: inline-flex; align-items: center;
  padding: 2px 9px; border-radius: 99px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
}
.sw-badge-new { background: rgba(251,191,36,0.08); color: #fbbf24; border: 1px solid rgba(251,191,36,0.18); }
.sw-badge-pending { background: rgba(167,139,250,0.08); color: #c4b5fd; border: 1px solid rgba(167,139,250,0.18); }
.sw-badge-confirmed { background: rgba(52,211,153,0.08); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }
.sw-badge-completed { background: rgba(34,211,238,0.08); color: #67e8f9; border: 1px solid rgba(34,211,238,0.2); }
.sw-badge-canceled, .sw-badge-cancelled { background: rgba(248,113,113,0.08); color: #f87171; border: 1px solid rgba(248,113,113,0.18); }
.sw-badge-approved { background: rgba(52,211,153,0.08); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }

.sw-stat-grid { display: grid; gap: 14px; }
.sw-stat-grid-2 { grid-template-columns: repeat(2,1fr); }
.sw-stat-grid-4 { grid-template-columns: repeat(4,1fr); }
@media(max-width:900px){ .sw-stat-grid-4{grid-template-columns:repeat(2,1fr);} }
@media(max-width:500px){ .sw-stat-grid-4,.sw-stat-grid-2{grid-template-columns:1fr;} }

.sw-stat-card {
  background: rgba(10,18,32,0.7); border: 1px solid rgba(34,211,238,0.09);
  border-radius: 12px; padding: 18px 20px;
}
.sw-stat-label { font-size: 8px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #1e293b; margin-bottom: 10px; }
.sw-stat-value { font-size: 28px; font-weight: 700; color: #67e8f9; line-height: 1; font-family: 'Syne', sans-serif; }
.sw-stat-sub { font-size: 11px; color: #334155; margin-top: 4px; }

.sw-divider { height: 1px; background: rgba(34,211,238,0.07); margin: 22px 0; }
.sw-section-title { font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #334155; margin-bottom: 14px; }

.sw-modal-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(4,8,15,0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.sw-modal {
  width: 100%; max-width: 520px;
  background: rgba(10,18,32,0.96);
  border: 1px solid rgba(34,211,238,0.15);
  border-radius: 18px; padding: 28px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
}
.sw-modal-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#f1f5f9; margin:0 0 20px; }
.sw-form-grid { display: grid; gap: 12px; }
.sw-form-label { display:block; font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#334155; margin-bottom:6px; }
.sw-textarea {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(34,211,238,0.12);
  border-radius: 9px; padding: 10px 13px;
  color: #e2e8f0; font-family: inherit; font-size:12px;
  width:100%; box-sizing:border-box; resize:vertical; min-height:100px;
  outline:none; transition: border-color 0.15s;
}
.sw-textarea:focus { border-color: rgba(34,211,238,0.35); }
.sw-checkbox-row { display:flex; align-items:center; gap:10px; font-size:11px; color:#475569; cursor:pointer; }
`;

export default function AdminLayout() {
  const nav = useNavigate();
  const loc = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!requireAdmin()) nav("/admin/login", { replace: true });
    seedIfEmpty();
  }, [nav]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [loc.pathname, loc.search]);

  const pageLabel =
    NAV_ITEMS.find((n) => loc.pathname.startsWith(n.to))?.label || "Admin";

  return (
    <div className="sw-admin-root">
      <style>{ADMIN_STYLES}</style>

      {/* Topbar */}
      <header className="sw-topbar">
        <span className="sw-logo">Sparkle<span>Wash</span></span>
        <div className="sw-sep" />
        <span className="sw-breadcrumb">{pageLabel}</span>
        <div className="sw-topbar-spacer" />
        <Link className="sw-top-btn" to="/">← View Site</Link>
      </header>

      <div className="sw-body">
        <aside className="sw-sidebar">
          <div className="sw-nav-section">Navigation</div>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => "sw-nav-item" + (isActive ? " active" : "")}
            >
              <span className="sw-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
          <div className="sw-sidebar-spacer" />
          <div className="sw-nav-section">Account</div>
          <button
            className="sw-logout"
            onClick={() => { adminLogout(); nav("/admin/login", { replace: true }); }}
          >
            <span className="sw-nav-icon">⊘</span>
            Logout
          </button>
        </aside>

        <main className="sw-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
