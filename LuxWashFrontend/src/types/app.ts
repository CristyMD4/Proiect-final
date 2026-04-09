export type BookingStatus = "new" | "pending" | "confirmed" | "completed" | "canceled";

export type Booking = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  locationId: string;
  date: string;
  time: string;
  notes: string;
  at: number;
  status: BookingStatus;
};

export type BookingDraft = Partial<Booking> & {
  name?: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
};

export type ClientSession = {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  loggedInAt: number;
};

export type AdminSession = {
  email: string;
  name: string;
  loggedInAt: number;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  locationId: string;
  password: string;
  role: string;
  status: string;
  schedule: {
    days: string[];
    start: string;
    end: string;
  };
  assignments: EmployeeAssignment[];
  createdAt: number;
  updatedAt: number;
};

export type EmployeeAssignment = {
  date: string;
  start: string;
  end: string;
  area: string;
  locationId: string;
};

export type EmployeeSession = {
  id: string;
  name: string;
  email: string;
  role: string;
  loggedInAt: number;
};

export type AuthFailure = {
  ok: false;
  error: string;
};

export type AuthSuccess<TUser, TSession = TUser> = {
  ok: true;
  user: TUser;
  session?: TSession;
};
