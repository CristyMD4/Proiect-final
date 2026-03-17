import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch.jsx";
import { Icon } from "./Icons.jsx";
import { getClientSession } from "../lib/clientAuth.js";
import { getEmployeeSession } from "../lib/employeeAuth.js";
import { getAdminSession } from "../lib/adminAuth.js";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "px-3 py-2 text-sm font-semibold transition " +
      (isActive ? "text-[var(--sw-blue)]" : "text-slate-600 hover:text-slate-900")
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { t } = useTranslation();
  const clientSession = getClientSession();
  const employeeSession = getEmployeeSession();
  const adminSession = getAdminSession();
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="container-page flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-extrabold text-[var(--sw-blue)] tracking-tight">
          SparkleWash
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavItem to="/">{t("nav.home")}</NavItem>
          <NavItem to="/services">{t("nav.services")}</NavItem>
          <NavItem to="/pricing">{t("nav.pricing")}</NavItem>
          <NavItem to="/gallery">{t("nav.gallery")}</NavItem>
          <NavItem to="/contact">{t("nav.contact")}</NavItem>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch className="ml-4"/>

          <div className="hidden sm:flex items-center gap-2 text-slate-700">
            <Icon name="phone" className="w-4 h-4" />
            <span className="text-sm font-semibold">(555) 123-4567</span>
          </div>

          <Link to={accountTarget} className="hidden sm:inline-flex btn btn-outline h-11 px-5">
            {accountLabel}
          </Link>

          <Link to="/book" className="btn btn-primary h-11 px-6">
            {t("common.bookNow")}
          </Link>
        </div>
      </div>
    </header>
  );
}
