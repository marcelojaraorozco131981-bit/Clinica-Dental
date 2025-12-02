import { Component, ChangeDetectionStrategy, input, output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient, Appointment, Doctor } from '../../models/clinic.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent implements OnInit {
  patients = input.required<Patient[]>();
  doctors = input.required<Doctor[]>();
  selectedDate = input.required<Date>();
  patientId = input<number | undefined>();
  appointmentAdded = output<Omit<Appointment, 'id' | 'patient' | 'doctor'>>();
  closeModal = output<void>();

  private fb = inject(FormBuilder);
  appointmentForm!: FormGroup;

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['09:30', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(3)]]
    }, { validators: this.timeRangeValidator });

    if (this.patientId()) {
      this.appointmentForm.patchValue({ patientId: this.patientId() });
      this.appointmentForm.get('patientId')?.disable();
    }
  }

  timeRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    if (startTime && endTime && startTime >= endTime) {
      return { timeRange: true };
    }
    return null;
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.getRawValue();
      this.appointmentAdded.emit({
        patientId: +formValue.patientId,
        doctorId: +formValue.doctorId,
        date: this.selectedDate().toISOString(),
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        reason: formValue.reason
      });
      this.appointmentForm.reset({ 
        patientId: this.patientId() ? this.patientId() : '',
        doctorId: '',
        startTime: '09:00',
        endTime: '09:30',
        reason: ''
      });
    }
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