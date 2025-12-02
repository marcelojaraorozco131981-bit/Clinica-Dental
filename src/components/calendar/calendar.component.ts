
import { Component, ChangeDetectionStrategy, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/clinic.model';

interface CalendarDay {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  hasAppointment: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  appointments = input.required<Appointment[]>();
  dateSelected = output<Date>();

  currentDate = signal(new Date());
  selectedDate = signal(new Date());

  readonly weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  readonly year = computed(() => this.currentDate().getFullYear());
  readonly month = computed(() => this.currentDate().getMonth());
  readonly monthName = computed(() => this.currentDate().toLocaleDateString('es-ES', { month: 'long' }));
  
  readonly daysInMonth = computed(() => new Date(this.year(), this.month() + 1, 0).getDate());
  readonly firstDayOfMonth = computed(() => new Date(this.year(), this.month(), 1).getDay());
  
  readonly appointmentDates = computed(() => {
    const dates = new Set<string>();
    this.appointments().forEach(app => {
        const d = new Date(app.date);
        dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return dates;
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const today = new Date();
    const days: CalendarDay[] = [];
    const appointmentDatesSet = this.appointmentDates();

    for (let i = 1; i <= this.daysInMonth(); i++) {
        const date = new Date(this.year(), this.month(), i);
        const isToday = today.getFullYear() === date.getFullYear() &&
                        today.getMonth() === date.getMonth() &&
                        today.getDate() === date.getDate();
        const isSelected = this.selectedDate().getFullYear() === date.getFullYear() &&
                           this.selectedDate().getMonth() === date.getMonth() &&
                           this.selectedDate().getDate() === date.getDate();
        const hasAppointment = appointmentDatesSet.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
        
        days.push({ day: i, isToday, isSelected, hasAppointment });
    }
    return days;
  });

  changeMonth(delta: number) {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  }

  selectDate(day: number) {
    const newSelectedDate = new Date(this.year(), this.month(), day);
    this.selectedDate.set(newSelectedDate);
    this.dateSelected.emit(newSelectedDate);
  }

  getDayClasses(day: CalendarDay): string {
    let classes = '';
    if (day.isSelected) {
      classes += 'bg-cyan-500 text-white border-cyan-500 font-bold ';
    } else if (day.isToday) {
      classes += 'bg-slate-100 text-cyan-600 border-cyan-300 ';
    } else {
      classes += 'border-transparent hover:bg-slate-100 hover:border-slate-200 ';
    }
    return classes;
  }
}
