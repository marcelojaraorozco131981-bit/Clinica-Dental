import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Appointment } from '../../models/clinic.model';

type ReportPeriod = 'day' | 'week' | 'month' | 'year';

declare const jspdf: any;

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './reports.component.html',
  styles: [`
    @media print {
      body * {
        visibility: hidden;
      }
      .print-container, .print-container * {
        visibility: visible;
      }
      .print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  appointments = input.required<Appointment[]>();
  closeModal = output<void>();

  reportPeriod = signal<ReportPeriod>('day');
  today = new Date();
  private datePipe = inject(DatePipe);

  reportTitle = computed(() => {
    switch(this.reportPeriod()){
      case 'day': return 'Hoy';
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mes';
      case 'year': return 'Este Año';
    }
  });

  filteredAppointments = computed(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day

    const allAppointments = this.appointments().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.startTime.localeCompare(b.startTime));

    switch (this.reportPeriod()) {
      case 'day':
        return allAppointments.filter(app => {
          const appDate = new Date(app.date);
          appDate.setHours(0,0,0,0);
          return appDate.getTime() === now.getTime();
        });

      case 'week': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Week starts on Monday
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return allAppointments.filter(app => {
          const appDate = new Date(app.date);
          return appDate >= startOfWeek && appDate <= endOfWeek;
        });
      }

      case 'month':
        return allAppointments.filter(app => {
          const appDate = new Date(app.date);
          return appDate.getFullYear() === now.getFullYear() && appDate.getMonth() === now.getMonth();
        });

      case 'year':
        return allAppointments.filter(app => {
          const appDate = new Date(app.date);
          return appDate.getFullYear() === now.getFullYear();
        });
        
      default:
        return [];
    }
  });

  setReportPeriod(period: ReportPeriod) {
    this.reportPeriod.set(period);
  }
  
  printReport() {
    window.print();
  }

  exportToPdf() {
    const doc = new jspdf.jsPDF();
    const reportTitleText = `Reporte de Citas - ${this.reportTitle()}`;
    const generatedDate = `Generado el ${this.datePipe.transform(this.today, 'longDate')}`;

    doc.setFontSize(18);
    doc.text(reportTitleText, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(generatedDate, 14, 30);

    const head = [['Fecha', 'Hora', 'Paciente', 'Doctor', 'Motivo']];
    const body = this.filteredAppointments().map(app => [
      this.datePipe.transform(app.date, 'dd/MM/yyyy'),
      app.startTime,
      app.patient?.name || 'N/A',
      app.doctor?.name || 'N/A',
      app.reason
    ]);

    (doc as any).autoTable({
      head: head,
      body: body,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { font: 'helvetica', fontSize: 10 },
    });
    
    const fileName = `reporte_citas_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }

  getButtonClasses(period: ReportPeriod): string {
    const baseClasses = 'px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200';
    if (this.reportPeriod() === period) {
      return `${baseClasses} bg-teal-500 text-white shadow`;
    }
    return `${baseClasses} bg-white text-slate-600 hover:bg-slate-200`;
  }
}