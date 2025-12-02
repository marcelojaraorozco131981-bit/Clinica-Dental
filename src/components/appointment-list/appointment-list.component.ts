
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/clinic.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentListComponent {
  appointments = input.required<Appointment[]>();
  deleteAppointment = output<number>();
}
