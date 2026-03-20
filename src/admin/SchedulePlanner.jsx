import React, { useEffect, useMemo, useState } from "react";
import { listEmployees, updateEmployeeSchedule } from "../lib/employeeAuth.js";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDayLabelFromDate(value) {
  const dayIndex = new Date(`${value}T12:00:00`).getDay();
  return CALENDAR_DAYS[(dayIndex + 6) % 7];
}

function buildMonthDays(cursor) {
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const start = new Date(monthStart);
  const startOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - startOffset);

  const end = new Date(monthEnd);
  const endOffset = 6 - ((end.getDay() + 6) % 7);
  end.setDate(end.getDate() + endOffset);

  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function buildDrafts(employees) {
  return employees.reduce((acc, employee) => {
    acc[employee.id] = {
      days: employee.schedule?.days || [],
      start: employee.schedule?.start || "09:00",
      end: employee.schedule?.end || "17:00",
    };
    return acc;
  }, {});
}

export default function AdminSchedulePlanner() {
  const [employees, setEmployees] = useState(() => listEmployees());
  const [drafts, setDrafts] = useState(() => buildDrafts(listEmployees()));
  const [selectedDate, setSelectedDate] = useState(() => formatDateValue(new Date()));
  const [calendarCursor, setCalendarCursor] = useState(() => new Date());

  useEffect(() => {
    setDrafts(buildDrafts(employees));
  }, [employees]);

  const calendarDays = useMemo(() => buildMonthDays(calendarCursor), [calendarCursor]);
  const selectedDayLabel = useMemo(() => getDayLabelFromDate(selectedDate), [selectedDate]);
  const monthLabel = useMemo(
    () => calendarCursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    [calendarCursor]
  );

  const totalAssignedDays = useMemo(
    () => employees.reduce((sum, employee) => sum + (employee.schedule?.days?.length || 0), 0),
    [employees]
  );

  function toggleDay(employeeId, day) {
    setDrafts((current) => {
      const currentDays = current[employeeId]?.days || [];
      const nextDays = currentDays.includes(day)
        ? currentDays.filter((item) => item !== day)
        : [...currentDays, day];

      return {
        ...current,
        [employeeId]: {
          ...current[employeeId],
          days: nextDays,
        },
      };
    });
  }

  function changeField(employeeId, field, value) {
    setDrafts((current) => ({
      ...current,
      [employeeId]: {
        ...current[employeeId],
        [field]: value,
      },
    }));
  }

  function saveSchedule(employeeId) {
    const result = updateEmployeeSchedule(employeeId, drafts[employeeId]);
    if (!result.ok) return;
    setEmployees(listEmployees());
  }

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Schedule Planner</h1>
        <p className="sw-page-sub">Program weekly shifts for each employee and assign multiple working days from one place.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16, marginBottom: 24 }}>
        <div className="sw-card" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <button
              type="button"
              className="sw-btn sw-btn-ghost"
              style={{ height: 30, padding: "0 10px" }}
              onClick={() => setCalendarCursor(new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1))}
            >
              Prev
            </button>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{monthLabel}</div>
            <button
              type="button"
              className="sw-btn sw-btn-ghost"
              style={{ height: 30, padding: "0 10px" }}
              onClick={() => setCalendarCursor(new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1))}
            >
              Next
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
            {CALENDAR_DAYS.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: "#334155",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {calendarDays.map((day) => {
              const value = formatDateValue(day);
              const isCurrentMonth = day.getMonth() === calendarCursor.getMonth();
              const isSelected = value === selectedDate;
              const isToday = value === formatDateValue(new Date());

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedDate(value)}
                  style={{
                    minHeight: 42,
                    borderRadius: 12,
                    border: `1px solid ${isSelected ? "rgba(103,232,249,0.45)" : "rgba(255,255,255,0.07)"}`,
                    background: isSelected ? "rgba(34,211,238,0.16)" : "rgba(255,255,255,0.02)",
                    color: isCurrentMonth ? "#e2e8f0" : "#475569",
                    fontFamily: "inherit",
                    fontSize: 12,
                    fontWeight: isSelected || isToday ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: isSelected ? "0 0 0 1px rgba(103,232,249,0.15) inset" : "none",
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sw-card" style={{ padding: 22, display: "grid", alignContent: "center" }}>
          <div className="sw-section-title" style={{ marginBottom: 12 }}>Selected Planning Day</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>
            {formatLongDate(selectedDate)}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", maxWidth: 620, lineHeight: 1.7 }}>
            The selected date falls on <strong style={{ color: "#67e8f9" }}>{selectedDayLabel}</strong>. Use it to quickly check which weekly assignments apply to that day while you plan employee schedules.
          </div>
        </div>
      </div>

      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Employees</div>
          <div className="sw-stat-value">{employees.length}</div>
          <div className="sw-stat-sub">available for scheduling</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Assigned Days</div>
          <div className="sw-stat-value">{totalAssignedDays}</div>
          <div className="sw-stat-sub">total weekly work days across staff</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Week Pattern</div>
          <div className="sw-stat-value">7</div>
          <div className="sw-stat-sub">days available for planning</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Shift Setup</div>
          <div className="sw-stat-value">24h</div>
          <div className="sw-stat-sub">choose start and end times per employee</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {employees.map((employee) => {
          const draft = drafts[employee.id] || { days: [], start: "09:00", end: "17:00" };

          return (
            <div key={employee.id} className="sw-card" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", marginBottom: 18, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{employee.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{employee.email}</div>
                </div>
                <div style={{ fontSize: 11, color: "#334155" }}>
                  Current plan: {draft.days.length > 0 ? draft.days.join(", ") : "No days selected"} | {draft.start} - {draft.end}
                </div>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <div className="sw-section-title" style={{ marginBottom: 10 }}>Working Days</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {WEEK_DAYS.map((day) => {
                      const isActive = draft.days.includes(day);
                      const isSelectedDay = day === selectedDayLabel;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(employee.id, day)}
                          className={`sw-btn ${isActive ? "sw-btn-primary" : "sw-btn-ghost"}`}
                          style={{
                            height: 32,
                            padding: "0 12px",
                            boxShadow: isSelectedDay ? "0 0 0 1px rgba(251,191,36,0.35) inset" : "none",
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: "#334155" }}>
                  {draft.days.includes(selectedDayLabel)
                    ? `${employee.name} is scheduled on ${selectedDayLabel}.`
                    : `${employee.name} is not scheduled on ${selectedDayLabel}.`}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "180px 180px auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label className="sw-form-label">Start Time</label>
                    <input
                      className="sw-input"
                      type="time"
                      value={draft.start}
                      onChange={(event) => changeField(employee.id, "start", event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="sw-form-label">End Time</label>
                    <input
                      className="sw-input"
                      type="time"
                      value={draft.end}
                      onChange={(event) => changeField(employee.id, "end", event.target.value)}
                    />
                  </div>
                  <button type="button" className="sw-btn sw-btn-primary" onClick={() => saveSchedule(employee.id)}>
                    Save Schedule
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
