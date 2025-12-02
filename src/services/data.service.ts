import { Injectable, signal } from '@angular/core';
import { Patient, Appointment, Doctor } from '../models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  patients = signal<Patient[]>([]);
  doctors = signal<Doctor[]>([]);
  appointments = signal<Appointment[]>([]);
  
  private nextPatientId = signal(4);
  private nextDoctorId = signal(3);
  private nextAppointmentId = signal(4);

  constructor() {
    // Cargar datos de ejemplo
    const initialPatients: Patient[] = [
      { id: 1, name: 'Ana García', phone: '555-1234', email: 'ana.garcia@example.com' },
      { id: 2, name: 'Carlos Rodriguez', phone: '555-5678', email: 'carlos.r@example.com' },
      { id: 3, name: 'Sofia Vargas', phone: '555-8765', email: 'sofia.v@example.com', password: 'password123' }
    ];
    this.patients.set(initialPatients);

    const initialDoctors: Doctor[] = [
      { id: 1, name: 'Dr. Ricardo Pérez', specialty: 'Odontología General', phone: '555-9876' },
      { id: 2, name: 'Dra. Laura Martínez', specialty: 'Ortodoncia', phone: '555-5432' }
    ];
    this.doctors.set(initialDoctors);
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const initialAppointments: Omit<Appointment, 'patient' | 'doctor'>[] = [
      { id: 1, patientId: 1, doctorId: 1, date: today.toISOString(), startTime: '10:00', endTime: '10:45', reason: 'Limpieza Dental' },
      { id: 2, patientId: 2, doctorId: 2, date: today.toISOString(), startTime: '12:30', endTime: '13:00', reason: 'Revisión de Caries' },
      { id: 3, patientId: 1, doctorId: 2, date: tomorrow.toISOString(), startTime: '15:00', endTime: '16:00', reason: 'Consulta Ortodoncia' },
    ];
    this.appointments.set(this.mapRelatedDataToAppointments(initialAppointments));
  }

  private mapRelatedDataToAppointments(appointments: Omit<Appointment, 'patient' | 'doctor'>[]): Appointment[] {
    const patients = this.patients();
    const doctors = this.doctors();
    return appointments.map(app => ({
      ...app,
      patient: patients.find(p => p.id === app.patientId),
      doctor: doctors.find(d => d.id === app.doctorId)
    }));
  }

  addPatient(patientData: Omit<Patient, 'id'>) {
    const newPatient: Patient = {
      id: this.nextPatientId(),
      ...patientData
    };
    this.patients.update(patients => [...patients, newPatient]);
    this.nextPatientId.update(id => id + 1);
  }

  addDoctor(doctorData: Omit<Doctor, 'id'>) {
    const newDoctor: Doctor = {
      id: this.nextDoctorId(),
      ...doctorData
    };
    this.doctors.update(doctors => [...doctors, newDoctor]);
    this.nextDoctorId.update(id => id + 1);
  }

  addAppointment(appointmentData: Omit<Appointment, 'id' | 'patient' | 'doctor'>) {
    const newAppointment: Omit<Appointment, 'patient' | 'doctor'> = {
      id: this.nextAppointmentId(),
      ...appointmentData
    };
    this.appointments.update(appointments => this.mapRelatedDataToAppointments([...appointments, newAppointment]));
    this.nextAppointmentId.update(id => id + 1);
  }

  deleteAppointment(appointmentId: number) {
    this.appointments.update(appointments => appointments.filter(app => app.id !== appointmentId));
  }
}