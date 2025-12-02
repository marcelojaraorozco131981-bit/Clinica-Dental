import { Component, ChangeDetectionStrategy, output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../models/clinic.model';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorFormComponent implements OnInit {
  doctorAdded = output<Omit<Doctor, 'id'>>();
  closeModal = output<void>();

  private fb = inject(FormBuilder);
  doctorForm!: FormGroup;

  ngOnInit() {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      specialty: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.doctorAdded.emit(this.doctorForm.value);
      this.doctorForm.reset();
    }
  }
}