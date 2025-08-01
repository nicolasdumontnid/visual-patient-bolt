import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient, AnatomicalRegion, MedicalExam } from '../../../models/patient.model';

@Component({
  selector: 'app-anatomy-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="anatomy-view-card">
      <h2>Vue Anatomique</h2>
      
      <div class="anatomy-container">
        <div class="body-diagram" [class]="patient.gender === 'F' ? 'female' : 'male'">
          <!-- SVG du corps humain -->
          <svg viewBox="0 0 200 400" class="body-svg">
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
  
  selectedRegion = '';
  selectedRegionExams: MedicalExam[] = [];

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
}