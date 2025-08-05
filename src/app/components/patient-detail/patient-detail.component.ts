import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient, AnatomicalRegion } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { PatientInfoComponent } from '../patients/patient-info/patient-info.component';
import { AnatomyViewComponent } from '../patients/anatomy-view/anatomy-view.component';
import { TimelineComponent } from '../patients/timeline/timeline.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientInfoComponent, AnatomyViewComponent, TimelineComponent],
  template: `
    <div class="patient-detail-container" *ngIf="patient">
      <div class="patient-header">
        <div class="header-left">
          <button class="back-btn" (click)="goBack()">← Retour à la recherche</button>
          <h1>{{ patient.firstName }} {{ patient.lastName }}</h1>
        </div>
        
        <div class="filters">
          <div class="filter-dropdown">
            <button class="filter-btn" (click)="toggleFilters()">
              Filtrer par région anatomique
              <span class="arrow" [class.open]="showFilters">▼</span>
            </button>
            
            <div class="filter-panel" *ngIf="showFilters">
              <div class="filter-controls">
                <input 
                  type="text" 
                  class="search-input" 
                  placeholder="Rechercher une région..."
                  [(ngModel)]="searchTerm"
                  (input)="onSearchChange()"
                >
                <div class="quick-actions">
                  <button class="quick-btn" (click)="selectAll()">Tout cocher</button>
                  <button class="quick-btn" (click)="deselectAll()">Tout décocher</button>
                </div>
              </div>
              
              <div class="filter-sections">
                <div class="filter-section" *ngFor="let sector of getFilteredSectors()">
                  <div class="sector-header">
                    <h4>{{ sector }}</h4>
                    <div class="sector-actions">
                      <button class="sector-btn" (click)="selectSector(sector)">Tout</button>
                      <button class="sector-btn" (click)="deselectSector(sector)">Aucun</button>
                    </div>
                  </div>
                  <div class="filter-options">
                    <label *ngFor="let region of getFilteredRegionsBySector(sector)" class="filter-option">
                      <input 
                        type="checkbox" 
                        [(ngModel)]="region.selected"
                        (change)="onFilterChange()"
                      >
                      <span>{{ region.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="filter-footer">
                <button class="validate-btn" (click)="validateFilters()">Appliquer les filtres</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="patient-content">
        <div class="patient-grid">
          <div class="patient-info-section">
            <app-patient-info [patient]="patient"></app-patient-info>
          </div>
          
          <div class="anatomy-section">
            <app-anatomy-view 
              [patient]="patient" 
              [selectedRegions]="getSelectedRegions()">
            </app-anatomy-view>
          </div>
          
          <div class="timeline-section">
            <app-timeline 
              [patient]="patient" 
              [selectedRegions]="getSelectedRegions()">
            </app-timeline>
          </div>
        </div>
      </div>
    </div>
    
    <div class="not-found" *ngIf="!patient && !loading">
      <h2>Patient non trouvé</h2>
      <button class="back-btn" (click)="goBack()">← Retour à la recherche</button>
    </div>
  `,
  styles: [`
    .patient-detail-container {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }

    .patient-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
      align-self: flex-start;
    }

    .back-btn:hover {
      background: #5a6268;
    }

    .patient-header h1 {
      color: #000;
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .filters {
      position: relative;
    }

    .filter-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .filter-btn:hover {
      background: #0056b3;
    }

    .arrow {
      transition: transform 0.3s;
    }

    .arrow.open {
      transform: rotate(180deg);
    }

    .filter-panel {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 400px;
      max-height: 500px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 0.5rem;
    }

    .filter-controls {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      background: #f8f9fa;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .quick-actions {
      display: flex;
      gap: 0.5rem;
    }

    .quick-btn {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #007bff;
      background: white;
      color: #007bff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s;
    }

    .quick-btn:hover {
      background: #007bff;
      color: white;
    }

    .filter-sections {
      padding: 1rem;
    }

    .filter-section {
      margin-bottom: 1.5rem;
    }

    .filter-section:last-child {
      margin-bottom: 0;
    }

    .sector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .sector-header h4 {
      margin: 0;
      color: #333;
      font-size: 1rem;
      font-weight: 600;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.25rem;
      flex: 1;
    }

    .sector-actions {
      display: flex;
      gap: 0.25rem;
      margin-left: 1rem;
    }

    .sector-btn {
      padding: 0.25rem 0.5rem;
      border: 1px solid #6c757d;
      background: white;
      color: #6c757d;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.7rem;
      transition: all 0.3s;
    }

    .sector-btn:hover {
      background: #6c757d;
      color: white;
    }

    .filter-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.5rem;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 3px;
      transition: background-color 0.2s;
    }

    .filter-option:hover {
      background-color: #f8f9fa;
    }

    .filter-option input[type="checkbox"] {
      margin: 0;
    }

    .filter-footer {
      padding: 1rem;
      border-top: 1px solid #eee;
      background: #f8f9fa;
    }

    .validate-btn {
      width: 100%;
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .validate-btn:hover {
      background: #218838;
    }

    .patient-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .patient-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr;
      gap: 0;
      min-height: 80vh;
    }

    .patient-info-section {
      grid-column: 1;
      grid-row: 1;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .anatomy-section {
      grid-column: 2;
      grid-row: 1;
      border-bottom: 1px solid #eee;
    }

    .timeline-section {
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .not-found {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      gap: 2rem;
    }

    .not-found h2 {
      color: #333;
      font-size: 2rem;
    }

    @media (max-width: 1024px) {
      .patient-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr;
      }

      .patient-info-section {
        grid-column: 1;
        grid-row: 1;
        border-right: none;
      }

      .anatomy-section {
        grid-column: 1;
        grid-row: 2;
      }

      .timeline-section {
        grid-column: 1;
        grid-row: 3;
      }
    }

    @media (max-width: 768px) {
      .patient-detail-container {
        padding: 1rem;
      }

      .patient-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .patient-header h1 {
        font-size: 1.5rem;
        text-align: center;
      }

      .filter-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 500px;
        min-width: auto;
      }

      .filter-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | undefined;
  loading = true;
  anatomicalRegions: AnatomicalRegion[] = [];
  showFilters = false;
  searchTerm = '';
  filteredRegions: AnatomicalRegion[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.patient = this.patientService.getPatientById(patientId);
    }
    this.loading = false;
    
    this.anatomicalRegions = this.patientService.getAnatomicalRegions();
    this.filteredRegions = [...this.anatomicalRegions];
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  validateFilters() {
    this.showFilters = false;
    // Les composants enfants réagiront automatiquement aux changements
  }

  onFilterChange() {
    // Les composants enfants réagiront automatiquement aux changements
  }

  onSearchChange() {
    if (this.searchTerm.trim() === '') {
      this.filteredRegions = [...this.anatomicalRegions];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRegions = this.anatomicalRegions.filter(region =>
        region.name.toLowerCase().includes(term) ||
        region.sector.toLowerCase().includes(term)
      );
    }
  }

  selectAll() {
    this.filteredRegions.forEach(region => {
      const originalRegion = this.anatomicalRegions.find(r => r.id === region.id);
      if (originalRegion) {
        originalRegion.selected = true;
      }
    });
    this.onFilterChange();
  }

  deselectAll() {
    this.filteredRegions.forEach(region => {
      const originalRegion = this.anatomicalRegions.find(r => r.id === region.id);
      if (originalRegion) {
        originalRegion.selected = false;
      }
    });
    this.onFilterChange();
  }

  selectSector(sector: string) {
    this.filteredRegions
      .filter(region => region.sector === sector)
      .forEach(region => {
        const originalRegion = this.anatomicalRegions.find(r => r.id === region.id);
        if (originalRegion) {
          originalRegion.selected = true;
        }
      });
    this.onFilterChange();
  }

  deselectSector(sector: string) {
    this.filteredRegions
      .filter(region => region.sector === sector)
      .forEach(region => {
        const originalRegion = this.anatomicalRegions.find(r => r.id === region.id);
        if (originalRegion) {
          originalRegion.selected = false;
        }
      });
    this.onFilterChange();
  }

  getSectors(): string[] {
    const sectors = [...new Set(this.anatomicalRegions.map(r => r.sector))];
    return sectors.sort();
  }

  getFilteredSectors(): string[] {
    const sectors = [...new Set(this.filteredRegions.map(r => r.sector))];
    return sectors.sort();
  }

  getRegionsBySector(sector: string): AnatomicalRegion[] {
    return this.anatomicalRegions.filter(r => r.sector === sector);
  }

  getFilteredRegionsBySector(sector: string): AnatomicalRegion[] {
    return this.filteredRegions.filter(r => r.sector === sector);
  }

  getSelectedRegions(): AnatomicalRegion[] {
    return this.anatomicalRegions.filter(r => r.selected);
  }
}