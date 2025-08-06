import { Component, Input, OnInit, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient, MedicalExam } from '../../../models/patient.model';
import { ExamModalComponent } from '../timeline/exam-modal/exam-modal.component';

type ViewMode = 'department' | 'anatomy';
type DepartmentFilter = 'ALL' | 'Radio' | 'Nuc. Med' | 'Pathology' | 'OPH' | 'Others';
type AnatomyFilter = 'ALL' | 'Head & Neck' | 'Torso' | 'Upper Body' | 'Lower Body' | 'Hand' | 'Foot' | 'Back' | 'Chest' | 'Abdomen' | 'Others';
type TimelineFilter = 'ALL' | '1 Week' | '1 Month' | '3 Months' | '6 Months' | '1 Year' | '3 Years' | 'More than 3 years';

interface ChartExam extends MedicalExam {
  x: number;
  y: number;
  selected: boolean;
  color: string;
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  exam: ChartExam | null;
}

@Component({
  selector: 'app-patient-view',
  standalone: true,
  imports: [CommonModule, ExamModalComponent],
  template: `
    <div class="patient-view-container">
      <h2>Patient View</h2>
      
      <!-- View Filter -->
      <div class="filter-row">
        <span class="filter-label">View</span>
        <div class="filter-buttons">
          <button 
            class="filter-btn"
            [class.active]="viewMode === 'department'"
            (click)="setViewMode('department')">
            By Department
          </button>
          <button 
            class="filter-btn"
            [class.active]="viewMode === 'anatomy'"
            (click)="setViewMode('anatomy')">
            By Anatomy
          </button>
        </div>
      </div>
      
      <!-- Department Filter -->
      <div class="filter-row" *ngIf="viewMode === 'department'">
        <span class="filter-label">Départements</span>
        <div class="filter-buttons">
          <button 
            *ngFor="let dept of departmentFilters"
            class="filter-btn"
            [class.active]="selectedDepartment === dept"
            (click)="setDepartmentFilter(dept)">
            {{ dept }}
          </button>
        </div>
      </div>
      
      <!-- Anatomy Filter -->
      <div class="filter-row" *ngIf="viewMode === 'anatomy'">
        <span class="filter-label">Anatomy</span>
        <div class="filter-buttons">
          <button 
            *ngFor="let anatomy of anatomyFilters"
            class="filter-btn"
            [class.active]="selectedAnatomy === anatomy"
            (click)="setAnatomyFilter(anatomy)">
            {{ anatomy }}
          </button>
        </div>
      </div>
      
      <!-- Timeline Filter -->
      <div class="filter-row">
        <span class="filter-label">Timeline</span>
        <div class="filter-buttons">
          <button 
            *ngFor="let timeline of timelineFilters"
            class="filter-btn"
            [class.active]="selectedTimeline === timeline"
            (click)="setTimelineFilter(timeline)">
            {{ timeline }}
          </button>
        </div>
      </div>
      
      <!-- Open Selection Button -->
      <div class="selection-controls" *ngIf="selectedExams.length > 0">
        <button class="open-selection-btn" (click)="openSelectedExams()">
          Open selection ({{ selectedExams.length }})
        </button>
      </div>
      
      <!-- Chart Container -->
      <div class="chart-container">
        <div class="chart-wrapper">
          <!-- Y-axis labels -->
          <div class="y-axis">
            <div class="y-axis-label" 
                 *ngFor="let label of yAxisLabels; let i = index"
                 [style.top.px]="getYPosition(i)">
              {{ label }}
            </div>
          </div>
          
          <!-- Chart content -->
          <div class="chart-content" #chartContent>
            <!-- X-axis labels -->
            <div class="x-axis">
              <div class="x-axis-label"
                   *ngFor="let year of xAxisLabels"
                   [style.left.px]="getXPosition(year)"
                   [style.width.px]="getYearWidth(year)">
                {{ year }}
              </div>
              <div class="today-marker" [style.left.px]="getTodayPosition()">
                Today
              </div>
            </div>
            
            <!-- Grid lines -->
            <svg class="grid-lines" [attr.width]="chartWidth" [attr.height]="chartHeight">
              <!-- Vertical lines for years -->
              <line *ngFor="let year of xAxisLabels"
                    [attr.x1]="getXPosition(year)"
                    [attr.y1]="0"
                    [attr.x2]="getXPosition(year)"
                    [attr.y2]="chartHeight"
                    class="grid-line">
              </line>
              
              <!-- Today line -->
              <line [attr.x1]="getTodayPosition()"
                    [attr.y1]="0"
                    [attr.x2]="getTodayPosition()"
                    [attr.y2]="chartHeight"
                    class="today-line">
              </line>
              
              <!-- Horizontal lines -->
              <line *ngFor="let label of yAxisLabels; let i = index"
                    [attr.x1]="0"
                    [attr.y1]="getYPosition(i) + 20"
                    [attr.x2]="chartWidth"
                    [attr.y2]="getYPosition(i) + 20"
                    class="grid-line">
              </line>
            </svg>
            
            <!-- Data points -->
            <div class="data-points">
              <div *ngFor="let exam of chartExams"
                   class="exam-point"
                   [class.selected]="exam.selected"
                   [style.left.px]="exam.x"
                   [style.top.px]="exam.y"
                   [style.background-color]="exam.color"
                   (click)="onExamClick($event, exam)"
                   (contextmenu)="onExamRightClick($event, exam)"
                   (mouseenter)="showTooltip($event, exam)"
                   (mouseleave)="hideTooltip()">
                <div class="exam-label">
                  <div class="exam-title">{{ exam.title }}</div>
                  <div class="exam-date">{{ exam.date | date:'yyyy-MM-dd' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tooltip -->
      <div class="tooltip" 
           *ngIf="tooltip.visible"
           [style.left.px]="tooltip.x"
           [style.top.px]="tooltip.y">
        <h4>{{ tooltip.exam?.title }}</h4>
        <p>Date: {{ tooltip.exam?.date | date:'dd/MM/yyyy' }}</p>
        <p>Secteur: {{ tooltip.exam?.medicalSector }}</p>
        <p>Région: {{ tooltip.exam?.anatomicalRegion }}</p>
        <div class="tooltip-images">
          <div class="image-placeholder">📷 Image 1</div>
          <div class="image-placeholder">📄 Rapport PDF</div>
        </div>
      </div>
      
      <!-- Context Menu -->
      <div class="context-menu"
           *ngIf="contextMenu.visible"
           [style.left.px]="contextMenu.x"
           [style.top.px]="contextMenu.y">
        <div class="context-item" (click)="openExamModal(contextMenu.exam!)">Open</div>
        <div class="context-item">Add to previewer</div>
        <div class="context-item" *ngIf="viewMode === 'department'">
          Department level
          <div class="submenu">
            <div *ngFor="let dept of departmentFilters.slice(1)"
                 class="submenu-item"
                 [class.active]="getDepartmentForExam(contextMenu.exam!) === dept"
                 (click)="changeDepartment(contextMenu.exam!, dept)">
              {{ dept }}
            </div>
          </div>
        </div>
        <div class="context-item" *ngIf="viewMode === 'anatomy'">
          Anatomy level
          <div class="submenu">
            <div *ngFor="let anatomy of anatomyFilters.slice(1)"
                 class="submenu-item"
                 [class.active]="getAnatomyForExam(contextMenu.exam!) === anatomy"
                 (click)="changeAnatomy(contextMenu.exam!, anatomy)">
              {{ anatomy }}
            </div>
          </div>
        </div>
        <div class="context-item">Hide</div>
      </div>
    </div>
    
    <!-- Modal -->
    <app-exam-modal 
      *ngIf="selectedExam || selectedExamsForModal.length > 0" 
      [exam]="selectedExam"
      [dayExams]="selectedExamsForModal"
      (close)="closeExamModal()">
    </app-exam-modal>
  `,
  styles: [`
    .patient-view-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-top: 2rem;
    }

    .patient-view-container h2 {
      margin: 0 0 2rem 0;
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
      border-bottom: 2px solid #dc3545;
      padding-bottom: 0.5rem;
    }

    .filter-row {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .filter-label {
      font-weight: 600;
      color: #495057;
      min-width: 120px;
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #dee2e6;
      background: white;
      color: #495057;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .filter-btn:hover {
      background: #f8f9fa;
    }

    .filter-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .selection-controls {
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #dc3545;
    }

    .open-selection-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .open-selection-btn:hover {
      background: #c82333;
    }

    .chart-container {
      margin-top: 2rem;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
      height: 600px;
    }

    .chart-wrapper {
      display: flex;
      height: 100%;
    }

    .y-axis {
      width: 150px;
      background: #f8f9fa;
      border-right: 1px solid #dee2e6;
      position: relative;
      flex-shrink: 0;
    }

    .y-axis-label {
      position: absolute;
      right: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      color: #495057;
      transform: translateY(-50%);
    }

    .chart-content {
      flex: 1;
      position: relative;
      overflow: auto;
    }

    .x-axis {
      height: 40px;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
    }

    .x-axis-label {
      position: absolute;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 500;
      color: #495057;
      border-right: 1px solid #dee2e6;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .today-marker {
      position: absolute;
      color: #ff6b35;
      font-weight: 600;
      font-size: 0.9rem;
      transform: translateX(-50%);
      height: 100%;
      display: flex;
      align-items: center;
      z-index: 11;
    }

    .grid-lines {
      position: absolute;
      top: 40px;
      left: 0;
      pointer-events: none;
    }

    .grid-line {
      stroke: #e9ecef;
      stroke-width: 1;
      stroke-dasharray: 2,2;
    }

    .today-line {
      stroke: #ff6b35;
      stroke-width: 2;
    }

    .data-points {
      position: relative;
      margin-top: 40px;
      min-height: 500px;
    }

    .exam-point {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: all 0.3s;
      z-index: 5;
    }

    .exam-point:hover {
      transform: scale(1.3);
      z-index: 10;
    }

    .exam-point.selected {
      background-color: #dc3545 !important;
      border-color: #fff;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.3);
    }

    .exam-label {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .exam-point:hover .exam-label {
      opacity: 1;
    }

    .exam-title {
      font-weight: 600;
    }

    .exam-date {
      font-size: 0.7rem;
      opacity: 0.8;
    }

    .tooltip {
      position: fixed;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
    }

    .tooltip h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .tooltip p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .tooltip-images {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .image-placeholder {
      padding: 0.25rem 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #6c757d;
    }

    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      min-width: 150px;
    }

    .context-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid #f8f9fa;
      position: relative;
    }

    .context-item:hover {
      background: #f8f9fa;
    }

    .context-item:last-child {
      border-bottom: none;
    }

    .submenu {
      position: absolute;
      left: 100%;
      top: 0;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 120px;
      display: none;
    }

    .context-item:hover .submenu {
      display: block;
    }

    .submenu-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .submenu-item:hover {
      background: #f8f9fa;
    }

    .submenu-item.active {
      background: #007bff;
      color: white;
    }

    @media (max-width: 768px) {
      .patient-view-container {
        padding: 1rem;
      }

      .filter-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .filter-label {
        min-width: auto;
      }

      .y-axis {
        width: 100px;
      }

      .chart-container {
        height: 400px;
      }
    }
  `]
})
export class PatientViewComponent implements OnInit, OnChanges {
  @Input() patient!: Patient;

  viewMode: ViewMode = 'department';
  selectedDepartment: DepartmentFilter = 'ALL';
  selectedAnatomy: AnatomyFilter = 'ALL';
  selectedTimeline: TimelineFilter = 'ALL';

  departmentFilters: DepartmentFilter[] = ['ALL', 'Radio', 'Nuc. Med', 'Pathology', 'OPH', 'Others'];
  anatomyFilters: AnatomyFilter[] = ['ALL', 'Head & Neck', 'Torso', 'Upper Body', 'Lower Body', 'Hand', 'Foot', 'Back', 'Chest', 'Abdomen', 'Others'];
  timelineFilters: TimelineFilter[] = ['ALL', '1 Week', '1 Month', '3 Months', '6 Months', '1 Year', '3 Years', 'More than 3 years'];

  chartExams: ChartExam[] = [];
  selectedExams: ChartExam[] = [];
  selectedExam: MedicalExam | null = null;
  selectedExamsForModal: MedicalExam[] = [];

  yAxisLabels: string[] = [];
  xAxisLabels: number[] = [];
  chartWidth = 1000;
  chartHeight = 500;

  tooltip = {
    visible: false,
    x: 0,
    y: 0,
    exam: null as ChartExam | null
  };

  contextMenu: ContextMenu = {
    visible: false,
    x: 0,
    y: 0,
    exam: null
  };

  private departmentColors: { [key: string]: string } = {
    'Radio': '#ff6b35',
    'Nuc. Med': '#f7931e',
    'Pathology': '#ffd23f',
    'OPH': '#06ffa5',
    'Others': '#4ecdc4'
  };

  private anatomyColors: { [key: string]: string } = {
    'Head & Neck': '#ff6b35',
    'Torso': '#f7931e',
    'Upper Body': '#ffd23f',
    'Lower Body': '#06ffa5',
    'Hand': '#4ecdc4',
    'Foot': '#45b7d1',
    'Back': '#96ceb4',
    'Chest': '#ffeaa7',
    'Abdomen': '#dda0dd',
    'Others': '#98d8c8'
  };

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.contextMenu.visible = false;
    this.hideTooltip();
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    this.updateChart();
  }

  setDepartmentFilter(dept: DepartmentFilter) {
    this.selectedDepartment = dept;
    this.updateChart();
  }

  setAnatomyFilter(anatomy: AnatomyFilter) {
    this.selectedAnatomy = anatomy;
    this.updateChart();
  }

  setTimelineFilter(timeline: TimelineFilter) {
    this.selectedTimeline = timeline;
    this.updateChart();
  }

  private updateChart() {
    const filteredExams = this.getFilteredExams();
    this.updateAxisLabels(filteredExams);
    this.chartExams = this.createChartExams(filteredExams);
    this.calculateChartDimensions();
  }

  private getFilteredExams(): MedicalExam[] {
    let exams = [...this.patient.medicalHistory];

    // Timeline filter
    if (this.selectedTimeline !== 'ALL') {
      const cutoffDate = this.getTimelineCutoffDate();
      exams = exams.filter(exam => exam.date >= cutoffDate);
    }

    // Department/Anatomy filter
    if (this.viewMode === 'department' && this.selectedDepartment !== 'ALL') {
      exams = exams.filter(exam => {
        const dept = this.mapSectorToDepartment(exam.medicalSector);
        if (this.selectedDepartment === 'Others') {
          return !this.departmentFilters.slice(1, -1).includes(dept as DepartmentFilter);
        }
        return dept === this.selectedDepartment;
      });
    }

    if (this.viewMode === 'anatomy' && this.selectedAnatomy !== 'ALL') {
      exams = exams.filter(exam => {
        const anatomy = this.mapRegionToAnatomy(exam.anatomicalRegion);
        if (this.selectedAnatomy === 'Others') {
          return !this.anatomyFilters.slice(1, -1).includes(anatomy as AnatomyFilter);
        }
        return anatomy === this.selectedAnatomy;
      });
    }

    return exams;
  }

  private getTimelineCutoffDate(): Date {
    const now = new Date();
    switch (this.selectedTimeline) {
      case '1 Week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1 Month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case '3 Months':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case '6 Months':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case '1 Year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case '3 Years':
        return new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
      case 'More than 3 years':
        return new Date(0);
      default:
        return new Date(0);
    }
  }

  private updateAxisLabels(exams: MedicalExam[]) {
    // Y-axis labels
    if (this.viewMode === 'department') {
      this.yAxisLabels = this.departmentFilters.slice(1);
    } else {
      this.yAxisLabels = this.anatomyFilters.slice(1);
    }

    // X-axis labels (years)
    const years = [...new Set(exams.map(exam => exam.date.getFullYear()))];
    this.xAxisLabels = years.sort((a, b) => a - b);
  }

  private createChartExams(exams: MedicalExam[]): ChartExam[] {
    return exams.map(exam => {
      const yIndex = this.getYIndex(exam);
      const x = this.getXPositionForExam(exam);
      const y = this.getYPosition(yIndex);
      
      return {
        ...exam,
        x,
        y,
        selected: false,
        color: this.getExamColor(exam)
      };
    });
  }

  private getYIndex(exam: MedicalExam): number {
    if (this.viewMode === 'department') {
      const dept = this.mapSectorToDepartment(exam.medicalSector);
      return this.yAxisLabels.indexOf(dept);
    } else {
      const anatomy = this.mapRegionToAnatomy(exam.anatomicalRegion);
      return this.yAxisLabels.indexOf(anatomy);
    }
  }

  private getXPositionForExam(exam: MedicalExam): number {
    const year = exam.date.getFullYear();
    const yearIndex = this.xAxisLabels.indexOf(year);
    const yearStart = yearIndex * 200; // Base width per year
    
    // Add position within year based on month
    const monthOffset = (exam.date.getMonth() / 12) * 200;
    return yearStart + monthOffset;
  }

  getYPosition(index: number): number {
    return index * 60 + 30; // 60px spacing between rows
  }

  getXPosition(year: number): number {
    const yearIndex = this.xAxisLabels.indexOf(year);
    return yearIndex * 200;
  }

  getYearWidth(year: number): number {
    return 200; // Fixed width for now, could be dynamic based on exam count
  }

  getTodayPosition(): number {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const yearIndex = this.xAxisLabels.indexOf(currentYear);
    
    if (yearIndex === -1) return 0;
    
    return yearIndex * 200 + (currentMonth / 12) * 200;
  }

  private calculateChartDimensions() {
    this.chartWidth = Math.max(1000, this.xAxisLabels.length * 200);
    this.chartHeight = Math.max(500, this.yAxisLabels.length * 60);
  }

  private getExamColor(exam: MedicalExam): string {
    if (this.viewMode === 'department') {
      const dept = this.mapSectorToDepartment(exam.medicalSector);
      return this.departmentColors[dept] || '#6c757d';
    } else {
      const anatomy = this.mapRegionToAnatomy(exam.anatomicalRegion);
      return this.anatomyColors[anatomy] || '#6c757d';
    }
  }

  private mapSectorToDepartment(sector: string): string {
    const mapping: { [key: string]: string } = {
      'Pneumologie': 'Radio',
      'Cardiologie': 'Radio',
      'Neurologie': 'Radio',
      'Orthopédie': 'Radio',
      'Gastroentérologie': 'Radio',
      'Néphrologie': 'Radio',
      'Ophtalmologie': 'OPH',
      'ORL': 'Others',
      'Gynécologie': 'Others'
    };
    return mapping[sector] || 'Others';
  }

  private mapRegionToAnatomy(region: string): string {
    const mapping: { [key: string]: string } = {
      'Tête': 'Head & Neck',
      'Cou': 'Head & Neck',
      'Cerveau': 'Head & Neck',
      'Yeux': 'Head & Neck',
      'Oreilles': 'Head & Neck',
      'Thorax': 'Chest',
      'Poumons': 'Chest',
      'Cœur': 'Chest',
      'Abdomen': 'Abdomen',
      'Foie': 'Abdomen',
      'Reins': 'Abdomen',
      'Bras': 'Upper Body',
      'Épaule': 'Upper Body',
      'Coude': 'Upper Body',
      'Poignet': 'Hand',
      'Mains': 'Hand',
      'Jambes': 'Lower Body',
      'Hanche': 'Lower Body',
      'Genou': 'Lower Body',
      'Cheville': 'Foot',
      'Pieds': 'Foot',
      'Colonne vertébrale': 'Back'
    };
    return mapping[region] || 'Others';
  }

  onExamClick(event: MouseEvent, exam: ChartExam) {
    event.preventDefault();
    
    if (event.ctrlKey) {
      // Ctrl+click: toggle selection
      exam.selected = !exam.selected;
      if (exam.selected) {
        this.selectedExams.push(exam);
      } else {
        this.selectedExams = this.selectedExams.filter(e => e.id !== exam.id);
      }
    } else {
      // Regular click: open modal
      this.openExamModal(exam);
    }
  }

  onExamRightClick(event: MouseEvent, exam: ChartExam) {
    event.preventDefault();
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      exam
    };
  }

  showTooltip(event: MouseEvent, exam: ChartExam) {
    this.tooltip = {
      visible: true,
      x: event.clientX + 10,
      y: event.clientY - 10,
      exam
    };
  }

  hideTooltip() {
    this.tooltip.visible = false;
  }

  openExamModal(exam: MedicalExam) {
    this.selectedExam = exam;
    this.selectedExamsForModal = [];
  }

  openSelectedExams() {
    this.selectedExam = null;
    this.selectedExamsForModal = [...this.selectedExams];
  }

  closeExamModal() {
    this.selectedExam = null;
    this.selectedExamsForModal = [];
  }

  getDepartmentForExam(exam: ChartExam): string {
    return this.mapSectorToDepartment(exam.medicalSector);
  }

  getAnatomyForExam(exam: ChartExam): string {
    return this.mapRegionToAnatomy(exam.anatomicalRegion);
  }

  changeDepartment(exam: ChartExam, newDept: DepartmentFilter) {
    // This would update the exam's department in the backend
    console.log(`Changing exam ${exam.id} department to ${newDept}`);
    this.contextMenu.visible = false;
    this.updateChart();
  }

  changeAnatomy(exam: ChartExam, newAnatomy: AnatomyFilter) {
    // This would update the exam's anatomy in the backend
    console.log(`Changing exam ${exam.id} anatomy to ${newAnatomy}`);
    this.contextMenu.visible = false;
    this.updateChart();
  }
}