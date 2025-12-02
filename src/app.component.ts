import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { Patient, Appointment, Doctor } from './models/clinic.model';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { DoctorFormComponent } from './components/doctor-form/doctor-form.component';
import { LoginComponent } from './components/login/login.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    PatientFormComponent,
    DoctorFormComponent,
    LoginComponent,
    ReportsComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  dataService = inject(DataService);
  authService = inject(AuthService);

  selectedDate = signal<Date>(new Date());
  showAppointmentForm = signal(false);
  showPatientForm = signal(false);
  showDoctorForm = signal(false);
  showReportsModal = signal(false);

  userRole = computed(() => this.authService.currentUser()?.role);

  appointmentsForSelectedDay = computed(() => {
    const selected = this.selectedDate();
    
    // Base list of appointments depends on the user role
    const sourceAppointments = this.userRole() === 'patient' 
        ? this.patientAppointments() 
        : this.dataService.appointments();

    return sourceAppointments
      .filter(app => {
        const appDate = new Date(app.date);
        return appDate.getFullYear() === selected.getFullYear() &&
               appDate.getMonth() === selected.getMonth() &&
               appDate.getDate() === selected.getDate();
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  patientAppointments = computed(() => {
    const currentUser = this.authService.currentUser();
    if (currentUser?.role !== 'patient') return [];
    
    const allAppointments = this.dataService.appointments();
    return allAppointments
      .filter(app => app.patientId === currentUser.patientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.startTime.localeCompare(b.startTime));
  });

  onDateSelected(date: Date) {
    this.selectedDate.set(date);
  }

  onAddAppointment(appointment: Omit<Appointment, 'id' | 'patient' | 'doctor'>) {
    this.dataService.addAppointment(appointment);
    this.showAppointmentForm.set(false);
  }

  onAddPatient(patient: Omit<Patient, 'id'>) {
    this.dataService.addPatient(patient);
    this.showPatientForm.set(false);
  }
  
  onAddDoctor(doctor: Omit<Doctor, 'id'>) {
    this.dataService.addDoctor(doctor);
    this.showDoctorForm.set(false);
  }

  onDeleteAppointment(appointmentId: number) {
    this.dataService.deleteAppointment(appointmentId);
  }
  
  toggleAppointmentForm() {
    this.showAppointmentForm.update(val => !val);
  }

  togglePatientForm() {
    this.showPatientForm.update(val => !val);
  }

  toggleDoctorForm() {
    this.showDoctorForm.update(val => !val);
  }

  toggleReportsModal() {
    this.showReportsModal.update(val => !val);
  }

  logout() {
    this.authService.logout();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}