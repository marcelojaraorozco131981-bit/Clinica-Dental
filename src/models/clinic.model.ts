export interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  password?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  patient?: Patient; // Optional for easier access
  doctor?: Doctor; // Optional for easier access
  date: string; // ISO string format for consistency
  startTime: string; // e.g., "09:30"
  endTime: string; // e.g., "10:00"
  reason: string;
}