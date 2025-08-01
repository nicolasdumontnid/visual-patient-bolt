import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PatientsComponent } from './components/patients/patients.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'cas-radio', component: HomeComponent },
  { path: 'worklists', component: HomeComponent },
  { path: 'templates', component: HomeComponent },
  { path: '**', redirectTo: '' }
];