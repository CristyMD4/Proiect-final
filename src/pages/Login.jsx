import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginClient, getClientSession } from "../lib/clientAuth.js";

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // daca e deja logat redirecteaza
  if (getClientSession()) {
    nav("/", { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = loginClient({ email, password });
    setLoading(false);

    if (!res.ok) {
      setErr(t(res.error, { defaultValue: res.error }));
      return;
    }

    nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#04080f] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Glow */}
      <div className="absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 65%)" }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-[20px] px-9 py-10"
        style={{
          background: "rgba(10,18,32,0.85)",
          border: "1px solid rgba(34,211,238,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5),0 0 60px rgba(34,211,238,0.04)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-1 font-extrabold text-[22px] tracking-widest"
          style={{ fontFamily: "'Syne',sans-serif", color: "#22d3ee" }}>
          Sparkle<span style={{ color: "#334155" }}>Wash</span>
        </div>
        <p className="text-center text-[11px] tracking-widest mb-8"
          style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
          {t("auth.login.subtitle", { defaultValue: "Contul tău · Acces Securizat" })}
        </p>

        <h1 className="text-center text-[18px] font-bold text-slate-200 mb-6"
          style={{ fontFamily: "'Syne',sans-serif" }}>
          {t("auth.login.title", { defaultValue: "Autentificare" })}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.email", { defaultValue: "Email" })}
            </label>
            <input
              type="email"
              placeholder="email@exemplu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(34,211,238,0.12)",
                fontFamily: "'DM Mono',monospace",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(34,211,238,0.4)";
                e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(34,211,238,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Parola */}
          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.password", { defaultValue: "Parolă" })}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(34,211,238,0.12)",
                fontFamily: "'DM Mono',monospace",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(34,211,238,0.4)";
                e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(34,211,238,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Eroare */}
          {err && (
            <div className="rounded-[9px] px-[14px] py-[10px] text-[12px]"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "#fca5a5",
                fontFamily: "'DM Mono',monospace",
              }}>
              {err}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] mt-2 rounded-[10px] text-[12px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: "#67e8f9",
              fontFamily: "'DM Mono',monospace",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "rgba(34,211,238,0.2)";
                e.target.style.boxShadow = "0 0 20px rgba(34,211,238,0.12)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(34,211,238,0.12)";
              e.target.style.boxShadow = "none";
            }}
          >
            {loading
              ? t("auth.login.loading", { defaultValue: "Se verifică..." })
              : t("auth.login.submit", { defaultValue: "Intră în cont →" })}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <span className="text-[11px]" style={{ color: "#1e293b", fontFamily: "'DM Mono',monospace" }}>
            {t("auth.or", { defaultValue: "sau" })}
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Link catre register */}
        <Link
          to="/register"
          className="block text-center text-[12px] mt-1 transition-colors"
          style={{ color: "#475569", fontFamily: "'DM Mono',monospace", textDecoration: "none" }}
          onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
          onMouseLeave={(e) => (e.target.style.color = "#475569")}
        >
          {t("auth.login.noAccount", { defaultValue: "Nu ai cont?" })}{" "}
          <strong style={{ color: "#22d3ee" }}>
            {t("auth.login.register", { defaultValue: "Înregistrează-te" })}
          </strong>
        </Link>

        {/* Inapoi la site */}
        <Link
          to="/"
          className="block text-center mt-5 text-[11px] transition-colors"
          style={{ color: "#1e293b", fontFamily: "'DM Mono',monospace", textDecoration: "none" }}
          onMouseEnter={(e) => (e.target.style.color = "#475569")}
          onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
        >
          ← {t("auth.backToSite", { defaultValue: "Înapoi la site" })}
        </Link>
      </div>
    </div>
  );
}