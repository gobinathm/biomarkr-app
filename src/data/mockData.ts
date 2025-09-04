// Mock data for demo mode
export interface MockProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height?: string;
  weight?: string;
  notes?: string;
}

export interface MockTestResult {
  id: string;
  profileId: string;
  profileName?: string;
  date: string;
  time?: string;
  lab: string;
  panel: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  modifiedAt?: string;
  biomarkers: Array<{
    name: string;
    value: string;
    unit: string;
    range?: string;
    referenceRange?: {
      min?: number;
      max?: number;
      text?: string;
    };
    flags?: string[];
    notes?: string;
  }>;
}

export interface MockReminder {
  id: string;
  profileId: string;
  title: string;
  description: string;
  dueDate: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  isCompleted: boolean;
  category: 'test' | 'medication' | 'appointment' | 'lifestyle';
}

// Sample profiles
export const mockProfiles = [
  {
    id: 'profile-demo-1',
    name: 'John Doe (Demo)',
    relationship: 'self',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    height: '5\'10"',
    weight: '175 lbs',
    notes: 'Regular checkups every 6 months',
    createdAt: new Date().toISOString(),
    isDefault: true
  },
  {
    id: 'profile-demo-2',
    name: 'Sarah Smith (Demo)',
    relationship: 'spouse',
    dateOfBirth: '1990-03-22',
    gender: 'female',
    height: '5\'6"',
    weight: '140 lbs',
    notes: 'Family history of diabetes',
    createdAt: new Date().toISOString(),
    isDefault: false
  },
  {
    id: 'profile-demo-3',
    name: 'Emily Johnson (Demo)',
    relationship: 'child',
    dateOfBirth: '2015-09-08',
    gender: 'female',
    height: '4\'2"',
    weight: '55 lbs',
    notes: 'Pediatric patient - annual wellness checks',
    createdAt: new Date().toISOString(),
    isDefault: false
  },
  {
    id: 'profile-demo-4',
    name: 'Michael Chen (Demo)',
    relationship: 'child',
    dateOfBirth: '2012-01-20',
    gender: 'male',
    height: '4\'8"',
    weight: '75 lbs',
    notes: 'Active child - sports physical required',
    createdAt: new Date().toISOString(),
    isDefault: false
  }
];

// Generate test results for the past 2 years
const generateMockResults = (): MockTestResult[] => {
  const results: MockTestResult[] = [];
  const testNames = [
    'Complete Blood Count (CBC)',
    'Comprehensive Metabolic Panel',
    'Lipid Panel',
    'Thyroid Function Tests',
    'Liver Function Tests',
    'Kidney Function Tests',
    'Hemoglobin A1C',
    'Vitamin D Test',
    'Iron Studies',
    'Inflammatory Markers',
    'Cardiac Risk Panel',
    'Hormone Panel',
    'Nutrient Status Panel',
    'Autoimmune Panel',
    'Metabolic Health Panel',
    'Cancer Markers',
    'Bone Health Panel'
  ];

  const providers = ['LabCorp', 'Quest Diagnostics', 'Mayo Clinic Labs', 'Regional Medical Center'];
  const locations = ['Main Lab - Downtown', 'Northside Clinic', 'Westfield Medical', 'Central Hospital'];

  let resultId = 1;

  mockProfiles.forEach(profile => {
    // Generate 55-65 test results per profile over 3 years (adults) or fewer for children
    const isChild = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() < 18;
    const numResults = isChild ? Math.floor(30 + Math.random() * 15) : Math.floor(55 + Math.random() * 11); // 30-45 for kids, 55-65 for adults
    const dayRange = isChild ? 1095 : 1095; // 3 years for all
    
    for (let i = 0; i < numResults; i++) {
      const daysAgo = Math.floor(Math.random() * dayRange); // Random day in past period
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - daysAgo);

      const panel = testNames[Math.floor(Math.random() * testNames.length)];
      let biomarkers: MockTestResult['biomarkers'] = [];

      // Generate biomarkers based on test type
      switch (panel) {
        case 'Complete Blood Count (CBC)':
          biomarkers = [
            { name: 'White Blood Cells', value: (4.5 + Math.random() * 6).toFixed(1), unit: 'K/μL', referenceRange: { min: 4.5, max: 11.0 }, range: '4.5-11.0 K/μL' },
            { name: 'Red Blood Cells', value: (4.2 + Math.random() * 1.5).toFixed(2), unit: 'M/μL', referenceRange: { min: 4.2, max: 5.8 }, range: '4.2-5.8 M/μL' },
            { name: 'Hemoglobin', value: (12 + Math.random() * 6).toFixed(1), unit: 'g/dL', referenceRange: { min: 12.0, max: 18.0 }, range: '12.0-18.0 g/dL' },
            { name: 'Hematocrit', value: (36 + Math.random() * 18).toFixed(1), unit: '%', referenceRange: { min: 36, max: 54 }, range: '36-54%' },
            { name: 'Platelets', value: Math.floor(150 + Math.random() * 300).toString(), unit: 'K/μL', referenceRange: { min: 150, max: 450 }, range: '150-450 K/μL' }
          ];
          break;

        case 'Comprehensive Metabolic Panel':
          biomarkers = [
            { name: 'Glucose', value: (70 + Math.random() * 60).toFixed(0), unit: 'mg/dL', referenceRange: { min: 70, max: 100 }, range: '70-100 mg/dL' },
            { name: 'BUN', value: (7 + Math.random() * 18).toFixed(0), unit: 'mg/dL', referenceRange: { min: 7, max: 25 }, range: '7-25 mg/dL' },
            { name: 'Creatinine', value: (0.6 + Math.random() * 0.7).toFixed(2), unit: 'mg/dL', referenceRange: { min: 0.6, max: 1.3 }, range: '0.6-1.3 mg/dL' },
            { name: 'Sodium', value: (135 + Math.random() * 10).toFixed(0), unit: 'mmol/L', referenceRange: { min: 135, max: 145 }, range: '135-145 mmol/L' },
            { name: 'Potassium', value: (3.5 + Math.random() * 1.5).toFixed(1), unit: 'mmol/L', referenceRange: { min: 3.5, max: 5.0 }, range: '3.5-5.0 mmol/L' },
            { name: 'Chloride', value: (96 + Math.random() * 10).toFixed(0), unit: 'mmol/L', referenceRange: { min: 96, max: 106 }, range: '96-106 mmol/L' },
            { name: 'CO2', value: (20 + Math.random() * 9).toFixed(0), unit: 'mmol/L', referenceRange: { min: 20, max: 29 }, range: '20-29 mmol/L' }
          ];
          break;

        case 'Lipid Panel':
          biomarkers = [
            { name: 'Total Cholesterol', value: (120 + Math.random() * 120).toFixed(0), unit: 'mg/dL', referenceRange: { text: '<200 mg/dL' }, range: '<200 mg/dL' },
            { name: 'LDL Cholesterol', value: (50 + Math.random() * 100).toFixed(0), unit: 'mg/dL', referenceRange: { text: '<100 mg/dL' }, range: '<100 mg/dL' },
            { name: 'HDL Cholesterol', value: (30 + Math.random() * 50).toFixed(0), unit: 'mg/dL', referenceRange: { text: '>40 mg/dL (M), >50 mg/dL (F)' }, range: '>40 mg/dL (M), >50 mg/dL (F)' },
            { name: 'Triglycerides', value: (50 + Math.random() * 200).toFixed(0), unit: 'mg/dL', referenceRange: { text: '<150 mg/dL' }, range: '<150 mg/dL' }
          ];
          break;

        case 'Thyroid Function Tests':
          biomarkers = [
            { name: 'TSH', value: (0.4 + Math.random() * 4.6).toFixed(2), unit: 'mIU/L', referenceRange: { min: 0.4, max: 5.0 }, range: '0.4-5.0 mIU/L' },
            { name: 'Free T4', value: (0.8 + Math.random() * 1.0).toFixed(2), unit: 'ng/dL', referenceRange: { min: 0.8, max: 1.8 }, range: '0.8-1.8 ng/dL' },
            { name: 'Free T3', value: (2.3 + Math.random() * 1.9).toFixed(1), unit: 'pg/mL', referenceRange: { min: 2.3, max: 4.2 }, range: '2.3-4.2 pg/mL' }
          ];
          break;

        case 'Liver Function Tests':
          biomarkers = [
            { name: 'ALT', value: (7 + Math.random() * 49).toFixed(0), unit: 'U/L', referenceRange: { min: 7, max: 56 }, range: '7-56 U/L' },
            { name: 'AST', value: (10 + Math.random() * 30).toFixed(0), unit: 'U/L', referenceRange: { min: 10, max: 40 }, range: '10-40 U/L' },
            { name: 'Alkaline Phosphatase', value: (44 + Math.random() * 103).toFixed(0), unit: 'U/L', referenceRange: { min: 44, max: 147 }, range: '44-147 U/L' },
            { name: 'Total Bilirubin', value: (0.1 + Math.random() * 1.1).toFixed(2), unit: 'mg/dL', referenceRange: { min: 0.1, max: 1.2 }, range: '0.1-1.2 mg/dL' }
          ];
          break;

        case 'Kidney Function Tests':
          biomarkers = [
            { name: 'Creatinine', value: (0.6 + Math.random() * 0.7).toFixed(2), unit: 'mg/dL', referenceRange: { min: 0.6, max: 1.3 }, range: '0.6-1.3 mg/dL' },
            { name: 'BUN', value: (7 + Math.random() * 18).toFixed(0), unit: 'mg/dL', referenceRange: { min: 7, max: 25 }, range: '7-25 mg/dL' },
            { name: 'eGFR', value: (60 + Math.random() * 60).toFixed(0), unit: 'mL/min/1.73m²', referenceRange: { text: '>60' }, range: '>60' },
            { name: 'Protein (Urine)', value: (0 + Math.random() * 20).toFixed(0), unit: 'mg/dL', referenceRange: { text: '<20 mg/dL' }, range: '<20 mg/dL' }
          ];
          break;

        case 'Hemoglobin A1C':
          biomarkers = [
            { name: 'Hemoglobin A1C', value: (4.5 + Math.random() * 3).toFixed(1), unit: '%', referenceRange: { text: '<5.7% (Normal), 5.7-6.4% (Prediabetic), ≥6.5% (Diabetic)' }, range: '<5.7% (Normal)' }
          ];
          break;

        case 'Vitamin D Test':
          biomarkers = [
            { name: 'Vitamin D, 25-OH', value: (10 + Math.random() * 70).toFixed(0), unit: 'ng/mL', referenceRange: { text: '30-100 ng/mL' }, range: '30-100 ng/mL' }
          ];
          break;

        case 'Iron Studies':
          biomarkers = [
            { name: 'Iron', value: (60 + Math.random() * 120).toFixed(0), unit: 'μg/dL', referenceRange: { min: 60, max: 180 }, range: '60-180 μg/dL' },
            { name: 'TIBC', value: (250 + Math.random() * 200).toFixed(0), unit: 'μg/dL', referenceRange: { min: 250, max: 450 }, range: '250-450 μg/dL' },
            { name: 'Ferritin', value: (15 + Math.random() * 285).toFixed(0), unit: 'ng/mL', referenceRange: { text: '15-300 ng/mL (M), 15-150 ng/mL (F)' }, range: '15-300 ng/mL (M)' }
          ];
          break;

        case 'Inflammatory Markers':
          biomarkers = [
            { name: 'C-Reactive Protein', value: (0.1 + Math.random() * 2.9).toFixed(2), unit: 'mg/L', referenceRange: { text: '<3.0 mg/L' }, range: '<3.0 mg/L' },
            { name: 'ESR', value: (1 + Math.random() * 29).toFixed(0), unit: 'mm/hr', referenceRange: { text: '<30 mm/hr' }, range: '<30 mm/hr' }
          ];
          break;

        case 'Cardiac Risk Panel':
          biomarkers = [
            { name: 'Troponin I', value: (0.01 + Math.random() * 0.09).toFixed(3), unit: 'ng/mL', referenceRange: { text: '<0.10 ng/mL' }, range: '<0.10 ng/mL' },
            { name: 'BNP', value: (10 + Math.random() * 90).toFixed(0), unit: 'pg/mL', referenceRange: { text: '<100 pg/mL' }, range: '<100 pg/mL' },
            { name: 'Homocysteine', value: (5 + Math.random() * 10).toFixed(1), unit: 'μmol/L', referenceRange: { min: 5, max: 15 }, range: '5-15 μmol/L' },
            { name: 'Lipoprotein(a)', value: (5 + Math.random() * 25).toFixed(0), unit: 'mg/dL', referenceRange: { text: '<30 mg/dL' }, range: '<30 mg/dL' }
          ];
          break;

        case 'Hormone Panel':
          biomarkers = profile.gender === 'male' ? [
            { name: 'Testosterone', value: (300 + Math.random() * 700).toFixed(0), unit: 'ng/dL', referenceRange: { min: 300, max: 1000 }, range: '300-1000 ng/dL' },
            { name: 'DHEA-S', value: (80 + Math.random() * 320).toFixed(0), unit: 'μg/dL', referenceRange: { min: 80, max: 400 }, range: '80-400 μg/dL' },
            { name: 'Cortisol', value: (6 + Math.random() * 17).toFixed(1), unit: 'μg/dL', referenceRange: { min: 6, max: 23 }, range: '6-23 μg/dL' },
            { name: 'Growth Hormone', value: (0.1 + Math.random() * 4.9).toFixed(2), unit: 'ng/mL', referenceRange: { min: 0.1, max: 5.0 }, range: '0.1-5.0 ng/mL' }
          ] : [
            { name: 'Estradiol', value: (30 + Math.random() * 370).toFixed(0), unit: 'pg/mL', referenceRange: { text: '30-400 pg/mL' }, range: '30-400 pg/mL' },
            { name: 'Progesterone', value: (0.2 + Math.random() * 25).toFixed(1), unit: 'ng/mL', referenceRange: { text: '0.2-25 ng/mL' }, range: '0.2-25 ng/mL' },
            { name: 'DHEA-S', value: (35 + Math.random() * 415).toFixed(0), unit: 'μg/dL', referenceRange: { min: 35, max: 450 }, range: '35-450 μg/dL' },
            { name: 'Cortisol', value: (6 + Math.random() * 17).toFixed(1), unit: 'μg/dL', referenceRange: { min: 6, max: 23 }, range: '6-23 μg/dL' }
          ];
          break;

        case 'Nutrient Status Panel':
          biomarkers = [
            { name: 'Vitamin B12', value: (200 + Math.random() * 700).toFixed(0), unit: 'pg/mL', referenceRange: { min: 200, max: 900 }, range: '200-900 pg/mL' },
            { name: 'Folate', value: (3 + Math.random() * 17).toFixed(1), unit: 'ng/mL', referenceRange: { min: 3, max: 20 }, range: '3-20 ng/mL' },
            { name: 'Magnesium', value: (1.7 + Math.random() * 0.5).toFixed(2), unit: 'mg/dL', referenceRange: { min: 1.7, max: 2.2 }, range: '1.7-2.2 mg/dL' },
            { name: 'Zinc', value: (70 + Math.random() * 50).toFixed(0), unit: 'μg/dL', referenceRange: { min: 70, max: 120 }, range: '70-120 μg/dL' },
            { name: 'Selenium', value: (70 + Math.random() * 80).toFixed(0), unit: 'μg/L', referenceRange: { min: 70, max: 150 }, range: '70-150 μg/L' }
          ];
          break;

        case 'Autoimmune Panel':
          biomarkers = [
            { name: 'ANA', value: Math.random() > 0.9 ? '1:160' : 'Negative', unit: '', referenceRange: { text: 'Negative' }, range: 'Negative' },
            { name: 'Anti-CCP', value: (0 + Math.random() * 10).toFixed(1), unit: 'U/mL', referenceRange: { text: '<20 U/mL' }, range: '<20 U/mL' },
            { name: 'Rheumatoid Factor', value: (0 + Math.random() * 15).toFixed(0), unit: 'IU/mL', referenceRange: { text: '<20 IU/mL' }, range: '<20 IU/mL' },
            { name: 'Anti-TPO', value: (0 + Math.random() * 30).toFixed(0), unit: 'IU/mL', referenceRange: { text: '<35 IU/mL' }, range: '<35 IU/mL' }
          ];
          break;

        case 'Metabolic Health Panel':
          biomarkers = [
            { name: 'Insulin', value: (2 + Math.random() * 23).toFixed(1), unit: 'μIU/mL', referenceRange: { min: 2, max: 25 }, range: '2-25 μIU/mL' },
            { name: 'HOMA-IR', value: (0.5 + Math.random() * 2.5).toFixed(2), unit: '', referenceRange: { text: '<2.5' }, range: '<2.5' },
            { name: 'Adiponectin', value: (4 + Math.random() * 26).toFixed(1), unit: 'μg/mL', referenceRange: { min: 4, max: 30 }, range: '4-30 μg/mL' },
            { name: 'Leptin', value: (1 + Math.random() * 49).toFixed(1), unit: 'ng/mL', referenceRange: { text: '1-50 ng/mL' }, range: '1-50 ng/mL' }
          ];
          break;

        case 'Cancer Markers':
          biomarkers = profile.gender === 'male' ? [
            { name: 'PSA', value: (0.1 + Math.random() * 3.9).toFixed(2), unit: 'ng/mL', referenceRange: { text: '<4.0 ng/mL' }, range: '<4.0 ng/mL' },
            { name: 'CEA', value: (0.5 + Math.random() * 4.5).toFixed(2), unit: 'ng/mL', referenceRange: { text: '<5.0 ng/mL' }, range: '<5.0 ng/mL' },
            { name: 'Alpha-fetoprotein', value: (1 + Math.random() * 9).toFixed(1), unit: 'ng/mL', referenceRange: { text: '<10 ng/mL' }, range: '<10 ng/mL' }
          ] : [
            { name: 'CA 125', value: (5 + Math.random() * 30).toFixed(1), unit: 'U/mL', referenceRange: { text: '<35 U/mL' }, range: '<35 U/mL' },
            { name: 'CA 15-3', value: (5 + Math.random() * 25).toFixed(1), unit: 'U/mL', referenceRange: { text: '<30 U/mL' }, range: '<30 U/mL' },
            { name: 'CEA', value: (0.5 + Math.random() * 4.5).toFixed(2), unit: 'ng/mL', referenceRange: { text: '<5.0 ng/mL' }, range: '<5.0 ng/mL' }
          ];
          break;

        case 'Bone Health Panel':
          biomarkers = [
            { name: 'Calcium', value: (8.5 + Math.random() * 2.0).toFixed(1), unit: 'mg/dL', referenceRange: { min: 8.5, max: 10.5 }, range: '8.5-10.5 mg/dL' },
            { name: 'Phosphorus', value: (2.5 + Math.random() * 2.0).toFixed(1), unit: 'mg/dL', referenceRange: { min: 2.5, max: 4.5 }, range: '2.5-4.5 mg/dL' },
            { name: 'Parathyroid Hormone', value: (10 + Math.random() * 55).toFixed(0), unit: 'pg/mL', referenceRange: { min: 10, max: 65 }, range: '10-65 pg/mL' },
            { name: 'Osteocalcin', value: (4 + Math.random() * 46).toFixed(1), unit: 'ng/mL', referenceRange: { min: 4, max: 50 }, range: '4-50 ng/mL' },
            { name: 'CTX', value: (50 + Math.random() * 550).toFixed(0), unit: 'pg/mL', referenceRange: { text: '50-600 pg/mL' }, range: '50-600 pg/mL' }
          ];
          break;
      }

      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

      results.push({
        id: `result-demo-${resultId++}`,
        profileId: profile.id,
        profileName: profile.name,
        date: testDate.toISOString().split('T')[0],
        time: timeString,
        lab: providers[Math.floor(Math.random() * providers.length)],
        panel,
        tags: ['demo'],
        notes: Math.random() > 0.7 ? 'Routine checkup' : undefined,
        createdAt: testDate.toISOString(),
        modifiedAt: testDate.toISOString(),
        biomarkers
      });
    }
  });

  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate reminders
const generateMockReminders = (): MockReminder[] => {
  const reminders: MockReminder[] = [];
  let reminderId = 1;

  mockProfiles.forEach(profile => {
    const isChild = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() < 18;
    
    // Different reminder templates for adults vs children
    const reminderTemplates = isChild ? [
      { title: 'Annual Pediatric Checkup', description: 'Yearly physical exam with pediatrician', category: 'appointment' as const, frequency: 'yearly' as const },
      { title: 'School Physical', description: 'Required physical examination for school', category: 'appointment' as const, frequency: 'yearly' as const },
      { title: 'Vaccination Update', description: 'Check vaccination schedule with doctor', category: 'test' as const, frequency: 'yearly' as const },
      { title: 'Growth Measurement', description: 'Height and weight tracking appointment', category: 'test' as const, frequency: 'yearly' as const },
      { title: 'Dental Cleaning', description: 'Pediatric dental checkup and cleaning', category: 'appointment' as const, frequency: 'monthly' as const },
      { title: 'Vision Screening', description: 'Annual eye exam for children', category: 'appointment' as const, frequency: 'yearly' as const },
      { title: 'Daily Vitamin', description: 'Take children\'s multivitamin', category: 'medication' as const, frequency: 'daily' as const },
      { title: 'Outdoor Play Time', description: 'At least 1 hour of active play outside', category: 'lifestyle' as const, frequency: 'daily' as const },
    ] : [
      { title: 'Annual Physical Exam', description: 'Schedule your yearly comprehensive physical examination', category: 'appointment' as const, frequency: 'yearly' as const },
      { title: 'Blood Pressure Check', description: 'Monitor blood pressure levels', category: 'test' as const, frequency: 'monthly' as const },
      { title: 'Cholesterol Screening', description: 'Lipid panel blood test', category: 'test' as const, frequency: 'yearly' as const },
      { title: 'Mammogram Screening', description: 'Annual mammogram (if applicable)', category: 'test' as const, frequency: 'yearly' as const },
      { title: 'Colonoscopy Screening', description: 'Preventive colonoscopy (age 50+)', category: 'test' as const, frequency: 'yearly' as const },
      { title: 'Dental Cleaning', description: 'Professional dental cleaning and checkup', category: 'appointment' as const, frequency: 'monthly' as const },
      { title: 'Eye Exam', description: 'Comprehensive eye examination', category: 'appointment' as const, frequency: 'yearly' as const },
      { title: 'Vitamin D Check', description: 'Test vitamin D levels', category: 'test' as const, frequency: 'yearly' as const },
      { title: 'Take Daily Multivitamin', description: 'Remember to take your daily multivitamin', category: 'medication' as const, frequency: 'daily' as const },
      { title: 'Exercise Routine', description: '30 minutes of moderate exercise', category: 'lifestyle' as const, frequency: 'daily' as const },
      { title: 'Hydration Check', description: 'Drink at least 8 glasses of water', category: 'lifestyle' as const, frequency: 'daily' as const },
      { title: 'Skin Cancer Screening', description: 'Dermatology appointment for skin check', category: 'appointment' as const, frequency: 'yearly' as const }
    ];

    reminderTemplates.forEach((template, index) => {
      // Create more realistic due dates with times
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 120) - 60); // Random date ±60 days
      
      // Add realistic times based on reminder type
      if (template.category === 'appointment') {
        // Appointments during business hours
        const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
        const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // Common appointment times
        dueDate.setHours(hours, minutes, 0, 0);
      } else if (template.frequency === 'daily') {
        // Daily reminders at consistent times
        if (template.category === 'medication') {
          dueDate.setHours(8, 0, 0, 0); // Morning medication
        } else if (template.title.includes('Exercise')) {
          dueDate.setHours(18, 0, 0, 0); // Evening exercise
        } else {
          dueDate.setHours(12, 0, 0, 0); // Midday reminders
        }
      }

      // Enhance description with time for appointments
      let enhancedDescription = template.description;
      if (template.category === 'appointment') {
        const timeString = dueDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        enhancedDescription += ` - Scheduled for ${timeString}`;
      }

      reminders.push({
        id: `reminder-demo-${reminderId++}`,
        profileId: profile.id,
        title: template.title,
        description: enhancedDescription,
        dueDate: dueDate.toISOString().split('T')[0],
        frequency: template.frequency,
        isCompleted: Math.random() > 0.75, // 25% chance of being completed
        category: template.category
      });
    });
  });

  return reminders;
};

// Export functions to generate data when needed
export const getMockTestResults = () => generateMockResults();
export const getMockReminders = () => generateMockReminders();

// Settings for demo mode
export const mockSettings = {
  theme: 'light',
  notifications: {
    email: true,
    push: false,
    sms: false
  },
  privacy: {
    shareData: false,
    analytics: true
  },
  backup: {
    autoBackup: false,
    frequency: 'weekly'
  }
};

// Demo mode helper functions
export const isDemoMode = (): boolean => {
  return localStorage.getItem('biomarkr-demo-mode') === 'true';
};

export const enableDemoMode = (): void => {
  localStorage.setItem('biomarkr-demo-mode', 'true');
  localStorage.setItem('biomarkr-onboarded', 'true');
  
  // Generate and load demo data into localStorage
  const testResults = getMockTestResults();
  const reminders = getMockReminders();
  
  localStorage.setItem('biomarkr-profiles', JSON.stringify(mockProfiles));
  localStorage.setItem('biomarkr-test-results', JSON.stringify(testResults));
  localStorage.setItem('biomarkr-reminders', JSON.stringify(reminders));
  localStorage.setItem('biomarkr-settings', JSON.stringify(mockSettings));
  
  // Set active profile to the first demo profile
  localStorage.setItem('biomarkr-active-profile', mockProfiles[0].id);
  
};

export const disableDemoMode = (): void => {
  localStorage.removeItem('biomarkr-demo-mode');
  
  // Clear demo data
  localStorage.removeItem('biomarkr-profiles');
  localStorage.removeItem('biomarkr-test-results');
  localStorage.removeItem('biomarkr-reminders');
  localStorage.removeItem('biomarkr-settings');
  localStorage.removeItem('biomarkr-active-profile');
  localStorage.removeItem('biomarkr-onboarded');
};

// Force demo mode (for debugging)
export const forceDemoMode = (): void => {
  // Clear any existing data
  disableDemoMode();
  
  // Enable demo mode
  enableDemoMode();
  
  // Demo mode forced - page will reload
  setTimeout(() => {
    window.location.reload();
  }, 100);
};