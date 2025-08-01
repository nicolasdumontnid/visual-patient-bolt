import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="patient-info-card">
      <h2>Informations Patient</h2>
      
      <div class="info-grid">
        <div class="info-section">
          <h3>Identité</h3>
          <div class="info-row">
            <label>Nom:</label>
            <span>{{ patient.lastName }}</span>
          </div>
          <div class="info-row">
            <label>Prénom:</label>
            <span>{{ patient.firstName }}</span>
          </div>
          <div class="info-row">
            <label>Genre:</label>
            <span>{{ patient.gender === 'M' ? 'Masculin' : 'Féminin' }}</span>
          </div>
          <div class="info-row">
            <label>Date de naissance:</label>
            <span>{{ patient.birthDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-row">
            <label>Âge:</label>
            <span>{{ patient.age }} ans</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Données médicales</h3>
          <div class="info-row">
            <label>Groupe sanguin:</label>
            <span>{{ patient.bloodType }}</span>
          </div>
          <div class="info-row">
            <label>Taille:</label>
            <span>{{ patient.height }} cm</span>
          </div>
          <div class="info-row">
            <label>Poids:</label>
            <span>{{ patient.weight }} kg</span>
          </div>
          <div class="info-row">
            <label>IMC:</label>
            <span>{{ calculateBMI() | number:'1.1-1' }}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Allergies</h3>
          <div class="tags">
            <span class="tag allergy" *ngFor="let allergy of patient.allergies">
              {{ allergy }}
            </span>
          </div>
        </div>

        <div class="info-section">
          <h3>Traitements en cours</h3>
          <div class="tags">
            <span class="tag treatment" *ngFor="let treatment of patient.currentTreatments">
              {{ treatment }}
            </span>
          </div>
        </div>

        <div class="info-section">
          <h3>Contact d'urgence</h3>
          <div class="info-row">
            <label>Nom:</label>
            <span>{{ patient.emergencyContact.name }}</span>
          </div>
          <div class="info-row">
            <label>Relation:</label>
            <span>{{ patient.emergencyContact.relationship }}</span>
          </div>
          <div class="info-row">
            <label>Téléphone:</label>
            <span>{{ patient.emergencyContact.phone }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patient-info-card {
      padding: 1.5rem;
      height: 100%;
      overflow-y: auto;
    }

    .patient-info-card h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
      border-bottom: 2px solid #007bff;
      padding-bottom: 0.5rem;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-section {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
    }

    .info-section h3 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1rem;
      font-weight: 600;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      padding: 0.25rem 0;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-row label {
      font-weight: 500;
      color: #6c757d;
      flex: 0 0 40%;
    }

    .info-row span {
      color: #333;
      flex: 1;
      text-align: right;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .tag.allergy {
      background: #ffe6e6;
      color: #d63384;
      border: 1px solid #f5c2c7;
    }

    .tag.treatment {
      background: #e6f3ff;
      color: #0d6efd;
      border: 1px solid #b6d4fe;
    }

    @media (max-width: 768px) {
      .patient-info-card {
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
    }
  `]
})
export class PatientInfoComponent {
  @Input() patient!: Patient;

  calculateBMI(): number {
    const heightInMeters = this.patient.height / 100;
    return this.patient.weight / (heightInMeters * heightInMeters);
  }
}