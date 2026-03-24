import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginClient, getClientSession } from "../lib/clientAuth.js";
import { adminLogin, getAdminSession } from "../lib/adminAuth.js";
import { loginEmployee, getEmployeeSession } from "../lib/employeeAuth.js";

async function detectRoleAndLogin(email, password) {
  // Try admin first
  const adminResult = adminLogin(email, password);
  if (adminResult.ok) return { ...adminResult, redirect: "/admin/dashboard" };

  // Try employee
  const empResult = loginEmployee({ email, password });
  if (empResult.ok) return { ...empResult, redirect: "/employee/dashboard" };

  // Try client
  const clientResult = await loginClient({ email, password });
  if (clientResult.ok) return { ...clientResult, redirect: "/" };

  return { ok: false, error: "auth.errors.invalidCredentials" };
}

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminSession()) { nav("/admin/dashboard", { replace: true }); return; }
    if (getEmployeeSession()) { nav("/employee/dashboard", { replace: true }); return; }
    if (getClientSession()) { nav("/", { replace: true }); }
  }, [nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const result = await detectRoleAndLogin(email, password);
    setLoading(false);

    if (!result.ok) {
      setErr(t(result.error, { defaultValue: result.error }));
      return;
    }

    nav(result.redirect, { replace: true });
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
              {t("auth.access.badge", { defaultValue: "Secure Access" })}
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
              {t("auth.access.title", { defaultValue: "Welcome back to SparkleWash." })}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {t("auth.access.subtitle", {
                defaultValue: "Sign in with your account and we will take you to the right place automatically.",
              })}
            </p>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-slate-950/70 p-7 shadow-2xl shadow-sky-950/20 backdrop-blur-xl md:p-9">
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              {t("auth.login.title", { defaultValue: "Sign in" })}
            </h2>

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

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
              <Link className="text-sky-300 hover:text-sky-200" to="/register">
                {t("auth.login.noAccount", { defaultValue: "Need an account?" })}{" "}
                {t("auth.login.register", { defaultValue: "Register here" })}
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
