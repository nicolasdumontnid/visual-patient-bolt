import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Patient, AnatomicalRegion, MedicalExam } from '../../../models/patient.model';

@Component({
  selector: 'app-anatomy-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="anatomy-view-card">
      <h2>Vue Anatomique</h2>
      
      <div class="anatomy-controls">
        <label class="organs-toggle">
          <input type="checkbox" [(ngModel)]="showOrgans" (change)="onToggleOrgans()">
          <span>Afficher les organes</span>
        </label>
      </div>
      
      <div class="anatomy-container">
        <div class="body-diagram" [class]="patient.gender === 'F' ? 'female' : 'male'">
          <!-- SVG du corps humain -->
          <svg viewBox="0 0 200 400" class="body-svg" [class.show-organs]="showOrgans">
            <!-- Tête -->
            <circle cx="100" cy="40" r="25" 
                    class="body-part head"
                    [class.has-exam]="hasExamForRegion('Tête')"
                    [class.selected]="isRegionSelected('Tête')"
                    (click)="showExamsForRegion('Tête')">
            </circle>
            
            <!-- Cou -->
            <rect x="85" y="65" width="30" height="15" 
                  class="body-part neck"
                  [class.has-exam]="hasExamForRegion('Cou')"
                  [class.selected]="isRegionSelected('Cou')"
                  (click)="showExamsForRegion('Cou')">
            </rect>
            
            <!-- Thorax -->
            <ellipse cx="100" cy="120" rx="40" ry="30" 
                     class="body-part chest"
                     [class.has-exam]="hasExamForRegion('Poumons')"
                     [class.selected]="isRegionSelected('Poumons')"
                     (click)="showExamsForRegion('Poumons')">
            </ellipse>
            
            <!-- Cœur -->
            <path d="M85 110 Q90 100 100 110 Q110 100 115 110 Q110 125 100 135 Q90 125 85 110 Z" 
                  class="body-part heart"
                  [class.has-exam]="hasExamForRegion('Cœur')"
                  [class.selected]="isRegionSelected('Cœur')"
                  (click)="showExamsForRegion('Cœur')">
            </path>
            
            <!-- Abdomen -->
            <ellipse cx="100" cy="180" rx="35" ry="25" 
                     class="body-part abdomen"
                     [class.has-exam]="hasExamForRegion('Abdomen') || hasExamForRegion('Foie')"
                     [class.selected]="isRegionSelected('Abdomen') || isRegionSelected('Foie')"
                     (click)="showExamsForRegion('Abdomen')">
            </ellipse>
            
            <!-- Bras gauche -->
            <rect x="50" y="100" width="15" height="80" 
                  class="body-part arm-left"
                  [class.has-exam]="hasExamForRegion('Bras')"
                  [class.selected]="isRegionSelected('Bras')"
                  (click)="showExamsForRegion('Bras')">
            </rect>
            
            <!-- Bras droit -->
            <rect x="135" y="100" width="15" height="80" 
                  class="body-part arm-right"
                  [class.has-exam]="hasExamForRegion('Bras')"
                  [class.selected]="isRegionSelected('Bras')"
                  (click)="showExamsForRegion('Bras')">
            </rect>
            
            <!-- Jambe gauche -->
            <rect x="75" y="220" width="20" height="100" 
                  class="body-part leg-left"
                  [class.has-exam]="hasExamForRegion('Jambes')"
                  [class.selected]="isRegionSelected('Jambes')"
                  (click)="showExamsForRegion('Jambes')">
            </rect>
            
            <!-- Jambe droite -->
            <rect x="105" y="220" width="20" height="100" 
                  class="body-part leg-right"
                  [class.has-exam]="hasExamForRegion('Jambes')"
                  [class.selected]="isRegionSelected('Jambes')"
                  (click)="showExamsForRegion('Jambes')">
            </rect>
            
            <!-- Colonne vertébrale -->
            <line x1="100" y1="65" x2="100" y2="220" 
                  class="body-part spine"
                  [class.has-exam]="hasExamForRegion('Colonne vertébrale')"
                  [class.selected]="isRegionSelected('Colonne vertébrale')"
                  (click)="showExamsForRegion('Colonne vertébrale')">
            </line>
            
            <!-- Organes (visibles seulement si showOrgans est true) -->
            <g class="organs" [style.opacity]="showOrgans ? 1 : 0">
              <!-- Cerveau -->
              <ellipse cx="100" cy="35" rx="20" ry="15" 
                       class="organ brain"
                       [class.has-exam]="hasExamForRegion('Cerveau')"
                       [class.selected]="isRegionSelected('Cerveau')"
                       (click)="showExamsForRegion('Cerveau')">
              </ellipse>
              
              <!-- Foie -->
              <ellipse cx="110" cy="160" rx="25" ry="20" 
                       class="organ liver"
                       [class.has-exam]="hasExamForRegion('Foie')"
                       [class.selected]="isRegionSelected('Foie')"
                       (click)="showExamsForRegion('Foie')">
              </ellipse>
              
              <!-- Reins -->
              <ellipse cx="85" cy="190" rx="8" ry="15" 
                       class="organ kidney"
                       [class.has-exam]="hasExamForRegion('Reins')"
                       [class.selected]="isRegionSelected('Reins')"
                       (click)="showExamsForRegion('Reins')">
              </ellipse>
              <ellipse cx="115" cy="190" rx="8" ry="15" 
                       class="organ kidney"
                       [class.has-exam]="hasExamForRegion('Reins')"
                       [class.selected]="isRegionSelected('Reins')"
                       (click)="showExamsForRegion('Reins')">
              </ellipse>
            </g>
            
            <!-- Badges d'examens -->
            <g class="exam-badges">
              <g *ngFor="let region of getRegionsWithExams()" 
                 [attr.transform]="'translate(' + getRegionPosition(region.name).x + ',' + getRegionPosition(region.name).y + ')'">
                <circle r="8" 
                        [attr.fill]="getRegionColor(region.name)"
                        class="exam-badge"
                        (click)="showExamsForRegion(region.name)">
                </circle>
                <text text-anchor="middle" 
                      dy="4" 
                      class="badge-text"
                      (click)="showExamsForRegion(region.name)">
                  {{ getExamCountForRegion(region.name) }}
                </text>
              </g>
            </g>
          </svg>
        </div>
        
        <div class="exam-indicators" *ngIf="selectedRegionExams.length > 0">
          <h3>Examens - {{ selectedRegion }}</h3>
          <div class="exam-list">
            <div class="exam-indicator" *ngFor="let exam of selectedRegionExams"
                 [class]="'diagnosis-' + exam.diagnosis">
              <div class="exam-dot"></div>
              <span class="exam-title">{{ exam.title }}</span>
              <span class="exam-date">{{ exam.date | date:'dd/MM/yy' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .anatomy-view-card {
      padding: 1.5rem;
      height: 100%;
      overflow-y: auto;
    }

    .anatomy-view-card h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
      border-bottom: 2px solid #28a745;
      padding-bottom: 0.5rem;
    }

    .anatomy-controls {
      margin-bottom: 1rem;
    }

    .organs-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #495057;
    }

    .organs-toggle input[type="checkbox"] {
      margin: 0;
    }

    .anatomy-container {
      display: flex;
      gap: 1rem;
      height: calc(100% - 4rem);
    }

    .body-diagram {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }

    .body-svg {
      width: 100%;
      max-width: 200px;
      height: auto;
      cursor: pointer;
    }

    .body-part {
      fill: #e9ecef;
      stroke: #6c757d;
      stroke-width: 1;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .body-part:hover {
      fill: #dee2e6;
      stroke: #495057;
      stroke-width: 2;
    }

    .body-part.has-exam {
      fill: #ffeaa7;
      stroke: #fdcb6e;
    }

    .body-part.has-exam:hover {
      fill: #fdcb6e;
      stroke: #e17055;
    }

    .body-part.selected {
      fill: #74b9ff;
      stroke: #0984e3;
      stroke-width: 2;
    }

    .spine {
      stroke-width: 3;
      fill: none;
    }

    .organs {
      transition: opacity 0.3s ease;
    }

    .organ {
      fill: rgba(255, 0, 0, 0.3);
      stroke: #dc3545;
      stroke-width: 1;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .organ.brain {
      fill: rgba(255, 192, 203, 0.5);
      stroke: #e91e63;
    }

    .organ.liver {
      fill: rgba(139, 69, 19, 0.5);
      stroke: #8b4513;
    }

    .organ.kidney {
      fill: rgba(128, 0, 128, 0.5);
      stroke: #800080;
    }

    .organ:hover {
      fill-opacity: 0.7;
      stroke-width: 2;
    }

    .exam-badges {
      pointer-events: all;
    }

    .exam-badge {
      cursor: pointer;
      stroke: white;
      stroke-width: 2;
      transition: all 0.3s ease;
    }

    .exam-badge:hover {
      r: 10;
      stroke-width: 3;
    }

    .badge-text {
      fill: white;
      font-size: 10px;
      font-weight: bold;
      cursor: pointer;
      pointer-events: none;
    }

    .exam-indicators {
      flex: 1;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      max-height: 100%;
      overflow-y: auto;
    }

    .exam-indicators h3 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1rem;
      font-weight: 600;
    }

    .exam-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .exam-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .exam-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .diagnosis-positive .exam-dot {
      background: #dc3545;
    }

    .diagnosis-negative .exam-dot {
      background: #28a745;
    }

    .diagnosis-pending .exam-dot {
      background: #ffc107;
    }

    .exam-title {
      flex: 1;
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    .exam-date {
      color: #6c757d;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .anatomy-container {
        flex-direction: column;
        height: auto;
      }

      .body-diagram {
        min-height: 300px;
      }

      .exam-indicators {
        max-height: 200px;
      }
    }
  `]
})
export class AnatomyViewComponent {
  @Input() patient!: Patient;
  @Input() selectedRegions: AnatomicalRegion[] = [];
  
  showOrgans = false;
  selectedRegion = '';
  selectedRegionExams: MedicalExam[] = [];

  onToggleOrgans() {
    // Logique pour afficher/masquer les organes
  }

  hasExamForRegion(regionName: string): boolean {
    return this.patient.medicalHistory.some(exam => 
      exam.anatomicalRegion === regionName && 
      this.isRegionSelected(regionName)
    );
  }

  isRegionSelected(regionName: string): boolean {
    return this.selectedRegions.some(region => region.name === regionName);
  }

  showExamsForRegion(regionName: string) {
    if (!this.isRegionSelected(regionName)) return;
    
    this.selectedRegion = regionName;
    this.selectedRegionExams = this.patient.medicalHistory.filter(exam => 
      exam.anatomicalRegion === regionName
    );
  }

  getRegionsWithExams(): { name: string }[] {
    const regionsWithExams = new Set<string>();
    this.patient.medicalHistory.forEach(exam => {
      if (this.isRegionSelected(exam.anatomicalRegion)) {
        regionsWithExams.add(exam.anatomicalRegion);
      }
    });
    return Array.from(regionsWithExams).map(name => ({ name }));
  }

  getExamCountForRegion(regionName: string): number {
    return this.patient.medicalHistory.filter(exam => 
      exam.anatomicalRegion === regionName && this.isRegionSelected(regionName)
    ).length;
  }

  getRegionPosition(regionName: string): { x: number, y: number } {
    const positions: { [key: string]: { x: number, y: number } } = {
      'Tête': { x: 100, y: 20 },
      'Cou': { x: 100, y: 55 },
      'Cerveau': { x: 120, y: 35 },
      'Poumons': { x: 80, y: 120 },
      'Cœur': { x: 120, y: 110 },
      'Foie': { x: 130, y: 160 },
      'Abdomen': { x: 80, y: 180 },
      'Reins': { x: 70, y: 190 },
      'Bras': { x: 40, y: 140 },
      'Jambes': { x: 80, y: 260 },
      'Colonne vertébrale': { x: 120, y: 140 },
      'Genou': { x: 90, y: 280 },
      'Yeux': { x: 120, y: 30 },
      'Oreilles': { x: 75, y: 40 },
      'Poignet': { x: 30, y: 180 },
      'Cheville': { x: 90, y: 320 }
    };
    return positions[regionName] || { x: 100, y: 200 };
  }

  getRegionColor(regionName: string): string {
    const colors: { [key: string]: string } = {
      'Neurologie': '#9c27b0',
      'Cardiologie': '#f44336',
      'Pneumologie': '#2196f3',
      'Gastroentérologie': '#ff9800',
      'Néphrologie': '#4caf50',
      'Orthopédie': '#795548',
      'Ophtalmologie': '#00bcd4',
      'ORL': '#ffeb3b',
      'Gynécologie': '#e91e63'
    };
    
    // Trouver le secteur de la région
    const region = this.selectedRegions.find(r => r.name === regionName);
    return colors[region?.sector || 'Orthopédie'] || '#607d8b';
  }
}