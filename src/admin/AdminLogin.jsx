import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminLogin, requireAdmin } from "../lib/adminAuth.js";

const LOGIN_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
.sw-login-root {
  min-height: 100vh;
  background: #04080f;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  font-family: 'DM Mono', ui-monospace, monospace;
  position: relative; overflow: hidden;
}
.sw-login-root::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px);
  background-size: 44px 44px;
}
.sw-login-root::after {
  content: '';
  position: absolute; bottom: -300px; left: 50%; transform: translateX(-50%);
  width: 900px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%);
}
.sw-login-box {
  position: relative; z-index: 1;
  width: 100%; max-width: 400px;
  background: rgba(10,18,32,0.85);
  border: 1px solid rgba(34,211,238,0.15);
  border-radius: 20px; padding: 36px;
  backdrop-filter: blur(20px);
  box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(34,211,238,0.04);
}
.sw-login-logo {
  font-family: 'Syne', sans-serif;
  font-size: 22px; font-weight: 800;
  color: #22d3ee; letter-spacing: 0.06em; text-align: center; margin-bottom: 4px;
}
.sw-login-logo span { color: #334155; }
.sw-login-sub { font-size: 11px; color: #334155; text-align: center; letter-spacing: 0.08em; margin-bottom: 28px; }
.sw-login-label { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #334155; margin-bottom: 7px; }
.sw-login-input {
  width: 100%; height: 44px; box-sizing: border-box;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(34,211,238,0.12);
  border-radius: 10px; padding: 0 14px;
  color: #e2e8f0; font-family: inherit; font-size: 13px;
  outline: none; transition: border-color 0.15s;
}
.sw-login-input:focus { border-color: rgba(34,211,238,0.4); box-shadow: 0 0 0 3px rgba(34,211,238,0.07); }
.sw-login-btn {
  width: 100%; height: 44px; margin-top: 8px;
  background: rgba(34,211,238,0.12);
  border: 1px solid rgba(34,211,238,0.3);
  border-radius: 10px;
  color: #67e8f9; font-family: inherit; font-size: 12px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer; transition: all 0.15s;
}
.sw-login-btn:hover { background: rgba(34,211,238,0.2); box-shadow: 0 0 20px rgba(34,211,238,0.12); }
.sw-login-err {
  padding: 10px 14px; border-radius: 9px;
  background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2);
  font-size: 12px; color: #fca5a5;
}
.sw-login-demo {
  margin-top: 20px; padding: 14px 16px; border-radius: 10px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  font-size: 11px; color: #334155;
}
.sw-login-demo strong { color: #475569; display: block; margin-bottom: 6px; }
.sw-login-demo div { color: #1e293b; }
.sw-login-back { display: block; text-align: center; margin-top: 18px; font-size: 11px; color: #1e293b; text-decoration: none; transition: color 0.15s; }
.sw-login-back:hover { color: #475569; }
`;

export default function AdminLogin() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@sparklewash.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  if (requireAdmin()) nav("/admin/dashboard", { replace: true });

  return (
    <div className="sw-login-root">
      <style>{LOGIN_STYLES}</style>
      <div className="sw-login-box">
        <div className="sw-login-logo">Sparkle<span>Wash</span></div>
        <div className="sw-login-sub">Admin Console · Secure Access</div>

        <form onSubmit={e => {
          e.preventDefault(); setErr("");
          const res = adminLogin(email, password);
          if (!res.ok) return setErr(res.error);
          nav("/admin/dashboard", { replace: true });
        }} style={{ display: "grid", gap: 14 }}>
          <div>
            <label className="sw-login-label">Email</label>
            <input className="sw-login-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="sw-login-label">Password</label>
            <input className="sw-login-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required />
          </div>
          {err && <div className="sw-login-err">{err}</div>}
          <button className="sw-login-btn" type="submit">Access Console →</button>
        </form>

        <div className="sw-login-demo">
          <strong>Demo credentials</strong>
          <div>admin@sparklewash.com</div>
          <div>admin123</div>
        </div>

        <Link to="/" className="sw-login-back">← Back to website</Link>
      </div>
    </div>
  );
}
