import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerClient, getClientSession } from "../lib/clientAuth.js";

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#22d3ee"];

export default function Register() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (getClientSession()) {
    nav("/", { replace: true });
    return null;
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const strength = getPasswordStrength(form.password);

  const strengthLabel = [
    "",
    t("auth.strength.veryWeak", { defaultValue: "Foarte slabă" }),
    t("auth.strength.weak", { defaultValue: "Slabă" }),
    t("auth.strength.medium", { defaultValue: "Medie" }),
    t("auth.strength.good", { defaultValue: "Bună" }),
    t("auth.strength.excellent", { defaultValue: "Excelentă" }),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (form.password !== form.confirm) {
      setErr(t("auth.errors.passwordMismatch", { defaultValue: "Parolele nu coincid." }));
      return;
    }
    if (form.password.length < 6) {
      setErr(t("auth.errors.passwordTooShort", { defaultValue: "Parola trebuie să aibă cel puțin 6 caractere." }));
      return;
    }

    setLoading(true);
    const res = registerClient({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setLoading(false);

    if (!res.ok) {
      setErr(t(res.error, { defaultValue: res.error }));
      return;
    }

    nav("/", { replace: true });
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(34,211,238,0.12)",
    fontFamily: "'DM Mono',monospace",
  };

  const focusInput = (e) => {
    e.target.style.borderColor = "rgba(34,211,238,0.4)";
    e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)";
  };

  const blurInput = (e) => {
    e.target.style.borderColor = "rgba(34,211,238,0.12)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen bg-[#04080f] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 65%)" }}
      />

      <div className="relative z-10 w-full max-w-[420px] rounded-[20px] px-9 py-10"
        style={{
          background: "rgba(10,18,32,0.85)",
          border: "1px solid rgba(34,211,238,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5),0 0 60px rgba(34,211,238,0.04)",
        }}
      >
        <div className="text-center mb-1 font-extrabold text-[22px] tracking-widest"
          style={{ fontFamily: "'Syne',sans-serif", color: "#22d3ee" }}>
          Sparkle<span style={{ color: "#334155" }}>Wash</span>
        </div>
        <p className="text-center text-[11px] tracking-widest mb-8"
          style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
          {t("auth.register.subtitle", { defaultValue: "Cont nou · Înregistrare rapidă" })}
        </p>

        <h1 className="text-center text-[18px] font-bold text-slate-200 mb-6"
          style={{ fontFamily: "'Syne',sans-serif" }}>
          {t("auth.register.title", { defaultValue: "Creează cont" })}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.name", { defaultValue: "Nume complet" })}
            </label>
            <input
              type="text"
              placeholder={t("auth.placeholders.name", { defaultValue: "Ion Popescu" })}
              value={form.name}
              onChange={set("name")}
              required
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.email", { defaultValue: "Email" })}
            </label>
            <input
              type="email"
              placeholder="email@exemplu.com"
              value={form.email}
              onChange={set("email")}
              required
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.phone", { defaultValue: "Telefon" })}{" "}
              <span style={{ color: "#1e293b" }}>
                ({t("auth.optional", { defaultValue: "opțional" })})
              </span>
            </label>
            <input
              type="tel"
              placeholder="+40 7xx xxx xxx"
              value={form.phone}
              onChange={set("phone")}
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.password", { defaultValue: "Parolă" })}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              required
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
            {form.password && (
              <>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-[3px] rounded-full transition-all"
                      style={{
                        background: i <= strength ? STRENGTH_COLORS[strength] : "rgba(255,255,255,0.06)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] mt-1" style={{ color: STRENGTH_COLORS[strength], fontFamily: "'DM Mono',monospace" }}>
                  {strengthLabel[strength]}
                </p>
              </>
            )}
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-[0.18em] uppercase mb-2"
              style={{ color: "#475569", fontFamily: "'DM Mono',monospace" }}>
              {t("auth.fields.confirmPassword", { defaultValue: "Confirmă parola" })}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set("confirm")}
              required
              className="w-full h-[46px] rounded-[10px] px-[14px] text-[13px] text-slate-200 outline-none transition-all"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

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
              ? t("auth.register.loading", { defaultValue: "Se creează contul..." })
              : t("auth.register.submit", { defaultValue: "Creează cont →" })}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <span className="text-[11px]" style={{ color: "#1e293b", fontFamily: "'DM Mono',monospace" }}>
            {t("auth.or", { defaultValue: "sau" })}
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        <Link
          to="/login"
          className="block text-center text-[12px] mt-1 transition-colors"
          style={{ color: "#475569", fontFamily: "'DM Mono',monospace", textDecoration: "none" }}
          onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
          onMouseLeave={(e) => (e.target.style.color = "#475569")}
        >
          {t("auth.register.hasAccount", { defaultValue: "Ai deja cont?" })}{" "}
          <strong style={{ color: "#22d3ee" }}>
            {t("auth.register.login", { defaultValue: "Autentifică-te" })}
          </strong>
        </Link>

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
