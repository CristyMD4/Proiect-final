import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getClientSession, registerClient } from "../lib/clientAuth.js";
import { getEmployeeSession, registerEmployee } from "../lib/employeeAuth.js";

const ROLE_OPTIONS = [
  {
    key: "customer",
    eyebrow: "Customer Registration",
    title: "Create a customer account",
    description: "Save bookings faster and keep your visit history in one place.",
    submitText: "Create customer account",
    redirectTo: "/",
  },
  {
    key: "employee",
    eyebrow: "Employee Registration",
    title: "Create a staff account",
    description: "Set up a staff login for shift notes, bookings, and daily operations.",
    submitText: "Create employee account",
    redirectTo: "/employee/dashboard",
  },
];

function getRoleConfig(role) {
  return ROLE_OPTIONS.find((option) => option.key === role) || ROLE_OPTIONS[0];
}

function getSessionForRole(role) {
  return role === "employee" ? getEmployeeSession() : getClientSession();
}

function registerByRole(role, payload) {
  return role === "employee" ? registerEmployee(payload) : registerClient(payload);
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const STRENGTH_COLORS = ["#0f172a", "#ef4444", "#f97316", "#eab308", "#22c55e", "#38bdf8"];

export default function Register() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "employee" ? "employee" : "customer";

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfig = useMemo(() => getRoleConfig(role), [role]);
  const strength = getPasswordStrength(form.password);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    const session = getSessionForRole(role);
    if (session) {
      nav(roleConfig.redirectTo, { replace: true });
    }
  }, [nav, role, roleConfig]);

  const updateRole = (nextRole) => {
    setRole(nextRole);
    setErr("");
    setForm({ name: "", email: "", phone: "", password: "", confirm: "" });
    setSearchParams({ role: nextRole });
  };

  const setField = (field) => (e) => {
    setForm((current) => ({ ...current, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (form.password !== form.confirm) {
      setErr(t("auth.errors.passwordMismatch", { defaultValue: "Passwords do not match." }));
      return;
    }

    if (form.password.length < 6) {
      setErr(t("auth.errors.passwordTooShort", { defaultValue: "Password must be at least 6 characters." }));
      return;
    }

    setLoading(true);
    const result = registerByRole(role, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setLoading(false);

    if (!result.ok) {
      setErr(t(result.error, { defaultValue: result.error }));
      return;
    }

    nav(roleConfig.redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute top-0 right-0 h-[340px] w-[340px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute bottom-[-100px] left-0 h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="rounded-[30px] border border-white/10 bg-slate-950/70 p-7 shadow-2xl shadow-sky-950/20 backdrop-blur-xl md:p-9">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">
              Choose Account Type
            </div>
            <div className="mt-6 grid gap-4">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => updateRole(option.key)}
                  className={
                    "rounded-[24px] border p-5 text-left transition " +
                    (role === option.key
                      ? "border-sky-300/40 bg-sky-400/10 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]"
                      : "border-white/10 bg-white/[0.03] hover:border-sky-300/20 hover:bg-white/5")
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

            <div className="mt-6 rounded-[24px] border border-amber-300/15 bg-amber-400/8 p-5 text-sm leading-6 text-amber-50">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">
                Admin Accounts
              </div>
              <div className="mt-2">
                Admin registration is disabled here. Use the shared login page and choose the admin role.
              </div>
              <Link className="mt-4 inline-block text-amber-200 hover:text-white" to="/login?role=admin">
                Open admin login
              </Link>
            </div>
          </section>

          <section className="max-w-2xl">
            <div className="inline-flex rounded-full border border-sky-300/15 bg-slate-950/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
              {roleConfig.eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
              {roleConfig.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              {roleConfig.description}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-[30px] border border-white/10 bg-slate-950/60 p-7 backdrop-blur-xl md:grid-cols-2 md:p-9">
              <div className="md:col-span-2">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.name", { defaultValue: "Full name" })}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder={t("auth.placeholders.name", { defaultValue: "Alex Spark" })}
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.email", { defaultValue: "Email" })}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="email@example.com"
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.phone", { defaultValue: "Phone" })}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  placeholder="+373 600 00 000"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.password", { defaultValue: "Password" })}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={setField("password")}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
                {form.password && (
                  <>
                    <div className="mt-3 flex gap-2">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <span
                          key={item}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            background: item <= strength ? STRENGTH_COLORS[strength] : "rgba(255,255,255,0.08)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      Strength score: <span style={{ color: STRENGTH_COLORS[strength] }}>{strength}/5</span>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  {t("auth.fields.confirmPassword", { defaultValue: "Confirm password" })}
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={setField("confirm")}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:bg-white/10"
                />
              </div>

              {err && (
                <div className="md:col-span-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 mt-2 h-12 rounded-2xl bg-sky-400 font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? t("auth.register.loading", { defaultValue: "Creating account..." })
                  : roleConfig.submitText}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
              <Link className="text-sky-300 hover:text-sky-200" to={`/login?role=${role}`}>
                {t("auth.register.hasAccount", { defaultValue: "Already have an account?" })}{" "}
                {t("auth.register.login", { defaultValue: "Sign in" })}
              </Link>
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
