import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from 'https://esm.sh/@angular/common/locales/es';
import { AppComponent } from './src/app.component';

registerLocaleData(localeEs, 'es-ES');

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.