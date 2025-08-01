export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: Date;
  age: number;
  bloodType: string;
  height: number;
  weight: number;
  allergies: string[];
  currentTreatments: string[];
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalExam[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalExam {
  id: string;
  title: string;
  date: Date;
  anatomicalRegion: string;
  medicalSector: string;
  diagnosis: 'positive' | 'negative' | 'pending';
  severity: 'low' | 'high';
  summary: string;
  fullReport: string;
  doctor?: string;
  tags: string[];
}

export interface AnatomicalRegion {
  id: string;
  name: string;
  sector: string;
  selected: boolean;
}