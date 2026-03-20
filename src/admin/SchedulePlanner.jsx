import React, { useEffect, useMemo, useState } from "react";
import { listEmployees, updateEmployeeSchedule } from "../lib/employeeAuth.js";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  useEffect(() => {
    setDrafts(buildDrafts(employees));
  }, [employees]);

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

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(employee.id, day)}
                          className={`sw-btn ${isActive ? "sw-btn-primary" : "sw-btn-ghost"}`}
                          style={{ height: 32, padding: "0 12px" }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
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
