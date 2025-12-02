
import { Component, ChangeDetectionStrategy, output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../../models/clinic.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientFormComponent implements OnInit {
  patientAdded = output<Omit<Patient, 'id'>>();
  closeModal = output<void>();

  private fb = inject(FormBuilder);
  patientForm!: FormGroup;

  ngOnInit() {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.patientAdded.emit(this.patientForm.value);
      this.patientForm.reset();
    }
  }
}
