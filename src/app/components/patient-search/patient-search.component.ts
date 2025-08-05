import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

type ViewMode = 'cards' | 'table';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h1>Visual Patient</h1>
        
        <div class="search-section">
          <div class="search-bar">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Rechercher un patient (nom, prénom, numéro...)"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            >
            <button class="search-btn" (click)="onSearch()">
              Rechercher
            </button>
          </div>
          
          <div class="view-controls">
            <button 
              class="view-btn"
              [class.active]="viewMode === 'cards'"
              (click)="setViewMode('cards')"
            >
              Cartes
            </button>
            <button 
              class="view-btn"
              [class.active]="viewMode === 'table'"
              (click)="setViewMode('table')"
            >
              Tableau
            </button>
          </div>
        </div>
      </div>
      
      <div class="results-section">
        <!-- Vue en cartes -->
        <div class="cards-view" *ngIf="viewMode === 'cards'">
          <div class="patient-card" *ngFor="let patient of searchResults" (click)="selectPatient(patient)">
            <div class="card-header">
              <h3>{{ patient.firstName }} {{ patient.lastName }}</h3>
              <span class="patient-id">ID: {{ patient.id }}</span>
            </div>
            
            <div class="card-body">
              <div class="patient-info">
                <div class="info-row">
                  <span class="label">Genre:</span>
                  <span>{{ patient.gender === 'M' ? 'Masculin' : 'Féminin' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Âge:</span>
                  <span>{{ patient.age }} ans</span>
                </div>
                <div class="info-row">
                  <span class="label">Groupe sanguin:</span>
                  <span>{{ patient.bloodType }}</span>
                </div>
              </div>
              
              <div class="last-exam" *ngIf="getLastExam(patient) as lastExam">
                <h4>Dernier examen</h4>
                <div class="exam-info">
                  <span class="exam-title">{{ lastExam.title }}</span>
                  <span class="exam-date">{{ lastExam.date | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Vue en tableau -->
        <div class="table-view" *ngIf="viewMode === 'table'">
          <table class="patients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Genre</th>
                <th>Âge</th>
                <th>Groupe sanguin</th>
                <th>Dernier examen</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let patient of searchResults" (click)="selectPatient(patient)">
                <td>{{ patient.id }}</td>
                <td>{{ patient.lastName }}</td>
                <td>{{ patient.firstName }}</td>
                <td>{{ patient.gender === 'M' ? 'M' : 'F' }}</td>
                <td>{{ patient.age }}</td>
                <td>{{ patient.bloodType }}</td>
                <td>{{ getLastExam(patient)?.title ?? '-' }}</td>
                <td>{{ (getLastExam(patient)?.date | date:'dd/MM/yyyy') ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="no-results" *ngIf="searchResults.length === 0 && searchQuery.trim() !== ''">
          <p>Aucun patient trouvé pour "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }

    .search-header {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .search-header h1 {
      color: #000;
      margin: 0 0 2rem 0;
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
    }

    .search-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .search-bar {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      border-color: #007bff;
      outline: none;
    }

    .search-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .search-btn:hover {
      background: #0056b3;
    }

    .view-controls {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .view-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #dee2e6;
      background: white;
      color: #495057;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .view-btn:hover {
      background: #f8f9fa;
    }

    .view-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .results-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    /* Vue en cartes */
    .cards-view {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .patient-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .patient-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #dee2e6;
    }

    .card-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
    }

    .patient-id {
      color: #6c757d;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .patient-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-row .label {
      font-weight: 500;
      color: #6c757d;
    }

    .last-exam {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .last-exam h4 {
      margin: 0 0 0.5rem 0;
      color: #495057;
      font-size: 1rem;
    }

    .exam-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .exam-title {
      font-weight: 500;
      color: #333;
    }

    .exam-date {
      color: #6c757d;
      font-size: 0.9rem;
    }

    /* Vue en tableau */
    .table-view {
      overflow-x: auto;
    }

    .patients-table {
      width: 100%;
      border-collapse: collapse;
    }

    .patients-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    .patients-table td {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      color: #333;
    }

    .patients-table tbody tr {
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .patients-table tbody tr:hover {
      background: #f8f9fa;
    }

    .patients-table tbody tr:nth-child(even) {
      background: #f8f9fa;
    }

    .patients-table tbody tr:nth-child(even):hover {
      background: #e9ecef;
    }

    .no-results {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .search-container {
        padding: 1rem;
      }

      .search-header {
        padding: 1.5rem;
      }

      .search-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .cards-view {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .patients-table {
        font-size: 0.9rem;
      }

      .patients-table th,
      .patients-table td {
        padding: 0.75rem 0.5rem;
      }
    }
  `]
})
export class PatientSearchComponent implements OnInit {
  searchQuery = '';
  searchResults: Patient[] = [];
  viewMode: ViewMode = 'cards';

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchResults = this.patientService.getAllPatients();
  }

  onSearch() {
    this.searchResults = this.patientService.searchPatients(this.searchQuery);
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
  }

  selectPatient(patient: Patient) {
    this.router.navigate(['/patient', patient.id]);
  }

  getLastExam(patient: Patient) {
    if (patient.medicalHistory.length === 0) return null;
    
    return patient.medicalHistory.reduce((latest, exam) => 
      exam.date > latest.date ? exam : latest
    );
  }
}