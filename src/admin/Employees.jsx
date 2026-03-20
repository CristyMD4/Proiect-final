import React, { useMemo, useState } from "react";
import { listEmployees, updateEmployeeStatus } from "../lib/employeeAuth.js";

const STATUS_OPTIONS = [
  { value: "working", label: "Working", className: "sw-badge-confirmed" },
  { value: "resting", label: "Resting", className: "sw-badge-pending" },
  { value: "late", label: "Late", className: "sw-badge-canceled" },
];

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

export default function AdminEmployees() {
  const [employees, setEmployees] = useState(() => listEmployees());

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

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Employees</h1>
        <p className="sw-page-sub">Track each employee and update whether they are working, resting, or late.</p>
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
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
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
                  <td>{formatDate(employee.updatedAt)}</td>
                </tr>
              );
            })}
            {employees.length === 0 && (
              <tr>
                <td colSpan="4" style={{ color: "#334155" }}>
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
