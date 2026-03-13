import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteMessage, listMessages, markMessageRead } from "../lib/storage.js";

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function AdminMessages() {
  const { t } = useTranslation();
  const [rows, setRows] = useState(listMessages());
  const [filter, setFilter] = useState("all"); // all | unread | read

  const unread = useMemo(() => rows.filter(m => !m.read).length, [rows]);

  const filtered = useMemo(() => {
    if (filter === "unread") return rows.filter(m => !m.read);
    if (filter === "read") return rows.filter(m => m.read);
    return rows;
  }, [rows, filter]);

  function toggleRead(id, flag) { markMessageRead(id, flag); setRows(listMessages()); }
  function remove(id) { if (!confirm("Delete this message?")) return; deleteMessage(id); setRows(listMessages()); }

  return (
    <div>
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="sw-page-h1">Messages</h1>
          <p className="sw-page-sub">{unread} unread · {rows.length} total</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "unread", "read"].map(f => (
            <button
              key={f} type="button"
              onClick={() => setFilter(f)}
              className={filter === f ? "sw-btn sw-btn-primary" : "sw-btn sw-btn-ghost"}
              style={{ textTransform: "capitalize" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(m => (
          <div
            key={m.id}
            className="sw-card"
            style={{
              padding: 22,
              borderColor: !m.read ? "rgba(167,139,250,0.25)" : undefined,
              background: !m.read ? "rgba(167,139,250,0.04)" : undefined,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#c4b5fd", fontWeight: 700, flexShrink: 0
                  }}>
                    {(m.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "#334155" }}>
                      {m.email}
                      {m.phone ? ` · ${m.phone}` : ""}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#1e293b", marginTop: 6 }}>{fmt(m.at)} · {m.id}</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!m.read && (
                  <span className="sw-badge sw-badge-pending" style={{ alignSelf: "center" }}>Unread</span>
                )}
                <button className="sw-btn sw-btn-ghost" onClick={() => toggleRead(m.id, !m.read)}>
                  {m.read ? "Mark unread" : "Mark read"}
                </button>
                <button className="sw-btn sw-btn-danger" onClick={() => remove(m.id)}>Delete</button>
              </div>
            </div>

            <div style={{
              marginTop: 16, padding: "14px 16px",
              background: "rgba(255,255,255,0.02)", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.04)",
              fontSize: 13, color: "#64748b", lineHeight: 1.7
            }}>
              {m.message}
            </div>

            <div style={{ marginTop: 14 }}>
              <button
                className="sw-btn sw-btn-primary"
                onClick={() => alert("Reply (demo)")}
              >
                ↩ Reply
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="sw-card" style={{ padding: 40, textAlign: "center", color: "#1e293b", fontSize: 13 }}>
            No messages
          </div>
        )}
      </div>
    </div>
  );
}
