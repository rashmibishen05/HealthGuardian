export interface Medicine {
  name: string
  genericName?: string
  uses: string
  dosage: string
  warnings: string
  sideEffects: string[]
}

// Common medicines database
export const medicinesDatabase: Medicine[] = [
  {
    name: 'Paracetamol (Acetaminophen)',
    genericName: 'Paracetamol',
    uses: 'Pain relief, fever reduction. Used for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.',
    dosage: 'Adults: 500-1000mg every 4-6 hours. Maximum 4000mg per day. Children: Consult doctor for proper dosing based on weight.',
    warnings: 'Do not exceed recommended dose. Overdose can cause serious liver damage. Avoid alcohol while taking this medication. Consult doctor if pregnant or breastfeeding.',
    sideEffects: ['Rare allergic reactions', 'Liver damage with overdose', 'Skin rash'],
  },
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    uses: 'Anti-inflammatory, pain relief, fever reduction. Used for headaches, dental pain, menstrual cramps, muscle aches, arthritis.',
    dosage: 'Adults: 200-400mg every 4-6 hours. Maximum 1200mg per day without medical supervision. Take with food or milk.',
    warnings: 'May increase risk of heart attack or stroke. Can cause stomach bleeding. Avoid if you have kidney problems, heart disease, or stomach ulcers. Not for children under 6 months.',
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness', 'Kidney problems', 'High blood pressure'],
  },
  {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    uses: 'Pain relief, fever reduction, anti-inflammatory, blood thinner. Used for heart attack prevention, stroke prevention, headaches.',
    dosage: 'Adults: 325-650mg every 4 hours for pain. Low-dose (81mg) daily for heart protection. Take with food.',
    warnings: 'NOT for children or teenagers with flu or chickenpox (risk of Reye\'s syndrome). Increases bleeding risk. Avoid before surgery. Can cause stomach ulcers.',
    sideEffects: ['Stomach bleeding', 'Heartburn', 'Upset stomach', 'Easy bruising', 'Ringing in ears'],
  },
  {
    name: 'Cetirizine',
    genericName: 'Cetirizine',
    uses: 'Antihistamine for allergies. Treats hay fever, hives, itching, sneezing, runny nose, watery eyes.',
    dosage: 'Adults and children 6+: 5-10mg once daily. Can be taken with or without food.',
    warnings: 'May cause drowsiness. Avoid alcohol and driving until you know how it affects you. Consult doctor if pregnant or breastfeeding.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache', 'Stomach pain'],
  },
  {
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    uses: 'Proton pump inhibitor. Reduces stomach acid. Treats GERD, heartburn, stomach ulcers, Zollinger-Ellison syndrome.',
    dosage: 'Adults: 20-40mg once daily before breakfast. Swallow capsule whole, do not crush or chew.',
    warnings: 'May decrease absorption of vitamin B12, calcium, and magnesium. Long-term use may increase bone fracture risk. Do not use for immediate heartburn relief.',
    sideEffects: ['Headache', 'Stomach pain', 'Nausea', 'Diarrhea', 'Vitamin deficiencies with long-term use'],
  },
  {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    uses: 'Antibiotic for bacterial infections. Treats ear infections, pneumonia, bronchitis, UTIs, skin infections.',
    dosage: 'Adults: 250-500mg every 8 hours or 500-875mg every 12 hours. Complete full course even if feeling better.',
    warnings: 'Do not use if allergic to penicillin. Can reduce effectiveness of birth control pills. May cause false positive urine glucose tests. MUST complete full prescribed course.',
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Yeast infection', 'Allergic reactions'],
  },
  {
    name: 'Metformin',
    genericName: 'Metformin',
    uses: 'Diabetes medication. Controls blood sugar in type 2 diabetes. May help with weight loss and PCOS.',
    dosage: 'Adults: Start 500mg twice daily with meals. May increase gradually to 2000mg per day. Extended-release: Once daily.',
    warnings: 'May cause lactic acidosis (rare but serious). Stop before surgeries or imaging with contrast dye. Monitor kidney function. Avoid excessive alcohol.',
    sideEffects: ['Diarrhea', 'Nausea', 'Stomach upset', 'Metallic taste', 'Vitamin B12 deficiency'],
  },
  {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    uses: 'ACE inhibitor. Treats high blood pressure, heart failure, improves survival after heart attack.',
    dosage: 'Adults: Start 10mg once daily. May increase to 20-40mg daily. Take at same time each day.',
    warnings: 'NOT for pregnant women (can harm fetus). May cause dangerous potassium levels. Monitor kidney function. Can cause severe allergic reactions with swelling.',
    sideEffects: ['Dizziness', 'Dry cough', 'Headache', 'Fatigue', 'Low blood pressure', 'High potassium'],
  },
  {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    uses: 'Statin medication. Lowers cholesterol and triglycerides. Reduces risk of heart attack and stroke.',
    dosage: 'Adults: 10-80mg once daily. Can take with or without food. Usually taken in evening.',
    warnings: 'Avoid grapefruit juice (increases drug levels). May cause muscle damage (rare). Monitor liver function. Not for pregnant or breastfeeding women.',
    sideEffects: ['Muscle pain', 'Joint pain', 'Diarrhea', 'Memory issues', 'Increased blood sugar'],
  },
  {
    name: 'Levothyroxine',
    genericName: 'Levothyroxine',
    uses: 'Thyroid hormone replacement. Treats hypothyroidism (underactive thyroid).',
    dosage: 'Adults: Dose varies widely (25-200mcg daily). Take on empty stomach, 30-60 minutes before breakfast. Same brand/time daily.',
    warnings: 'Do not stop suddenly. Regular blood tests needed to adjust dose. Many drug interactions. Separate from calcium/iron supplements by 4 hours.',
    sideEffects: ['Heart palpitations', 'Weight changes', 'Tremor', 'Insomnia', 'Heat intolerance'],
  },
  {
    name: 'Salbutamol (Albuterol)',
    genericName: 'Salbutamol',
    uses: 'Bronchodilator inhaler. Treats and prevents asthma attacks, exercise-induced bronchospasm, COPD.',
    dosage: 'Adults: 1-2 puffs every 4-6 hours as needed. For prevention: 2 puffs 15 minutes before exercise.',
    warnings: 'Overuse can be dangerous. If needing more than usual, see doctor (may indicate worsening condition). Rinse mouth after use.',
    sideEffects: ['Tremor', 'Nervousness', 'Rapid heartbeat', 'Headache', 'Dizziness'],
  },
  {
    name: 'Diphenhydramine',
    genericName: 'Diphenhydramine',
    uses: 'Antihistamine and sleep aid. Treats allergies, hay fever, common cold symptoms, insomnia, motion sickness.',
    dosage: 'Adults: 25-50mg every 4-6 hours. Maximum 300mg per day. For sleep: 50mg at bedtime.',
    warnings: 'Causes drowsiness - do not drive or operate machinery. Avoid alcohol. Can cause confusion in elderly. Not for children under 2.',
    sideEffects: ['Severe drowsiness', 'Dry mouth', 'Dizziness', 'Constipation', 'Blurred vision', 'Confusion'],
  },
]

export function searchMedicine(query: string): Medicine[] {
  const searchTerm = query.toLowerCase().trim()
  
  if (!searchTerm) return []
  
  return medicinesDatabase.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchTerm))
  )
}
