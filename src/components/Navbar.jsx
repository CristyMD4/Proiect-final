import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch.jsx";
import { Icon } from "./Icons.jsx";
import { getClientSession } from "../lib/clientAuth.js";
import { getEmployeeSession } from "../lib/employeeAuth.js";
import { getAdminSession } from "../lib/adminAuth.js";
import { useCart } from "../context/CartContext.jsx";

const NAV_LINKS = [
  { to: "/", label: "nav.home" },
  { to: "/services", label: "nav.services" },
  { to: "/pricing", label: "nav.pricing" },
  { to: "/gallery", label: "nav.gallery" },
  { to: "/contact", label: "nav.contact" },
  { to: "/shop", label: "nav.shop", fallback: "Shop" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const clientSession = getClientSession();
  const employeeSession = getEmployeeSession();
  const adminSession = getAdminSession();
  const { cartCount } = useCart();

  const accountTarget = adminSession
    ? "/admin/dashboard"
    : employeeSession
    ? "/employee/dashboard"
    : clientSession
    ? "/account"
    : "/login";

  const accountLabel = adminSession
    ? "Admin"
    : employeeSession
    ? "Employee"
    : clientSession
    ? "My Account"
    : "Sign In";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="container-page flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold text-[var(--sw-blue)] tracking-tight" onClick={() => setOpen(false)}>
            SparkleWash
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, fallback }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  "px-3 py-2 text-sm font-semibold rounded-lg transition " +
                  (isActive ? "text-[var(--sw-blue)] bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50")
                }
              >
                {t(label, { defaultValue: fallback || label })}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitch />

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 transition"
              onClick={() => setOpen(false)}
            >
              <Icon name="cart" className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--sw-blue)] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account — desktop only */}
            <Link to={accountTarget} className="hidden sm:inline-flex btn btn-outline h-10 px-4 text-sm">
              {accountLabel}
            </Link>

            {/* Book — desktop only */}
            <Link to="/book" className="hidden sm:inline-flex btn btn-primary h-10 px-5 text-sm">
              {t("common.bookNow")}
            </Link>

            {/* Burger — mobile only */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-white border-t border-slate-100 overflow-y-auto">
          <div className="container-page py-6 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, fallback }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "flex items-center px-4 py-3 rounded-xl text-base font-semibold transition " +
                  (isActive ? "bg-blue-50 text-[var(--sw-blue)]" : "text-slate-700 hover:bg-slate-50")
                }
              >
                {t(label, { defaultValue: fallback || label })}
              </NavLink>
            ))}

            <div className="mt-4 border-t border-slate-100 pt-4 grid gap-3">
              <Link
                to={accountTarget}
                onClick={() => setOpen(false)}
                className="btn btn-outline w-full justify-center"
              >
                {accountLabel}
              </Link>
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full justify-center"
              >
                {t("common.bookNow")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
