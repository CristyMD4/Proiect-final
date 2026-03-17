import React from "react";
import { useTranslation } from "react-i18next";
import { getEmployeeSession } from "../lib/employeeAuth.js";

export default function EmployeeDashboard() {
  const { t } = useTranslation();
  const session = getEmployeeSession();
  const stats = [
    { label: t("employee.stats.bookings", { defaultValue: "Today Bookings" }), value: "18", note: t("employee.stats.bookingsNote", { defaultValue: "4 arrivals in the next hour" }) },
    { label: t("employee.stats.bays", { defaultValue: "Open Bays" }), value: "3", note: t("employee.stats.baysNote", { defaultValue: "2 full-service, 1 detailing" }) },
    { label: t("employee.stats.messages", { defaultValue: "Messages" }), value: "7", note: t("employee.stats.messagesNote", { defaultValue: "2 require callback" }) },
  ];

  const tasks = [
    t("employee.tasks.one", { defaultValue: "Confirm 10:30 premium detail booking for Elena T." }),
    t("employee.tasks.two", { defaultValue: "Refill eco detergent in self-service bay 2." }),
    t("employee.tasks.three", { defaultValue: "Review two customer messages waiting for a status update." }),
  ];

  return (
    <div className="grid gap-6">
      <section
        style={{
          padding: 24,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(14,165,233,0.14), rgba(15,23,42,0.84))",
          border: "1px solid rgba(56,189,248,0.22)",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#bae6fd" }}>
          {t("employee.signedIn", { defaultValue: "Signed In" })}
        </div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em" }}>
          {session?.name || t("employee.fallbackName", { defaultValue: "Employee" })}
        </div>
        <div style={{ marginTop: 6, color: "#cbd5e1" }}>
          {session?.email || "employee@sparklewash.com"}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              padding: 20,
              borderRadius: 18,
              background: "rgba(15, 23, 42, 0.84)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 12 }}>{item.label}</div>
            <div style={{ marginTop: 8, fontSize: 34, fontWeight: 800 }}>{item.value}</div>
            <div style={{ marginTop: 8, color: "#cbd5e1", fontSize: 13 }}>{item.note}</div>
          </div>
        ))}
      </section>

      <section
        style={{
          padding: 22,
          borderRadius: 18,
          background: "rgba(15, 23, 42, 0.84)",
          border: "1px solid rgba(148, 163, 184, 0.12)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>{t("employee.checklist", { defaultValue: "Shift Checklist" })}</div>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {tasks.map((task) => (
            <div
              key={task}
              style={{
                padding: 14,
                borderRadius: 14,
                background: "rgba(2, 6, 23, 0.6)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                color: "#e2e8f0",
              }}
            >
              {task}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
