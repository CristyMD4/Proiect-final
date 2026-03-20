import React, { useMemo, useState } from "react";
import { listEmployees, registerEmployee } from "../lib/employeeAuth.js";

const STATUS_OPTIONS = [
  { value: "working", label: "Working", className: "sw-badge-confirmed" },
  { value: "resting", label: "Resting", className: "sw-badge-pending" },
  { value: "late", label: "Late", className: "sw-badge-canceled" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDateTime(value) {
  if (!value) return "Not updated";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildDailySchedule(employee, selectedDate) {
  const dayLabel = DAY_LABELS[new Date(`${selectedDate}T12:00:00`).getDay()];
  const schedule = employee.schedule || {};
  const activeDays = Array.isArray(schedule.days) ? schedule.days : [];
  const worksToday = activeDays.includes(dayLabel);

  return {
    dayLabel,
    worksToday,
    shiftLabel: worksToday
      ? `${schedule.start || "09:00"} - ${schedule.end || "17:00"}`
      : "Rest day",
    weekLabel: activeDays.length > 0 ? activeDays.join(", ") : "No weekly schedule",
  };
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState(() => listEmployees());
  const [selectedDate, setSelectedDate] = useState(() => formatDateValue(new Date()));
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const employeeRows = useMemo(
    () =>
      employees.map((employee) => ({
        ...employee,
        dailySchedule: buildDailySchedule(employee, selectedDate),
      })),
    [employees, selectedDate]
  );

  const summary = useMemo(() => {
    const onShift = employeeRows.filter((employee) => employee.dailySchedule.worksToday).length;
    const resting = employeeRows.length - onShift;
    const late = employeeRows.filter((employee) => employee.status === "late").length;

    return { total: employeeRows.length, onShift, resting, late };
  }, [employeeRows]);

  function setField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCreateEmployee(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Name, email, and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    const result = registerEmployee({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    });

    if (!result.ok) {
      setFormError(result.error === "auth.errors.emailExists" ? "This employee email already exists." : result.error);
      return;
    }

    setEmployees(listEmployees());
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setFormSuccess("Employee account created successfully.");
  }

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Employees</h1>
        <p className="sw-page-sub">See every employee and the schedule for the selected day from the admin panel calendar.</p>
      </div>

      <div className="sw-card" style={{ padding: 22, marginBottom: 24 }}>
        <div className="sw-section-title">Add Employee</div>
        <form
          onSubmit={handleCreateEmployee}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr)) auto",
            gap: 10,
            alignItems: "end",
          }}
        >
          <div>
            <label className="sw-form-label">Name</label>
            <input
              className="sw-input"
              type="text"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Employee name"
            />
          </div>
          <div>
            <label className="sw-form-label">Email</label>
            <input
              className="sw-input"
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="employee@example.com"
            />
          </div>
          <div>
            <label className="sw-form-label">Phone</label>
            <input
              className="sw-input"
              type="tel"
              value={form.phone}
              onChange={(event) => setField("phone", event.target.value)}
              placeholder="+373 600 00 000"
            />
          </div>
          <div>
            <label className="sw-form-label">Password</label>
            <input
              className="sw-input"
              type="password"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>
          <button type="submit" className="sw-btn sw-btn-primary">
            Add Employee
          </button>
        </form>
        {formError ? <div style={{ marginTop: 12, fontSize: 12, color: "#fca5a5" }}>{formError}</div> : null}
        {formSuccess ? <div style={{ marginTop: 12, fontSize: 12, color: "#6ee7b7" }}>{formSuccess}</div> : null}
      </div>

      <div
        className="sw-card"
        style={{
          padding: 22,
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 18,
          alignItems: "end",
        }}
      >
        <div>
          <div className="sw-section-title" style={{ marginBottom: 10 }}>Calendar</div>
          <input
            className="sw-input"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>
        <div>
          <div className="sw-section-title" style={{ marginBottom: 10 }}>Selected Day</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>
            {formatSelectedDate(selectedDate)}
          </div>
          <div style={{ fontSize: 12, color: "#334155", marginTop: 6 }}>
            Choose any date to see who is scheduled, resting, or late on that day.
          </div>
        </div>
      </div>

      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Total Staff</div>
          <div className="sw-stat-value">{summary.total}</div>
          <div className="sw-stat-sub">employee accounts in the system</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">On Shift</div>
          <div className="sw-stat-value">{summary.onShift}</div>
          <div className="sw-stat-sub">scheduled for {employeeRows[0]?.dailySchedule.dayLabel || "today"}</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Resting</div>
          <div className="sw-stat-value">{summary.resting}</div>
          <div className="sw-stat-sub">not scheduled on the selected day</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Late</div>
          <div className="sw-stat-value">{summary.late}</div>
          <div className="sw-stat-sub">employees currently marked late</div>
        </div>
      </div>

      <div className="sw-card" style={{ overflow: "hidden" }}>
        <table className="sw-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Schedule For Day</th>
              <th>Weekly Pattern</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {employeeRows.map((employee) => {
              const activeStatus = STATUS_OPTIONS.find((status) => status.value === employee.status) || STATUS_OPTIONS[1];

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
                    <span className={`sw-badge ${activeStatus.className}`}>{activeStatus.label}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: employee.dailySchedule.worksToday ? "#67e8f9" : "#94a3b8" }}>
                      {employee.dailySchedule.shiftLabel}
                    </div>
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
                      {employee.dailySchedule.worksToday ? "Scheduled to work" : "Not scheduled for this day"}
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: "#64748b" }}>{employee.dailySchedule.weekLabel}</td>
                  <td>{formatDateTime(employee.updatedAt)}</td>
                </tr>
              );
            })}
            {employeeRows.length === 0 && (
              <tr>
                <td colSpan="6" style={{ color: "#334155" }}>
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
