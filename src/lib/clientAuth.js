// src/lib/clientAuth.js

const USERS_KEY = "sw_clients_v1";
const SESSION_KEY = "sw_client_session_v1";

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerClient({ name, email, phone, password }) {
  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    return { ok: false, error: "auth.errors.emailExists" };
  }

  const user = {
    id: `USR_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name,
    email,
    phone: phone || "",
    password,
    createdAt: Date.now(),
  };

  users.push(user);
  writeUsers(users);

  const session = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { ok: true, user };
}

export function loginClient({ email, password }) {
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { ok: false, error: "auth.errors.invalidCredentials" };
  }

  const session = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user };
}

export function logoutClient() {
  localStorage.removeItem(SESSION_KEY);
}

export function getClientSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function requireClient() {
  return !!getClientSession();
}