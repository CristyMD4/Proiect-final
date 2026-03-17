const EMPLOYEE_USERS_KEY = "sw_employees_v1";
const EMPLOYEE_SESSION_KEY = "sw_employee_session_v1";

const DEMO_EMPLOYEES = [
  {
    id: "EMP_DEMO_1",
    name: "Alex Operator",
    email: "employee@sparklewash.com",
    phone: "+373 600 11 111",
    password: "employee123",
    role: "employee",
    createdAt: Date.now(),
  },
];

function readEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(DEMO_EMPLOYEES));
      return [...DEMO_EMPLOYEES];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(DEMO_EMPLOYEES));
      return [...DEMO_EMPLOYEES];
    }
    return parsed;
  } catch {
    localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(DEMO_EMPLOYEES));
    return [...DEMO_EMPLOYEES];
  }
}

function writeEmployees(users) {
  localStorage.setItem(EMPLOYEE_USERS_KEY, JSON.stringify(users));
}

function createSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "employee",
    loggedInAt: Date.now(),
  };

  localStorage.setItem(EMPLOYEE_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function registerEmployee({ name, email, phone, password }) {
  const users = readEmployees();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "auth.errors.emailExists" };
  }

  const user = {
    id: `EMP_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name,
    email,
    phone: phone || "",
    password,
    role: "employee",
    createdAt: Date.now(),
  };

  users.push(user);
  writeEmployees(users);

  return { ok: true, user, session: createSession(user) };
}

export function loginEmployee({ email, password }) {
  const users = readEmployees();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { ok: false, error: "auth.errors.invalidCredentials" };
  }

  return { ok: true, user, session: createSession(user) };
}

export function getEmployeeSession() {
  try {
    const raw = localStorage.getItem(EMPLOYEE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function requireEmployee() {
  return !!getEmployeeSession();
}

export function logoutEmployee() {
  localStorage.removeItem(EMPLOYEE_SESSION_KEY);
}
