import { Injectable, signal, inject } from '@angular/core';
import { DataService } from './data.service';

interface User {
  id: number;
  email: string;
  role: 'admin' | 'patient';
  patientId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dataService = inject(DataService);
  currentUser = signal<User | null>(null);

  constructor() {}

  login(email: string, password: string): boolean {
    // 1. Check for admin user
    if (email === 'admin@dental.com' && password === 'password123') {
      this.currentUser.set({ id: 1, email: email, role: 'admin' });
      return true;
    }

    // 2. Check for patient user
    const patients = this.dataService.patients();
    const patientUser = patients.find(p => p.email === email && p.password === password);

    if (patientUser) {
      this.currentUser.set({ 
        id: patientUser.id, 
        email: patientUser.email, 
        role: 'patient',
        patientId: patientUser.id
      });
      return true;
    }

    return false;
  }

  logout() {
    this.currentUser.set(null);
  }
}