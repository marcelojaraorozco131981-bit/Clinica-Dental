import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  loginForm!: FormGroup;
  loginError = signal<string | null>(null);

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['admin@dental.com', [Validators.required, Validators.email]],
      password: ['password123', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = this.authService.login(email, password);
      if (!success) {
        this.loginError.set('Credenciales incorrectas. Por favor, intente de nuevo.');
      } else {
        this.loginError.set(null);
      }
    }
  }
}
