import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patients', component: PatientSearchComponent },
  { path: 'patient/:id', component: PatientDetailComponent },
  { path: 'cas-radio', component: HomeComponent },
  { path: 'worklists', component: HomeComponent },
  { path: 'templates', component: HomeComponent },
  { path: '**', redirectTo: '' }
];