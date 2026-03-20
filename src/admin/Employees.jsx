import React, { useEffect, useMemo, useState } from "react";
import { listEmployees, updateEmployeeSchedule, updateEmployeeStatus } from "../lib/employeeAuth.js";

const STATUS_OPTIONS = [
  { value: "working", label: "Working", className: "sw-badge-confirmed" },
  { value: "resting", label: "Resting", className: "sw-badge-pending" },
  { value: "late", label: "Late", className: "sw-badge-canceled" },
];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatDate(value) {
  if (!value) return "Not updated";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildScheduleDrafts(employees) {
  return employees.reduce((acc, employee) => {
    acc[employee.id] = {
      days: employee.schedule?.days || [],
      start: employee.schedule?.start || "09:00",
      end: employee.schedule?.end || "17:00",
    };
    return acc;
  }, {});
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState(() => listEmployees());
  const [scheduleDrafts, setScheduleDrafts] = useState(() => buildScheduleDrafts(listEmployees()));

  useEffect(() => {
    setScheduleDrafts(buildScheduleDrafts(employees));
  }, [employees]);

  const counts = useMemo(
    () =>
      STATUS_OPTIONS.map((status) => ({
        ...status,
        count: employees.filter((employee) => employee.status === status.value).length,
      })),
    [employees]
  );

  function handleStatusChange(employeeId, status) {
    const result = updateEmployeeStatus(employeeId, status);
    if (!result.ok) return;
    setEmployees(listEmployees());
  }

  function handleScheduleFieldChange(employeeId, field, value) {
    setScheduleDrafts((current) => ({
      ...current,
      [employeeId]: {
        ...current[employeeId],
        [field]: value,
      },
    }));
  }

  function toggleScheduleDay(employeeId, day) {
    setScheduleDrafts((current) => {
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

  function handleScheduleSave(employeeId) {
    const draft = scheduleDrafts[employeeId];
    const result = updateEmployeeSchedule(employeeId, draft);
    if (!result.ok) return;
    setEmployees(listEmployees());
  }

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Employees</h1>
        <p className="sw-page-sub">Track employee status and manage each person&apos;s weekly shift schedule.</p>
      </div>

      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Total Staff</div>
          <div className="sw-stat-value">{employees.length}</div>
          <div className="sw-stat-sub">registered employee accounts</div>
        </div>
        {counts.map((status) => (
          <div key={status.value} className="sw-stat-card">
            <div className="sw-stat-label">{status.label}</div>
            <div className="sw-stat-value">{status.count}</div>
            <div className="sw-stat-sub">employees currently marked {status.label.toLowerCase()}</div>
          </div>
        ))}
      </div>

      <div className="sw-card" style={{ overflow: "hidden" }}>
        <table className="sw-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Schedule</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const activeStatus = STATUS_OPTIONS.find((status) => status.value === employee.status) || STATUS_OPTIONS[1];
              const scheduleDraft = scheduleDrafts[employee.id] || {
                days: employee.schedule?.days || [],
                start: employee.schedule?.start || "09:00",
                end: employee.schedule?.end || "17:00",
              };

              return (
                <tr key={employee.id}>
                  <td>
                    <strong>{employee.name}</strong>
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{employee.id}</div>
                  </td>
                  <td>
                    <div>{employee.email}</div>
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{employee.phone || "No phone number"}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span className={`sw-badge ${activeStatus.className}`}>{activeStatus.label}</span>
                      <select
                        className="sw-input"
                        value={employee.status}
                        onChange={(event) => handleStatusChange(employee.id, event.target.value)}
                        style={{ maxWidth: 160 }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td style={{ minWidth: 280 }}>
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {WEEK_DAYS.map((day) => {
                          const isActive = scheduleDraft.days.includes(day);

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleScheduleDay(employee.id, day)}
                              className={`sw-btn ${isActive ? "sw-btn-primary" : "sw-btn-ghost"}`}
                              style={{ height: 30, padding: "0 10px" }}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                        <input
                          className="sw-input"
                          type="time"
                          value={scheduleDraft.start}
                          onChange={(event) => handleScheduleFieldChange(employee.id, "start", event.target.value)}
                        />
                        <input
                          className="sw-input"
                          type="time"
                          value={scheduleDraft.end}
                          onChange={(event) => handleScheduleFieldChange(employee.id, "end", event.target.value)}
                        />
                        <button type="button" className="sw-btn sw-btn-primary" onClick={() => handleScheduleSave(employee.id)}>
                          Save
                        </button>
                      </div>
                      <div style={{ fontSize: 11, color: "#334155" }}>
                        {scheduleDraft.days.length > 0 ? scheduleDraft.days.join(", ") : "No days selected"} | {scheduleDraft.start} - {scheduleDraft.end}
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(employee.updatedAt)}</td>
                </tr>
              );
            })}
            {employees.length === 0 && (
              <tr>
                <td colSpan="5" style={{ color: "#334155" }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
