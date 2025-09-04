// Unit conversion utilities for biomarkers

export interface UnitConversion {
  from: string;
  to: string;
  factor: number;
  offset?: number;
}

// Common unit conversions for lab values
export const UNIT_CONVERSIONS: UnitConversion[] = [
  // Glucose
  { from: 'mg/dL', to: 'mmol/L', factor: 0.0555 },
  { from: 'mmol/L', to: 'mg/dL', factor: 18.0 },

  // Cholesterol (Total, LDL, HDL)
  { from: 'mg/dL', to: 'mmol/L', factor: 0.02586 },
  { from: 'mmol/L', to: 'mg/dL', factor: 38.67 },

  // Triglycerides
  { from: 'mg/dL', to: 'mmol/L', factor: 0.01129 },
  { from: 'mmol/L', to: 'mg/dL', factor: 88.57 },

  // Creatinine
  { from: 'mg/dL', to: 'umol/L', factor: 88.4 },
  { from: 'umol/L', to: 'mg/dL', factor: 0.01131 },

  // BUN (Blood Urea Nitrogen)
  { from: 'mg/dL', to: 'mmol/L', factor: 0.357 },
  { from: 'mmol/L', to: 'mg/dL', factor: 2.8 },

  // Hemoglobin
  { from: 'g/dL', to: 'g/L', factor: 10 },
  { from: 'g/L', to: 'g/dL', factor: 0.1 },

  // Vitamin D
  { from: 'ng/mL', to: 'nmol/L', factor: 2.5 },
  { from: 'nmol/L', to: 'ng/mL', factor: 0.4 },

  // Iron
  { from: 'ug/dL', to: 'umol/L', factor: 0.179 },
  { from: 'umol/L', to: 'ug/dL', factor: 5.587 },

  // Ferritin
  { from: 'ng/mL', to: 'ug/L', factor: 1 },
  { from: 'ug/L', to: 'ng/mL', factor: 1 },

  // TSH
  { from: 'mIU/L', to: 'uIU/mL', factor: 1 },
  { from: 'uIU/mL', to: 'mIU/L', factor: 1 },

  // Free T4
  { from: 'ng/dL', to: 'pmol/L', factor: 12.87 },
  { from: 'pmol/L', to: 'ng/dL', factor: 0.0777 },

  // Free T3
  { from: 'pg/mL', to: 'pmol/L', factor: 1.536 },
  { from: 'pmol/L', to: 'pg/mL', factor: 0.651 },

  // HbA1c
  { from: '%', to: 'mmol/mol', factor: 10.93, offset: -23.5 },
  { from: 'mmol/mol', to: '%', factor: 0.09148, offset: 2.152 },

  // CRP
  { from: 'mg/L', to: 'mg/dL', factor: 0.1 },
  { from: 'mg/dL', to: 'mg/L', factor: 10 },

  // Electrolytes (usually the same between systems)
  { from: 'mEq/L', to: 'mmol/L', factor: 1 },
  { from: 'mmol/L', to: 'mEq/L', factor: 1 }
];

export function convertValue(value: number, fromUnit: string, toUnit: string): number | null {
  if (fromUnit === toUnit) return value;

  const conversion = UNIT_CONVERSIONS.find(
    c => c.from === fromUnit && c.to === toUnit
  );

  if (!conversion) return null;

  let result = value * conversion.factor;
  if (conversion.offset) {
    result += conversion.offset;
  }

  return Math.round(result * 1000) / 1000; // Round to 3 decimal places
}

export function getAvailableConversions(unit: string): string[] {
  return UNIT_CONVERSIONS
    .filter(c => c.from === unit)
    .map(c => c.to);
}

export function canConvert(fromUnit: string, toUnit: string): boolean {
  return UNIT_CONVERSIONS.some(c => c.from === fromUnit && c.to === toUnit);
}

export interface BiomarkerReference {
  biomarker: string;
  unit: string;
  references: Array<{
    low: number;
    high: number;
    source: string;
    population?: string;
    ageRange?: string;
    gender?: 'M' | 'F' | 'All';
  }>;
}

// Standard reference ranges for common biomarkers
export const REFERENCE_RANGES: BiomarkerReference[] = [
  {
    biomarker: 'Glucose',
    unit: 'mg/dL',
    references: [
      { low: 70, high: 100, source: 'Fasting - ADA Guidelines', population: 'Adults' },
      { low: 70, high: 140, source: 'Random - ADA Guidelines', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Total Cholesterol',
    unit: 'mg/dL',
    references: [
      { low: 0, high: 200, source: 'NCEP ATP III', population: 'Adults' }
    ]
  },
  {
    biomarker: 'HDL Cholesterol',
    unit: 'mg/dL',
    references: [
      { low: 40, high: 999, source: 'NCEP ATP III', gender: 'M' },
      { low: 50, high: 999, source: 'NCEP ATP III', gender: 'F' }
    ]
  },
  {
    biomarker: 'LDL Cholesterol',
    unit: 'mg/dL',
    references: [
      { low: 0, high: 100, source: 'NCEP ATP III', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Triglycerides',
    unit: 'mg/dL',
    references: [
      { low: 0, high: 150, source: 'NCEP ATP III', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Hemoglobin',
    unit: 'g/dL',
    references: [
      { low: 13.5, high: 17.5, source: 'WHO', gender: 'M' },
      { low: 12.0, high: 15.5, source: 'WHO', gender: 'F' }
    ]
  },
  {
    biomarker: 'White Blood Cells',
    unit: 'K/uL',
    references: [
      { low: 4.5, high: 11.0, source: 'Clinical Laboratory Standards', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Red Blood Cells',
    unit: 'M/uL',
    references: [
      { low: 4.5, high: 5.9, source: 'Clinical Laboratory Standards', gender: 'M' },
      { low: 4.0, high: 5.2, source: 'Clinical Laboratory Standards', gender: 'F' }
    ]
  },
  {
    biomarker: 'Hematocrit',
    unit: '%',
    references: [
      { low: 38.8, high: 50.0, source: 'Clinical Laboratory Standards', gender: 'M' },
      { low: 34.9, high: 44.5, source: 'Clinical Laboratory Standards', gender: 'F' }
    ]
  },
  {
    biomarker: 'Platelets',
    unit: 'K/uL',
    references: [
      { low: 150, high: 450, source: 'Clinical Laboratory Standards', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Creatinine',
    unit: 'mg/dL',
    references: [
      { low: 0.7, high: 1.3, source: 'NKDEP', gender: 'M' },
      { low: 0.6, high: 1.1, source: 'NKDEP', gender: 'F' }
    ]
  },
  {
    biomarker: 'BUN',
    unit: 'mg/dL',
    references: [
      { low: 7, high: 20, source: 'Clinical Laboratory Standards', population: 'Adults' }
    ]
  },
  {
    biomarker: 'TSH',
    unit: 'mIU/L',
    references: [
      { low: 0.4, high: 4.0, source: 'ATA Guidelines', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Free T4',
    unit: 'ng/dL',
    references: [
      { low: 0.8, high: 1.8, source: 'ATA Guidelines', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Free T3',
    unit: 'pg/mL',
    references: [
      { low: 2.3, high: 4.2, source: 'ATA Guidelines', population: 'Adults' }
    ]
  },
  {
    biomarker: 'HbA1c',
    unit: '%',
    references: [
      { low: 0, high: 5.7, source: 'ADA Guidelines - Normal', population: 'Adults' },
      { low: 5.7, high: 6.4, source: 'ADA Guidelines - Prediabetes', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Vitamin D, 25-OH',
    unit: 'ng/mL',
    references: [
      { low: 30, high: 100, source: 'Endocrine Society', population: 'Adults' }
    ]
  },
  {
    biomarker: 'Iron',
    unit: 'ug/dL',
    references: [
      { low: 60, high: 170, source: 'Clinical Laboratory Standards', gender: 'M' },
      { low: 60, high: 140, source: 'Clinical Laboratory Standards', gender: 'F' }
    ]
  },
  {
    biomarker: 'Ferritin',
    unit: 'ng/mL',
    references: [
      { low: 12, high: 300, source: 'Clinical Laboratory Standards', gender: 'M' },
      { low: 12, high: 150, source: 'Clinical Laboratory Standards', gender: 'F' }
    ]
  },
  {
    biomarker: 'CRP',
    unit: 'mg/L',
    references: [
      { low: 0, high: 3.0, source: 'Clinical Laboratory Standards', population: 'Adults' }
    ]
  }
];

export function getReferenceRanges(biomarkerName: string, unit: string): BiomarkerReference | null {
  const reference = REFERENCE_RANGES.find(r => 
    r.biomarker.toLowerCase() === biomarkerName.toLowerCase()
  );
  
  if (!reference) return null;

  // Convert reference ranges to the requested unit if needed
  if (reference.unit === unit) return reference;

  const convertedReferences = reference.references.map(ref => {
    const convertedLow = convertValue(ref.low, reference.unit, unit);
    const convertedHigh = convertValue(ref.high, reference.unit, unit);
    
    if (convertedLow === null || convertedHigh === null) return ref;
    
    return {
      ...ref,
      low: convertedLow,
      high: convertedHigh
    };
  });

  return {
    ...reference,
    unit,
    references: convertedReferences
  };
}

export function suggestReferenceRange(biomarkerName: string, unit: string, gender?: 'M' | 'F'): {
  low: number;
  high: number;
  source: string;
} | null {
  const reference = getReferenceRanges(biomarkerName, unit);
  if (!reference) return null;

  // Find the most appropriate reference range
  let bestRange = reference.references[0];

  // Prefer gender-specific ranges if available
  if (gender) {
    const genderSpecific = reference.references.find(r => r.gender === gender);
    if (genderSpecific) bestRange = genderSpecific;
  }

  // Prefer adult ranges if available
  const adultRange = reference.references.find(r => 
    r.population === 'Adults' || !r.ageRange
  );
  if (adultRange) bestRange = adultRange;

  return {
    low: bestRange.low,
    high: bestRange.high,
    source: bestRange.source
  };
}

export function getUnitPreferences(): Record<string, string[]> {
  return {
    'Glucose': ['mg/dL', 'mmol/L'],
    'Total Cholesterol': ['mg/dL', 'mmol/L'],
    'HDL Cholesterol': ['mg/dL', 'mmol/L'],
    'LDL Cholesterol': ['mg/dL', 'mmol/L'],
    'Triglycerides': ['mg/dL', 'mmol/L'],
    'Creatinine': ['mg/dL', 'umol/L'],
    'BUN': ['mg/dL', 'mmol/L'],
    'Hemoglobin': ['g/dL', 'g/L'],
    'Hematocrit': ['%'],
    'White Blood Cells': ['K/uL', '10³/uL'],
    'Red Blood Cells': ['M/uL', '10⁶/uL'],
    'Platelets': ['K/uL', '10³/uL'],
    'TSH': ['mIU/L', 'uIU/mL'],
    'Free T4': ['ng/dL', 'pmol/L'],
    'Free T3': ['pg/mL', 'pmol/L'],
    'HbA1c': ['%', 'mmol/mol'],
    'Vitamin D, 25-OH': ['ng/mL', 'nmol/L'],
    'Iron': ['ug/dL', 'umol/L'],
    'Ferritin': ['ng/mL', 'ug/L'],
    'CRP': ['mg/L', 'mg/dL'],
    'Sodium': ['mEq/L', 'mmol/L'],
    'Potassium': ['mEq/L', 'mmol/L'],
    'Chloride': ['mEq/L', 'mmol/L']
  };
}