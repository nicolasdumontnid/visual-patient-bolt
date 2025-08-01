import { Injectable } from '@angular/core';
import { Patient, MedicalExam, AnatomicalRegion } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  getCurrentPatient(): Patient {
    return {
      id: '12345',
      firstName: 'Marie',
      lastName: 'Dupont',
      gender: 'F',
      birthDate: new Date('1985-06-15'),
      age: this.calculateAge(new Date('1985-06-15')),
      bloodType: 'A+',
      height: 168,
      weight: 65,
      allergies: ['Pénicilline', 'Acariens'],
      currentTreatments: ['Paracétamol 500mg', 'Vitamine D'],
      emergencyContact: {
        name: 'Jean Dupont',
        relationship: 'Époux',
        phone: '+33 6 12 34 56 78'
      },
      medicalHistory: this.getMockExams()
    };
  }

  getAnatomicalRegions(): AnatomicalRegion[] {
    return [
      // Neurologie
      { id: 'head', name: 'Tête', sector: 'Neurologie', selected: true },
      { id: 'neck', name: 'Cou', sector: 'Neurologie', selected: true },
      { id: 'brain', name: 'Cerveau', sector: 'Neurologie', selected: true },
      
      // Ophtalmologie
      { id: 'eyes', name: 'Yeux', sector: 'Ophtalmologie', selected: true },
      
      // ORL
      { id: 'ears', name: 'Oreilles', sector: 'ORL', selected: true },
      
      // Pneumologie
      { id: 'chest', name: 'Thorax', sector: 'Pneumologie', selected: true },
      { id: 'lungs', name: 'Poumons', sector: 'Pneumologie', selected: true },
      
      // Cardiologie
      { id: 'heart', name: 'Cœur', sector: 'Cardiologie', selected: true },
      { id: 'ventricle', name: 'Ventricule', sector: 'Cardiologie', selected: true },
      { id: 'atrium', name: 'Oreillette', sector: 'Cardiologie', selected: true },
      { id: 'aorta', name: 'Aorte', sector: 'Cardiologie', selected: true },
      
      // Gastroentérologie
      { id: 'abdomen', name: 'Abdomen', sector: 'Gastroentérologie', selected: true },
      { id: 'liver', name: 'Foie', sector: 'Gastroentérologie', selected: true },
      { id: 'stomach', name: 'Estomac', sector: 'Gastroentérologie', selected: true },
      { id: 'intestines', name: 'Intestins', sector: 'Gastroentérologie', selected: true },
      { id: 'pancreas', name: 'Pancréas', sector: 'Gastroentérologie', selected: true },
      { id: 'gallbladder', name: 'Vésicule biliaire', sector: 'Gastroentérologie', selected: true },
      
      // Néphrologie
      { id: 'kidneys', name: 'Reins', sector: 'Néphrologie', selected: true },
      { id: 'bladder', name: 'Vessie', sector: 'Néphrologie', selected: true },
      
      // Orthopédie - Colonne vertébrale
      { id: 'spine', name: 'Colonne vertébrale', sector: 'Orthopédie', selected: true },
      { id: 'cervical', name: 'Vertèbres cervicales', sector: 'Orthopédie', selected: true },
      { id: 'thoracic', name: 'Vertèbres thoraciques', sector: 'Orthopédie', selected: true },
      { id: 'lumbar', name: 'Vertèbres lombaires', sector: 'Orthopédie', selected: true },
      
      // Orthopédie - Bras
      { id: 'arms', name: 'Bras', sector: 'Orthopédie', selected: true },
      { id: 'shoulder', name: 'Épaule', sector: 'Orthopédie', selected: true },
      { id: 'humerus', name: 'Humérus', sector: 'Orthopédie', selected: true },
      { id: 'radius', name: 'Radius', sector: 'Orthopédie', selected: true },
      { id: 'ulna', name: 'Ulna', sector: 'Orthopédie', selected: true },
      { id: 'elbow', name: 'Coude', sector: 'Orthopédie', selected: true },
      
      // Orthopédie - Mains
      { id: 'hands', name: 'Mains', sector: 'Orthopédie', selected: true },
      { id: 'wrist', name: 'Poignet', sector: 'Orthopédie', selected: true },
      { id: 'metacarpals', name: 'Métacarpes', sector: 'Orthopédie', selected: true },
      { id: 'phalanges-hand', name: 'Phalanges main', sector: 'Orthopédie', selected: true },
      
      // Orthopédie - Membres inférieurs
      { id: 'legs', name: 'Jambes', sector: 'Orthopédie', selected: true },
      { id: 'hip', name: 'Hanche', sector: 'Orthopédie', selected: true },
      { id: 'femur', name: 'Fémur', sector: 'Orthopédie', selected: true },
      { id: 'knee', name: 'Genou', sector: 'Orthopédie', selected: true },
      { id: 'tibia', name: 'Tibia', sector: 'Orthopédie', selected: true },
      { id: 'fibula', name: 'Péroné', sector: 'Orthopédie', selected: true },
      { id: 'ankle', name: 'Cheville', sector: 'Orthopédie', selected: true },
      
      // Orthopédie - Pieds
      { id: 'feet', name: 'Pieds', sector: 'Orthopédie', selected: true },
      { id: 'metatarsals', name: 'Métatarses', sector: 'Orthopédie', selected: true },
      { id: 'phalanges-foot', name: 'Phalanges pied', sector: 'Orthopédie', selected: true }
    ];
  }

  private getMockExams(): MedicalExam[] {
    return [
      {
        id: '1',
        title: 'Radiographie Thoracique',
        date: new Date('2024-01-15'),
        anatomicalRegion: 'Poumons',
        medicalSector: 'Pneumologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Fonction pulmonaire normale',
        fullReport: 'Examen radiographique du thorax de face et de profil. Les champs pulmonaires sont clairs, sans infiltrat ni condensation. Le cœur est de taille normale. Les coupoles diaphragmatiques sont libres et mobiles. Aucune anomalie pleurale détectée. Les structures osseuses thoraciques sont intactes. Conclusion: Radiographie thoracique strictement normale. Fonction respiratoire préservée.',
        doctor: 'Martin',
        tags: ['thorax', 'poumons', 'normal', 'radiographie']
      },
      {
        id: '2',
        title: 'IRM Cérébrale',
        date: new Date('2023-11-20'),
        anatomicalRegion: 'Cerveau',
        medicalSector: 'Neurologie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Migraine chronique confirmée',
        fullReport: 'IRM cérébrale avec injection de gadolinium réalisée dans le cadre de céphalées chroniques. Signal normal de la substance blanche et grise. Pas de lésion focale décelée. Léger épaississement des méninges compatible avec une migraine chronique. Absence de processus expansif intracrânien. Système ventriculaire de morphologie normale. Recommandation de suivi neurologique et traitement préventif des migraines.',
        doctor: 'Lebreton',
        tags: ['cerveau', 'migraine', 'chronique', 'IRM', 'neurologie']
      },
      {
        id: '3',
        title: 'Échographie Abdominale',
        date: new Date('2023-09-10'),
        anatomicalRegion: 'Foie',
        medicalSector: 'Gastroentérologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Fonction hépatique normale',
        fullReport: 'Échographie abdominale complète réalisée à jeun. Le foie présente une échostructure homogène, de taille normale (15 cm). Contours réguliers. Vésicule biliaire sans calcul, paroi fine. Voies biliaires non dilatées. Rate et pancréas d\'aspect normal. Reins de taille et d\'échostructure normales. Pas d\'épanchement péritonéal. Aorte abdominale de calibre normal.',
        doctor: 'Rousseau',
        tags: ['abdomen', 'foie', 'normal', 'échographie']
      },
      {
        id: '4',
        title: 'Radiographie Genou Droit',
        date: new Date('2023-07-05'),
        anatomicalRegion: 'Genou',
        medicalSector: 'Orthopédie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Arthrose débutante',
        fullReport: 'Radiographie du genou droit de face et de profil dans le cadre de douleurs articulaires. Pincement articulaire débutant au niveau du compartiment fémoro-tibial interne. Petits ostéophytes marginaux. Pas de géode ni de condensation sous-chondrale significative. Aspect compatible avec une arthrose débutante. Recommandation: kinésithérapie et suivi orthopédique.',
        doctor: 'Moreau',
        tags: ['genou', 'arthrose', 'débutante', 'radiographie', 'orthopédie']
      },
      {
        id: '5',
        title: 'Bilan Sanguin Complet',
        date: new Date('2024-02-01'),
        anatomicalRegion: 'Reins',
        medicalSector: 'Néphrologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Fonction rénale normale',
        fullReport: 'Bilan biologique complet dans le cadre d\'un suivi préventif. Créatinine sérique: 0.8 mg/dL (normale). Urée: 25 mg/dL (normale). Clairance de la créatinine estimée: 95 mL/min (normale). Protéinurie: négative. Hématurie: négative. Ionogramme sanguin équilibré. Fonction rénale dans les limites de la normale. Pas de signe de dysfonction rénale.',
        doctor: 'Bernard',
        tags: ['sang', 'reins', 'normal', 'biologie', 'néphrologie']
      },
      {
        id: '6',
        title: 'Scanner Abdominal',
        date: new Date('2022-12-15'),
        anatomicalRegion: 'Abdomen',
        medicalSector: 'Gastroentérologie',
        diagnosis: 'pending',
        severity: 'high',
        summary: 'Masse abdominale à explorer',
        fullReport: 'Scanner abdomino-pelvien avec injection dans le cadre de douleurs abdominales persistantes. Mise en évidence d\'une formation tissulaire de 3 cm au niveau du segment VII hépatique, de densité hétérogène. Rehaussement hétérogène après injection. Complément d\'investigation nécessaire par IRM hépatique et marqueurs tumoraux pour caractérisation. Surveillance rapprochée recommandée.',
        doctor: 'Petit',
        tags: ['abdomen', 'masse', 'investigation', 'scanner', 'hépatique']
      },
      {
        id: '7',
        title: 'Électrocardiogramme',
        date: new Date('2024-01-08'),
        anatomicalRegion: 'Cœur',
        medicalSector: 'Cardiologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Rythme cardiaque normal',
        fullReport: 'ECG 12 dérivations au repos. Rythme sinusal régulier à 72 bpm. Axe électrique normal. Pas de trouble de la conduction auriculo-ventriculaire. Pas de signe d\'ischémie myocardique. Ondes P, complexes QRS et ondes T de morphologie normale. Intervalle QT normal. Conclusion: ECG strictement normal.',
        doctor: 'Dubois',
        tags: ['cœur', 'ECG', 'normal', 'cardiologie', 'rythme']
      },
      {
        id: '8',
        title: 'Radiographie Colonne Lombaire',
        date: new Date('2023-05-22'),
        anatomicalRegion: 'Colonne vertébrale',
        medicalSector: 'Orthopédie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Discopathie L4-L5',
        fullReport: 'Radiographie de la colonne lombaire de face et de profil. Pincement discal modéré L4-L5. Ostéophytose marginale débutante. Pas de spondylolisthésis. Courbures rachidiennes conservées. Aspect compatible avec une discopathie dégénérative débutante L4-L5. Recommandation: kinésithérapie et renforcement musculaire.',
        doctor: 'Moreau',
        tags: ['colonne', 'lombaire', 'discopathie', 'L4-L5', 'orthopédie']
      },
      {
        id: '9',
        title: 'Échographie Cardiaque',
        date: new Date('2023-03-14'),
        anatomicalRegion: 'Cœur',
        medicalSector: 'Cardiologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Fonction cardiaque préservée',
        fullReport: 'Échocardiographie transthoracique complète. Ventricule gauche de taille normale, fonction systolique préservée (FEVG 65%). Pas d\'anomalie de la cinétique segmentaire. Valves mitrales et aortiques normales. Pas de fuite valvulaire significative. Oreillettes de taille normale. Pas d\'épanchement péricardique. Fonction diastolique normale.',
        doctor: 'Dubois',
        tags: ['cœur', 'échographie', 'fonction', 'normale', 'cardiologie']
      },
      {
        id: '10',
        title: 'IRM Genou Gauche',
        date: new Date('2024-01-08'),
        anatomicalRegion: 'Genou',
        medicalSector: 'Orthopédie',
        diagnosis: 'positive',
        severity: 'high',
        summary: 'Rupture ménisque interne',
        fullReport: 'IRM du genou gauche dans le cadre de douleurs post-traumatiques. Rupture complexe du ménisque interne avec fragment déplacé. Œdème osseux sous-chondral fémoral et tibial. Ligaments croisés intacts. Épanchement articulaire modéré. Indication chirurgicale: méniscectomie partielle sous arthroscopie.',
        doctor: 'Moreau',
        tags: ['genou', 'ménisque', 'rupture', 'IRM', 'chirurgie']
      },
      {
        id: '11',
        title: 'Fond d\'œil',
        date: new Date('2023-08-30'),
        anatomicalRegion: 'Yeux',
        medicalSector: 'Ophtalmologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Rétine normale',
        fullReport: 'Examen du fond d\'œil après dilatation pupillaire. Papilles optiques de couleur et de contours normaux. Vaisseaux rétiniens réguliers, pas de microanévrysmes. Macula d\'aspect normal. Périphérie rétinienne sans anomalie. Pas de signe de rétinopathie diabétique ou hypertensive. Conclusion: fond d\'œil strictement normal.',
        doctor: 'Lambert',
        tags: ['yeux', 'rétine', 'fond', 'normal', 'ophtalmologie']
      },
      {
        id: '12',
        title: 'Audiométrie',
        date: new Date('2023-06-18'),
        anatomicalRegion: 'Oreilles',
        medicalSector: 'ORL',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Perte auditive légère',
        fullReport: 'Audiométrie tonale et vocale bilatérale. Seuils auditifs: oreille droite 25 dB, oreille gauche 30 dB. Perte auditive de transmission légère bilatérale. Tympanométrie normale. Réflexes stapédiens présents. Compatible avec un bouchon de cérumen ou une otite séreuse. Recommandation: nettoyage auriculaire et réévaluation.',
        doctor: 'Garnier',
        tags: ['oreilles', 'audition', 'perte', 'légère', 'ORL']
      }
    ];
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}