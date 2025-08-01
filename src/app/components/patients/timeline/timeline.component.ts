import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Patient, AnatomicalRegion, MedicalExam } from '../../../models/patient.model';
import { ExamModalComponent } from './exam-modal/exam-modal.component';

type TimelineView = 'vertical' | 'horizontal' | 'calendar';
type SortOrder = 'date-asc' | 'date-desc' | 'sector' | 'diagnosis';

interface CalendarDay {
  number: number;
  isCurrentMonth: boolean;
  exams: MedicalExam[];
  date: Date;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, ExamModalComponent],
  template: `
    <div class="timeline-card">
      <div class="timeline-header">
        <h2>Historique Médical</h2>
        
        <div class="timeline-controls">
          <div class="view-buttons">
            <button 
              class="view-btn"
              [class.active]="currentView === 'vertical'"
              (click)="setView('vertical')"
            >
              Vertical
            </button>
            <button 
              class="view-btn"
              [class.active]="currentView === 'horizontal'"
              (click)="setView('horizontal')"
            >
              Horizontal
            </button>
            <button 
              class="view-btn"
              [class.active]="currentView === 'calendar'"
              (click)="setView('calendar')"
            >
              CalendrieR
            </button>
          </div>
          
          <select class="sort-select" [(ngModel)]="sortOrder" (change)="sortExams()">
            <option value="date-desc">Date (récent)</option>
            <option value="date-asc">Date (ancien)</option>
            <option value="sector">Secteur médical</option>
            <option value="diagnosis">Diagnostic</option>
          </select>
        </div>
      </div>
      
      <!-- Vue Verticale -->
      <div class="timeline-content" *ngIf="currentView === 'vertical'">
        <div class="vertical-timeline">
          <div class="exam-card" *ngFor="let exam of filteredExams" (click)="openExamModal(exam)">
            <div class="exam-header">
              <h3>{{ exam.title }}</h3>
              <span class="exam-date">{{ exam.date | date:'dd/MM/yyyy' }}</span>
            </div>
            
            <div class="exam-tags">
              <span class="tag region">{{ exam.anatomicalRegion }}</span>
              <span class="tag diagnosis" [class]="'diagnosis-' + exam.diagnosis">
                {{ getDiagnosisText(exam.diagnosis) }}
              </span>
              <span class="tag severity" [class]="'severity-' + exam.severity">
                {{ getSeverityText(exam.severity) }}
              </span>
            </div>
            
            <h4 class="exam-summary">{{ exam.summary }}</h4>
            <p class="exam-report">{{ getExcerpt(exam.fullReport) }}</p>
            <button class="see-more-btn" (click)="$event.stopPropagation(); openExamModal(exam)">Voir plus</button>
            
            <div class="exam-doctor" *ngIf="exam.doctor">
              <span>Dr. {{ exam.doctor }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vue Horizontale -->
      <div class="timeline-content" *ngIf="currentView === 'horizontal'">
        <div class="horizontal-timeline">
          <div class="timeline-grid">
            <div class="grid-header">
              <div class="sector-column">Secteur</div>
              <div class="year-column" *ngFor="let year of getYears()">{{ year }}</div>
            </div>
            
            <div class="grid-row" *ngFor="let sector of getSectors()">
              <div class="sector-label">{{ sector }}</div>
              <div class="year-cell" *ngFor="let year of getYears()">
                <div class="exam-dot" 
                     *ngFor="let exam of getExamsForSectorAndYear(sector, year)"
                     [class]="'diagnosis-' + exam.diagnosis"
                     (click)="openExamModal(exam)"
                     [title]="exam.title + ' - ' + exam.date.toLocaleDateString()">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vue Calendrier -->
      <div class="timeline-content" *ngIf="currentView === 'calendar'">
        <div class="calendar-view">
          <div class="calendar-controls">
            <div class="nav-controls">
              <button (click)="previousYear()" [disabled]="currentYear <= minYear">‹‹</button>
              <button (click)="previousMonth()" [disabled]="isAtMinDate()">‹</button>
              <span class="current-period">{{ getMonthName(currentMonth) }} {{ currentYear }}</span>
              <button (click)="nextMonth()" [disabled]="isAtMaxDate()">›</button>
              <button (click)="nextYear()" [disabled]="isAtMaxYear()">››</button>
            </div>
            <div class="exam-nav-controls">
              <button (click)="goToPreviousExam()" [disabled]="!hasPreviousExam()">Examen précédent</button>
              <button (click)="goToNextExam()" [disabled]="!hasNextExam()">Examen suivant</button>
            </div>
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-header">
              <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
            </div>
            
            <div class="calendar-body">
              <div class="calendar-day" *ngFor="let day of getCalendarDays()" 
                   [class.other-month]="!day.isCurrentMonth"
                   [class.has-exams]="day.exams.length > 0">
                <span class="day-number">{{ day.number }}</span>
                <div class="day-exams">
                  <span class="exam-badge" 
                        *ngIf="day.exams.length > 0"
                        [class]="'count-' + getMin(day.exams.length, 5)"
                        [title]="getExamTooltip(day.exams)"
                        (click)="openExamModal(day.exams.length === 1 ? day.exams[0] : null, day.exams)">
                    {{ day.exams.length }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <app-exam-modal 
      *ngIf="selectedExam || selectedDayExams.length > 0" 
      [exam]="selectedExam"
      [dayExams]="selectedDayExams"
      (close)="closeExamModal()">
    </app-exam-modal>
  `,
  styles: [`
    .timeline-card {
      padding: 1.5rem;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-shrink: 0;
    }

    .timeline-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
      border-bottom: 2px solid #ffc107;
      padding-bottom: 0.5rem;
    }

    .timeline-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .view-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #dee2e6;
      background: white;
      color: #495057;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .view-btn:hover {
      background: #f8f9fa;
    }

    .view-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .sort-select {
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .timeline-content {
      flex: 1;
      overflow-y: auto;
    }

    /* Vue Verticale */
    .vertical-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .exam-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .exam-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .exam-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    .exam-date {
      color: #6c757d;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .exam-tags {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .tag.region {
      background: #e3f2fd;
      color: #1976d2;
    }

    .tag.diagnosis.diagnosis-positive {
      background: #ffebee;
      color: #d32f2f;
    }

    .tag.diagnosis.diagnosis-negative {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .tag.diagnosis.diagnosis-pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .tag.severity.severity-low {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .tag.severity.severity-high {
      background: #ffebee;
      color: #d32f2f;
    }

    .exam-summary {
      color: #495057;
      margin: 0.5rem 0;
      font-size: 1rem;
    }

    .exam-report {
      color: #6c757d;
      margin: 0.5rem 0;
      line-height: 1.5;
    }

    .see-more-btn {
      background: none;
      border: none;
      color: #007bff;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0;
      margin: 0.5rem 0;
    }

    .see-more-btn:hover {
      text-decoration: underline;
    }

    .exam-doctor {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
      color: #495057;
      font-style: italic;
    }

    /* Vue Horizontale */
    .horizontal-timeline {
      overflow: auto;
    }

    .timeline-grid {
      min-width: 800px;
    }

    .grid-header {
      display: grid;
      grid-template-columns: 200px repeat(auto-fit, minmax(100px, 1fr));
      gap: 1px;
      background: #dee2e6;
      margin-bottom: 1px;
    }

    .sector-column, .year-column {
      background: #f8f9fa;
      padding: 0.75rem;
      font-weight: 600;
      text-align: center;
    }

    .grid-row {
      display: grid;
      grid-template-columns: 200px repeat(auto-fit, minmax(100px, 1fr));
      gap: 1px;
      background: #dee2e6;
      margin-bottom: 1px;
    }

    .sector-label {
      background: #f8f9fa;
      padding: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .year-cell {
      background: white;
      padding: 0.75rem;
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      min-height: 60px;
    }

    .exam-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .exam-dot:hover {
      transform: scale(1.3);
    }

    .exam-dot.diagnosis-positive {
      background: #dc3545;
    }

    .exam-dot.diagnosis-negative {
      background: #28a745;
    }

    .exam-dot.diagnosis-pending {
      background: #ffc107;
    }

    /* Vue Calendrier */
    .calendar-view {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .calendar-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .nav-controls, .exam-nav-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .calendar-controls button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .calendar-controls button:hover:not(:disabled) {
      background: #0056b3;
    }

    .calendar-controls button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .current-period {
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0 1rem;
    }

    .calendar-grid {
      width: 100%;
    }

    .calendar-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .day-header {
      padding: 0.75rem;
      text-align: center;
      font-weight: 600;
      color: #495057;
    }

    .calendar-body {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .calendar-day {
      border: 1px solid #f0f0f0;
      padding: 0.5rem;
      min-height: 80px;
      background: white;
      position: relative;
    }

    .calendar-day.other-month {
      background: #f8f9fa;
      color: #6c757d;
    }

    .calendar-day.has-exams {
      background: #fff3cd;
    }

    .day-number {
      font-weight: 500;
      display: block;
      margin-bottom: 0.25rem;
    }

    .day-exams {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 1.5rem);
    }

    .exam-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.8rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .exam-badge:hover {
      transform: scale(1.2);
    }

    .exam-badge.count-1 {
      background: #28a745;
    }

    .exam-badge.count-2 {
      background: #ffc107;
      color: #333;
    }

    .exam-badge.count-3 {
      background: #fd7e14;
    }

    .exam-badge.count-4 {
      background: #dc3545;
    }

    .exam-badge.count-5 {
      background: #6f42c1;
    }

    @media (max-width: 768px) {
      .timeline-header {
        flex-direction: column;
        gap: 1rem;
      }

      .timeline-controls {
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }

      .view-buttons {
        width: 100%;
        justify-content: center;
      }

      .calendar-controls {
        flex-direction: column;
        gap: 0.5rem;
      }

      .nav-controls, .exam-nav-controls {
        flex-wrap: wrap;
        justify-content: center;
      }

      .calendar-day {
        min-height: 60px;
        padding: 0.25rem;
      }

      .grid-header, .grid-row {
        grid-template-columns: 150px repeat(auto-fit, minmax(80px, 1fr));
      }
    }
  `]
})
export class TimelineComponent implements OnInit, OnChanges {
  @Input() patient!: Patient;
  @Input() selectedRegions: AnatomicalRegion[] = [];

  currentView: TimelineView = 'vertical';
  sortOrder: SortOrder = 'date-desc';
  filteredExams: MedicalExam[] = [];
  selectedExam: MedicalExam | null = null;
  selectedDayExams: MedicalExam[] = [];

  // Calendrier
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  minYear = 2020;
  maxYear = new Date().getFullYear();
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  ngOnInit() {
    this.filterAndSortExams();
    this.initializeCalendarToFirstExam();
  }

  ngOnChanges() {
    this.filterAndSortExams();
  }

  setView(view: TimelineView) {
    this.currentView = view;
    if (view === 'calendar') {
      this.initializeCalendarToFirstExam();
    }
  }

  sortExams() {
    this.filterAndSortExams();
  }

  private filterAndSortExams() {
    const selectedRegionNames = this.selectedRegions.map(r => r.name);
    
    this.filteredExams = this.patient.medicalHistory.filter(exam =>
      selectedRegionNames.includes(exam.anatomicalRegion)
    );

    switch (this.sortOrder) {
      case 'date-asc':
        this.filteredExams.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'date-desc':
        this.filteredExams.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'sector':
        this.filteredExams.sort((a, b) => a.medicalSector.localeCompare(b.medicalSector));
        break;
      case 'diagnosis':
        this.filteredExams.sort((a, b) => a.diagnosis.localeCompare(b.diagnosis));
        break;
    }
  }

  private initializeCalendarToFirstExam() {
    if (this.filteredExams.length > 0) {
      const firstExam = this.filteredExams.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
      this.currentMonth = firstExam.date.getMonth();
      this.currentYear = firstExam.date.getFullYear();
    }
  }

  openExamModal(exam: MedicalExam | null, dayExams?: MedicalExam[]) {
    if (exam) {
      this.selectedExam = exam;
      this.selectedDayExams = [];
    } else if (dayExams && dayExams.length > 0) {
      this.selectedExam = null;
      this.selectedDayExams = dayExams;
    }
  }

  closeExamModal() {
    this.selectedExam = null;
    this.selectedDayExams = [];
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

  getExcerpt(text: string): string {
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  // Vue horizontale
  getYears(): number[] {
    const years = [...new Set(this.filteredExams.map(exam => exam.date.getFullYear()))];
    return years.sort((a, b) => a - b);
  }

  getSectors(): string[] {
    const sectors = [...new Set(this.filteredExams.map(exam => exam.medicalSector))];
    return sectors.sort();
  }

  getExamsForSectorAndYear(sector: string, year: number): MedicalExam[] {
    return this.filteredExams.filter(exam => 
      exam.medicalSector === sector && exam.date.getFullYear() === year
    );
  }

  // Vue calendrier
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  previousYear() {
    this.currentYear--;
  }

  nextYear() {
    this.currentYear++;
  }

  isAtMinDate(): boolean {
    return this.currentYear === this.minYear && this.currentMonth === 0;
  }

  isAtMaxDate(): boolean {
    const now = new Date();
    return this.currentYear === now.getFullYear() && this.currentMonth >= now.getMonth();
  }

  isAtMaxYear(): boolean {
    return this.currentYear >= this.maxYear;
  }

  getMonthName(month: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month];
  }

  getCalendarDays(): CalendarDay[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    
    // Trouver le lundi de la semaine du premier jour
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Convertir dimanche=0 en lundi=0
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    // Générer 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
      const exams = this.getExamsForDate(currentDate);

      days.push({
        number: currentDate.getDate(),
        isCurrentMonth,
        exams,
        date: new Date(currentDate)
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  private getExamsForDate(date: Date): MedicalExam[] {
    return this.filteredExams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.getDate() === date.getDate() &&
             examDate.getMonth() === date.getMonth() &&
             examDate.getFullYear() === date.getFullYear();
    });
  }

  getExamTooltip(exams: MedicalExam[]): string {
    if (exams.length === 1) {
      return `${exams[0].title} - ${exams[0].medicalSector}`;
    }
    return exams.map(exam => `${exam.title} (${exam.medicalSector})`).join('\n');
  }

  // Navigation par examens
  goToPreviousExam() {
    const sortedExams = this.filteredExams.sort((a, b) => a.date.getTime() - b.date.getTime());
    const currentDate = new Date(this.currentYear, this.currentMonth, 1);
    
    const previousExam = sortedExams.reverse().find(exam => exam.date < currentDate);
    if (previousExam) {
      this.currentMonth = previousExam.date.getMonth();
      this.currentYear = previousExam.date.getFullYear();
    }
  }

  goToNextExam() {
    const sortedExams = this.filteredExams.sort((a, b) => a.date.getTime() - b.date.getTime());
    const currentDate = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    const nextExam = sortedExams.find(exam => exam.date > currentDate);
    if (nextExam) {
      this.currentMonth = nextExam.date.getMonth();
      this.currentYear = nextExam.date.getFullYear();
    }
  }

  hasPreviousExam(): boolean {
    const sortedExams = this.filteredExams.sort((a, b) => a.date.getTime() - b.date.getTime());
    const currentDate = new Date(this.currentYear, this.currentMonth, 1);
    return sortedExams.some(exam => exam.date < currentDate);
  }

  hasNextExam(): boolean {
    const sortedExams = this.filteredExams.sort((a, b) => a.date.getTime() - b.date.getTime());
    const currentDate = new Date(this.currentYear, this.currentMonth + 1, 0);
    return sortedExams.some(exam => exam.date > currentDate);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

}