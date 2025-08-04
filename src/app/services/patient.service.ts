import { Injectable } from '@angular/core';
import { Patient, MedicalExam, AnatomicalRegion } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  private patients: Patient[] = [
    {
      id: '001',
      firstName: 'Damien',
      lastName: 'Martin',
      gender: 'M',
      birthDate: new Date('1985-03-15'),
      age: this.calculateAge(new Date('1985-03-15')),
      bloodType: 'O+',
      height: 178,
      weight: 75,
      allergies: ['Pénicilline', 'Pollen'],
      currentTreatments: ['Aspirine 100mg', 'Vitamine D3'],
      emergencyContact: {
        name: 'Sophie Martin',
        relationship: 'Épouse',
        phone: '+33 6 12 34 56 78'
      },
      medicalHistory: this.getDamienExams()
    },
    {
      id: '002',
      firstName: 'Rebecca',
      lastName: 'Dubois',
      gender: 'F',
      birthDate: new Date('1990-08-22'),
      age: this.calculateAge(new Date('1990-08-22')),
      bloodType: 'A-',
      height: 165,
      weight: 58,
      allergies: ['Latex', 'Fruits à coque'],
      currentTreatments: ['Contraceptif oral', 'Fer 80mg'],
      emergencyContact: {
        name: 'Pierre Dubois',
        relationship: 'Père',
        phone: '+33 6 87 65 43 21'
      },
      medicalHistory: this.getRebeccaExams()
    }
  ];

  searchPatients(query: string): Patient[] {
    if (!query.trim()) {
      return this.patients;
    }
    
    const searchTerm = query.toLowerCase();
    return this.patients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchTerm) ||
      patient.lastName.toLowerCase().includes(searchTerm) ||
      patient.id.includes(searchTerm)
    );
  }

  getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }

  getAllPatients(): Patient[] {
    return this.patients;
  }

  getCurrentPatient(): Patient {
    return this.patients[0]; // Par défaut, retourne Damien
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

  private getDamienExams(): MedicalExam[] {
    return [
      {
        id: 'd1',
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
        id: 'd2',
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
        id: 'd3',
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
        id: 'd4',
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
        id: 'd5',
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
        id: 'd6',
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
        id: 'd7',
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
        id: 'd8',
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
        id: 'd9',
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
        id: 'd10',
        title: 'Scanner Abdominal',
        date: new Date('2023-12-15'),
        anatomicalRegion: 'Abdomen',
        medicalSector: 'Gastroentérologie',
        diagnosis: 'pending',
        severity: 'high',
        summary: 'Masse abdominale à explorer',
        fullReport: 'Scanner abdomino-pelvien avec injection dans le cadre de douleurs abdominales persistantes. Mise en évidence d\'une formation tissulaire de 3 cm au niveau du segment VII hépatique, de densité hétérogène. Rehaussement hétérogène après injection. Complément d\'investigation nécessaire par IRM hépatique et marqueurs tumoraux pour caractérisation. Surveillance rapprochée recommandée.',
        doctor: 'Petit',
        tags: ['abdomen', 'masse', 'investigation', 'scanner', 'hépatique']
      }
    ];
  }

  private getRebeccaExams(): MedicalExam[] {
    return [
      {
        id: 'r1',
        title: 'Mammographie de dépistage',
        date: new Date('2024-02-10'),
        anatomicalRegion: 'Thorax',
        medicalSector: 'Gynécologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Dépistage normal',
        fullReport: 'Mammographie bilatérale de dépistage réalisée dans le cadre du suivi gynécologique. Densité mammaire de type B (densité fibroglandulaire éparse). Pas de masse suspecte, pas de microcalcifications groupées. Architecture mammaire conservée. Ganglions axillaires de taille normale. Classification ACR 1 - mammographie normale. Prochain contrôle dans 2 ans.',
        doctor: 'Lemoine',
        tags: ['mammographie', 'dépistage', 'normal', 'gynécologie']
      },
      {
        id: 'r2',
        title: 'Échographie pelvienne',
        date: new Date('2023-10-15'),
        anatomicalRegion: 'Abdomen',
        medicalSector: 'Gynécologie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Kyste ovarien fonctionnel',
        fullReport: 'Échographie pelvienne par voie sus-pubienne et endovaginale. Utérus de taille normale, endomètre fin. Ovaire droit normal. Ovaire gauche présentant une formation kystique de 3 cm, à contenu anéchogène, paroi fine, compatible avec un kyste fonctionnel. Pas d\'épanchement dans le cul-de-sac de Douglas. Surveillance échographique recommandée dans 3 mois.',
        doctor: 'Lemoine',
        tags: ['échographie', 'kyste', 'ovarien', 'gynécologie']
      },
      {
        id: 'r3',
        title: 'Bilan thyroïdien',
        date: new Date('2024-01-20'),
        anatomicalRegion: 'Cou',
        medicalSector: 'Endocrinologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Fonction thyroïdienne normale',
        fullReport: 'Bilan thyroïdien complet dans le cadre d\'une fatigue chronique. TSH: 2.1 mUI/L (normale). T4 libre: 14 pmol/L (normale). T3 libre: 4.2 pmol/L (normale). Anticorps anti-TPO: négatifs. Échographie thyroïdienne: thyroïde de taille normale, échostructure homogène. Pas de nodule décelé. Fonction thyroïdienne strictement normale.',
        doctor: 'Fontaine',
        tags: ['thyroïde', 'bilan', 'normal', 'endocrinologie']
      },
      {
        id: 'r4',
        title: 'Radiographie Poignet Droit',
        date: new Date('2023-08-12'),
        anatomicalRegion: 'Poignet',
        medicalSector: 'Orthopédie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Fracture scaphoïde consolidée',
        fullReport: 'Radiographie du poignet droit de face et de profil dans le cadre du suivi d\'une fracture du scaphoïde. Trait de fracture du scaphoïde en voie de consolidation. Pas de déplacement secondaire. Interligne radio-carpien respecté. Pas de signe d\'arthrose post-traumatique. Consolidation satisfaisante. Reprise progressive des activités autorisée.',
        doctor: 'Moreau',
        tags: ['poignet', 'fracture', 'scaphoïde', 'consolidation', 'orthopédie']
      },
      {
        id: 'r5',
        title: 'Fond d\'œil',
        date: new Date('2023-06-18'),
        anatomicalRegion: 'Yeux',
        medicalSector: 'Ophtalmologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Rétine normale',
        fullReport: 'Examen du fond d\'œil après dilatation pupillaire bilatérale. Papilles optiques de couleur et de contours normaux. Vaisseaux rétiniens réguliers, calibre normal. Pas de microanévrysmes ni d\'hémorragies. Macula d\'aspect normal, réflexe fovéolaire présent. Périphérie rétinienne sans anomalie. Conclusion: fond d\'œil strictement normal des deux yeux.',
        doctor: 'Lambert',
        tags: ['yeux', 'rétine', 'fond', 'normal', 'ophtalmologie']
      },
      {
        id: 'r6',
        title: 'Échographie rénale',
        date: new Date('2024-03-05'),
        anatomicalRegion: 'Reins',
        medicalSector: 'Néphrologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Reins normaux',
        fullReport: 'Échographie rénale bilatérale dans le cadre d\'un bilan d\'hypertension artérielle. Rein droit: taille normale (11 cm), échostructure homogène, différenciation cortico-médullaire conservée. Rein gauche: aspect similaire. Pas de dilatation des cavités pyélocalicielles. Vessie de contours réguliers. Pas de lithiase décelée. Morphologie rénale strictement normale.',
        doctor: 'Bernard',
        tags: ['reins', 'échographie', 'normal', 'néphrologie']
      },
      {
        id: 'r7',
        title: 'IRM Cervicale',
        date: new Date('2023-04-10'),
        anatomicalRegion: 'Cou',
        medicalSector: 'Neurologie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Cervicalgie commune',
        fullReport: 'IRM du rachis cervical dans le cadre de cervicalgies chroniques. Discopathie dégénérative étagée C5-C6 et C6-C7 sans conflit disco-radiculaire. Légère arthrose interapophysaire postérieure. Canal rachidien de calibre normal. Moelle épinière d\'aspect normal. Pas de hernie discale. Aspect compatible avec une cervicalgie commune dégénérative.',
        doctor: 'Lebreton',
        tags: ['cou', 'cervical', 'discopathie', 'IRM', 'neurologie']
      },
      {
        id: 'r8',
        title: 'Audiométrie',
        date: new Date('2023-09-25'),
        anatomicalRegion: 'Oreilles',
        medicalSector: 'ORL',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Audition normale',
        fullReport: 'Audiométrie tonale et vocale bilatérale dans le cadre d\'un bilan systématique. Seuils auditifs dans les limites de la normale: oreille droite 15 dB, oreille gauche 10 dB. Courbe audiométrique plate. Tympanométrie normale bilatéralement. Réflexes stapédiens présents et symétriques. Audition strictement normale.',
        doctor: 'Garnier',
        tags: ['oreilles', 'audition', 'normal', 'audiométrie', 'ORL']
      },
      {
        id: 'r9',
        title: 'Radiographie Cheville Gauche',
        date: new Date('2024-02-28'),
        anatomicalRegion: 'Cheville',
        medicalSector: 'Orthopédie',
        diagnosis: 'positive',
        severity: 'low',
        summary: 'Entorse bénigne',
        fullReport: 'Radiographie de la cheville gauche de face et de profil suite à un traumatisme en inversion. Pas de trait de fracture décelé. Interligne tibio-talaire respecté. Mortaise tibio-péronière normale. Léger épaississement des parties molles latérales compatible avec un œdème post-traumatique. Aspect radiologique compatible avec une entorse bénigne.',
        doctor: 'Moreau',
        tags: ['cheville', 'entorse', 'traumatisme', 'radiographie', 'orthopédie']
      },
      {
        id: 'r10',
        title: 'Scanner Thoracique',
        date: new Date('2023-11-30'),
        anatomicalRegion: 'Poumons',
        medicalSector: 'Pneumologie',
        diagnosis: 'negative',
        severity: 'low',
        summary: 'Poumons normaux',
        fullReport: 'Scanner thoracique haute résolution dans le cadre d\'une toux chronique. Parenchyme pulmonaire d\'aspect normal, sans nodule ni infiltrat. Plèvres libres. Médiastin de morphologie normale. Cœur de taille normale. Pas d\'adénopathie médiastinale. Structures osseuses thoraciques intactes. Conclusion: scanner thoracique strictement normal.',
        doctor: 'Martin',
        tags: ['poumons', 'scanner', 'normal', 'pneumologie']
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