import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalExam } from '../../../../models/patient.model';

@Component({
  selector: 'app-exam-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 *ngIf="exam">{{ exam.title }}</h2>
          <h2 *ngIf="!exam && dayExams.length > 0">Examens du {{ dayExams[0].date | date:'dd/MM/yyyy' }}</h2>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>
        
        <!-- Examen unique -->
        <div class="modal-body" *ngIf="exam">
          <div class="exam-info">
            <div class="info-row">
              <label>Date:</label>
              <span>{{ exam.date | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-row">
              <label>Région anatomique:</label>
              <span>{{ exam.anatomicalRegion }}</span>
            </div>
            <div class="info-row">
              <label>Secteur médical:</label>
              <span>{{ exam.medicalSector }}</span>
            </div>
            <div class="info-row">
              <label>Diagnostic:</label>
              <span class="diagnosis" [class]="'diagnosis-' + exam.diagnosis">
                {{ getDiagnosisText(exam.diagnosis) }}
              </span>
            </div>
            <div class="info-row">
              <label>Gravité:</label>
              <span class="severity" [class]="'severity-' + exam.severity">
                {{ getSeverityText(exam.severity) }}
              </span>
            </div>
            <div class="info-row" *ngIf="exam.doctor">
              <label>Médecin:</label>
              <span>Dr. {{ exam.doctor }}</span>
            </div>
          </div>
          
          <div class="exam-summary">
            <h3>Résumé</h3>
            <p>{{ exam.summary }}</p>
          </div>
          
          <div class="exam-report">
            <h3>Compte rendu complet</h3>
            <p>{{ exam.fullReport }}</p>
          </div>
          
          <div class="exam-tags" *ngIf="exam.tags.length > 0">
            <h3>Tags</h3>
            <div class="tags">
              <span class="tag" *ngFor="let tag of exam.tags">{{ tag }}</span>
            </div>
          </div>
        </div>
        
        <!-- Examens multiples avec onglets -->
        <div class="modal-body" *ngIf="!exam && dayExams.length > 0">
          <div class="tabs-container">
            <div class="tabs-header">
              <button 
                *ngFor="let dayExam of dayExams; let i = index"
                class="tab-btn"
                [class.active]="activeTab === i"
                (click)="setActiveTab(i)">
                {{ dayExam.title }}
              </button>
            </div>
            
            <div class="tab-content" *ngFor="let dayExam of dayExams; let i = index" [class.active]="activeTab === i">
              <div class="exam-info">
                <div class="info-row">
                  <label>Date:</label>
                  <span>{{ dayExam.date | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="info-row">
                  <label>Région anatomique:</label>
                  <span>{{ dayExam.anatomicalRegion }}</span>
                </div>
                <div class="info-row">
                  <label>Secteur médical:</label>
                  <span>{{ dayExam.medicalSector }}</span>
                </div>
                <div class="info-row">
                  <label>Diagnostic:</label>
                  <span class="diagnosis" [class]="'diagnosis-' + dayExam.diagnosis">
                    {{ getDiagnosisText(dayExam.diagnosis) }}
                  </span>
                </div>
                <div class="info-row">
                  <label>Gravité:</label>
                  <span class="severity" [class]="'severity-' + dayExam.severity">
                    {{ getSeverityText(dayExam.severity) }}
                  </span>
                </div>
                <div class="info-row" *ngIf="dayExam.doctor">
                  <label>Médecin:</label>
                  <span>Dr. {{ dayExam.doctor }}</span>
                </div>
              </div>
              
              <div class="exam-summary">
                <h3>Résumé</h3>
                <p>{{ dayExam.summary }}</p>
              </div>
              
              <div class="exam-report">
                <h3>Compte rendu complet</h3>
                <p>{{ dayExam.fullReport }}</p>
              </div>
              
              <div class="exam-tags" *ngIf="dayExam.tags.length > 0">
                <h3>Tags</h3>
                <div class="tags">
                  <span class="tag" *ngFor="let tag of dayExam.tags">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="close-footer-btn" (click)="onClose()">Fermer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      background: #f8f9fa;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6c757d;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #e9ecef;
      color: #495057;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .tabs-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
      white-space: nowrap;
      font-size: 0.9rem;
    }

    .tab-btn:hover {
      background: #f8f9fa;
    }

    .tab-btn.active {
      border-bottom-color: #007bff;
      color: #007bff;
      font-weight: 600;
    }

    .tab-content {
      display: none;
      flex: 1;
      overflow-y: auto;
    }

    .tab-content.active {
      display: block;
    }

    .exam-info {
      margin-bottom: 2rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row label {
      font-weight: 600;
      color: #495057;
      flex: 0 0 40%;
    }

    .info-row span {
      color: #333;
      flex: 1;
      text-align: right;
    }

    .diagnosis.diagnosis-positive {
      color: #d32f2f;
      font-weight: 600;
    }

    .diagnosis.diagnosis-negative {
      color: #2e7d32;
      font-weight: 600;
    }

    .diagnosis.diagnosis-pending {
      color: #f57c00;
      font-weight: 600;
    }

    .severity.severity-low {
      color: #2e7d32;
      font-weight: 600;
    }

    .severity.severity-high {
      color: #d32f2f;
      font-weight: 600;
    }

    .exam-summary, .exam-report, .exam-tags {
      margin-bottom: 2rem;
    }

    .exam-summary h3, .exam-report h3, .exam-tags h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
      border-bottom: 2px solid #007bff;
      padding-bottom: 0.5rem;
    }

    .exam-summary p, .exam-report p {
      line-height: 1.6;
      color: #495057;
      margin: 0;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #dee2e6;
      background: #f8f9fa;
      display: flex;
      justify-content: flex-end;
    }

    .close-footer-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }

    .close-footer-btn:hover {
      background: #5a6268;
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 0.5rem;
      }

      .modal-content {
        max-height: 95vh;
      }

      .modal-header, .modal-body, .modal-footer {
        padding: 1rem;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .info-row label {
        flex: none;
      }

      .info-row span {
        text-align: left;
      }

      .tabs-header {
        flex-wrap: wrap;
      }

      .tab-btn {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
})
export class ExamModalComponent {
  @Input() exam: MedicalExam | null = null;
  @Input() dayExams: MedicalExam[] = [];
  @Output() close = new EventEmitter<void>();

  activeTab = 0;

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  onClose() {
    this.close.emit();
  }

  getDiagnosisText(diagnosis: string): string {
    switch (diagnosis) {
      case 'positive': return 'Positif';
      case 'negative': return 'Négatif';
      case 'pending': return 'En attente';
      default: return diagnosis;
    }
  }

  getSeverityText(severity: string): string {
    switch (severity) {
      case 'low': return 'Faible';
      case 'high': return 'Importante';
      default: return severity;
    }
  }
}