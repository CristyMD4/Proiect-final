import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginClient, getClientSession } from "../lib/clientAuth.js";
import { adminLogin, getAdminSession } from "../lib/adminAuth.js";
import { getEmployeeSession, loginEmployee } from "../lib/employeeAuth.js";

const ROLE_OPTIONS = [
  {
    key: "customer",
    eyebrow: "Customer Access",
    title: "Book and manage wash appointments",
    description: "Use your customer account to save bookings and stay in sync with your next visit.",
    demo: null,
    registerAllowed: true,
    action: "/",
  },
  {
    key: "employee",
    eyebrow: "Employee Access",
    title: "Open the staff workspace",
    description: "Track bays, bookings, and customer follow-up from the employee dashboard.",
    demo: { email: "employee@sparklewash.com", password: "employee123" },
    registerAllowed: true,
    action: "/employee/dashboard",
  },
  {
    key: "admin",
    eyebrow: "Admin Console",
    title: "Secure operational control",
    description: "Manage locations, testimonials, bookings, and messages from the admin area.",
    demo: { email: "admin@sparklewash.com", password: "admin123" },
    registerAllowed: false,
    action: "/admin/dashboard",
  },
];

function getRoleConfig(role) {
  return ROLE_OPTIONS.find((option) => option.key === role) || ROLE_OPTIONS[0];
}

function getSessionForRole(role) {
  if (role === "admin") return getAdminSession();
  if (role === "employee") return getEmployeeSession();
  return getClientSession();
}

function loginByRole(role, credentials) {
  if (role === "admin") return adminLogin(credentials.email, credentials.password);
  if (role === "employee") return loginEmployee(credentials);
  return loginClient(credentials);
}

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "customer";

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfig = useMemo(() => getRoleConfig(role), [role]);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    const session = getSessionForRole(role);
    if (session) {
      nav(roleConfig.action, { replace: true });
    }
  }, [nav, role, roleConfig]);

  const updateRole = (nextRole) => {
    setRole(nextRole);
    setErr("");
    setEmail("");
    setPassword("");
    setSearchParams({ role: nextRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const result = loginByRole(role, { email, password });

    setLoading(false);

    if (!result.ok) {
      setErr(t(result.error, { defaultValue: result.error }));
      return;
    }

    nav(roleConfig.action, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -top-24 left-[-120px] h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="max-w-xl">
            <div className="inline-flex rounded-full border border-sky-300/15 bg-slate-950/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
              Unified Access
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
              One login flow for customers, employees, and admins.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Choose your role, sign in with the right account, and we will send you to the matching workspace.
            </p>

            <div className="mt-8 grid gap-4">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => updateRole(option.key)}
                  className={
                    "rounded-[24px] border p-5 text-left transition " +
                    (role === option.key
                      ? "border-sky-300/40 bg-sky-400/10 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]"
                      : "border-white/10 bg-slate-950/30 hover:border-sky-300/20 hover:bg-white/5")
                  }
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">
                    {option.eyebrow}
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-white">{option.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">{option.description}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-slate-950/70 p-7 shadow-2xl shadow-sky-950/20 backdrop-blur-xl md:p-9">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">
              {roleConfig.eyebrow}
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              {t("auth.login.title", { defaultValue: "Sign in" })}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {roleConfig.description}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.email", { defaultValue: "Email" })}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.password", { defaultValue: "Password" })}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
              </div>

              {err && (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 rounded-2xl bg-sky-400 font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? t("auth.login.loading", { defaultValue: "Signing in..." })
                  : t("auth.login.submit", { defaultValue: "Access account" })}
              </button>
            </form>

            {roleConfig.demo && (
              <div className="mt-6 rounded-2xl border border-sky-300/10 bg-sky-400/5 p-4 text-sm text-slate-300">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-200">
                  Demo Credentials
                </div>
                <div className="mt-3">{roleConfig.demo.email}</div>
                <div>{roleConfig.demo.password}</div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
              {roleConfig.registerAllowed ? (
                <Link className="text-sky-300 hover:text-sky-200" to={`/register?role=${role}`}>
                  {t("auth.login.noAccount", { defaultValue: "Need an account?" })}{" "}
                  {t("auth.login.register", { defaultValue: "Register here" })}
                </Link>
              ) : (
                <span>Admin accounts are managed internally.</span>
              )}

              <Link className="text-slate-400 hover:text-white" to="/">
                {t("auth.backToSite", { defaultValue: "Back to site" })}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
