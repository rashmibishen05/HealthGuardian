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
    name: 'Paracetamol',
    genericName: 'Paracetamol / Acetaminophen',
    uses: 'Pain relief, fever reduction. Used for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.',
    dosage: 'Adults: 500-1000mg every 4-6 hours. Maximum 4000mg per day. Children: Consult doctor for proper dosing based on weight.',
    warnings: 'Do not exceed recommended dose. Overdose can cause serious liver damage. Avoid alcohol while taking this medication. Consult doctor if pregnant or breastfeeding.',
    sideEffects: ['Rare allergic reactions', 'Liver damage with overdose', 'Skin rash'],
  },
  {
    name: 'Dolo-650',
    genericName: 'Paracetamol (650mg)',
    uses: 'Antipyretic and analgesic. Highly effective for fever and body pain.',
    dosage: 'One tablet every 6 hours or as directed by physician.',
    warnings: 'Avoid if you have liver disease. Do not take with other paracetamol products.',
    sideEffects: ['Nausea', 'Allergic reaction'],
  },
  {
    name: 'Augmentin',
    genericName: 'Amoxicillin + Clavulanic Acid',
    uses: 'Broad-spectrum antibiotic for bacterial infections like throat, sinus, and ear infections.',
    dosage: '625mg twice daily after meals.',
    warnings: 'Finish full course. Do not use if allergic to Penicillin.',
    sideEffects: ['Diarrhea', 'Nausea'],
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
    name: 'Metformin',
    genericName: 'Metformin',
    uses: 'Diabetes medication. Controls blood sugar in type 2 diabetes. May help with weight loss and PCOS.',
    dosage: 'Adults: Start 500mg twice daily with meals. May increase gradually to 2000mg per day.',
    warnings: 'May cause lactic acidosis (rare but serious). Avoid excessive alcohol. Monitor kidney function.',
    sideEffects: ['Diarrhea', 'Nausea', 'Stomach upset', 'Metallic taste'],
  },
  {
    name: 'Atorvastatin (Lipitor)',
    genericName: 'Atorvastatin',
    uses: 'Lowers cholesterol and reduces risk of heart attack/stroke.',
    dosage: '10-80mg once daily.',
    warnings: 'Avoid grapefruit. Monitor liver function. Not for pregnancy.',
    sideEffects: ['Muscle pain', 'Joint pain', 'Diarrhea'],
  },
  {
    name: 'Lisinopril (Zestril)',
    genericName: 'Lisinopril',
    uses: 'Treats high blood pressure and heart failure.',
    dosage: '10-40mg once daily.',
    warnings: 'Can cause dry cough. Not for pregnancy.',
    sideEffects: ['Dizziness', 'Cough', 'Headache'],
  },
  {
    name: 'Levothyroxine (Synthroid)',
    genericName: 'Levothyroxine',
    uses: 'Thyroid hormone replacement for hypothyroidism.',
    dosage: '25-200mcg once daily on empty stomach.',
    warnings: 'Same brand/time daily. Regular blood tests needed.',
    sideEffects: ['Heart palpitations', 'Weight loss', 'Insomnia'],
  },
  {
    name: 'Salbutamol (Ventolin)',
    genericName: 'Salbutamol / Albuterol',
    uses: 'Rescue inhaler for asthma and COPD.',
    dosage: '1-2 puffs every 4-6 hours as needed.',
    warnings: 'Overuse can be dangerous. Rinse mouth after use.',
    sideEffects: ['Tremor', 'Nervousness', 'Rapid heartbeat'],
  },
  {
    name: 'Sertraline (Zoloft)',
    genericName: 'Sertraline',
    uses: 'Antidepressant (SSRI) for depression, anxiety, OCD, PTSD.',
    dosage: '50-200mg once daily.',
    warnings: 'Increased suicidal thoughts risk. Do not stop abruptly.',
    sideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction'],
  },
  {
    name: 'Amlodipine (Norvasc)',
    genericName: 'Amlodipine',
    uses: 'Treats high blood pressure and chest pain.',
    dosage: '2.5-10mg once daily.',
    warnings: 'May cause ankle swelling.',
    sideEffects: ['Swelling', 'Dizziness', 'Flushing'],
  },
  {
    name: 'Gabapentin (Neurontin)',
    genericName: 'Gabapentin',
    uses: 'Treats nerve pain and seizures.',
    dosage: '300-600mg three times daily.',
    warnings: 'May cause drowsiness. Avoid alcohol.',
    sideEffects: ['Dizziness', 'Drowsiness', 'Fatigue'],
  },
  {
    name: 'Omeprazole (Prilosec)',
    genericName: 'Omeprazole',
    uses: 'Reduces stomach acid. Treats GERD and ulcers.',
    dosage: '20-40mg once daily before breakfast.',
    warnings: 'Long-term use risk of bone fractures.',
    sideEffects: ['Headache', 'Stomach pain', 'Diarrhea'],
  },
  {
    name: 'Amoxicillin (Augmentin)',
    genericName: 'Amoxicillin',
    uses: 'Antibiotic for bacterial infections.',
    dosage: '250-500mg every 8-12 hours.',
    warnings: 'Do not use if allergic to penicillin. Finish full course.',
    sideEffects: ['Diarrhea', 'Nausea', 'Rash'],
  },
  {
    name: 'Alprazolam (Xanax)',
    genericName: 'Alprazolam',
    uses: 'Benzodiazepine for anxiety and panic disorders.',
    dosage: '0.25-0.5mg three times daily.',
    warnings: 'High addiction risk. Do not mix with alcohol.',
    sideEffects: ['Drowsiness', 'Dizziness', 'Memory issues'],
  },
  {
    name: 'Pantoprazole (Protonix)',
    genericName: 'Pantoprazole',
    uses: 'Treats GERD and high stomach acid.',
    dosage: '40mg once daily.',
    warnings: 'Long-term use may cause B12 deficiency.',
    sideEffects: ['Headache', 'Diarrhea', 'Gas'],
  },
  {
    name: 'Losartan (Cozaar)',
    genericName: 'Losartan',
    uses: 'Treats high blood pressure and kidney issues in diabetics.',
    dosage: '25-100mg daily.',
    warnings: 'Not for pregnancy. May cause high potassium.',
    sideEffects: ['Dizziness', 'Fatigue', 'Back pain'],
  },
  {
    name: 'Prednisone',
    genericName: 'Prednisone',
    uses: 'Steroid to reduce inflammation and immune response.',
    dosage: '5-60mg daily. Must taper off.',
    warnings: 'Do not stop suddenly. Increases infection risk.',
    sideEffects: ['Weight gain', 'Mood changes', 'High blood sugar'],
  },
  {
    name: 'Hydrochlorothiazide (HCTZ)',
    genericName: 'Hydrochlorothiazide',
    uses: 'Diuretic for high blood pressure and swelling.',
    dosage: '12.5-50mg once daily.',
    warnings: 'May cause dehydration and sun sensitivity.',
    sideEffects: ['Dizziness', 'Headache', 'Low potassium'],
  },
  {
    name: 'Warfarin (Coumadin)',
    genericName: 'Warfarin',
    uses: 'Blood thinner to prevent clots.',
    dosage: 'Varies by blood test results.',
    warnings: 'High bleeding risk. Consistent Vitamin K diet needed.',
    sideEffects: ['Easy bruising', 'Bleeding gums', 'Nosebleeds'],
  },
  {
    name: 'Doxycycline',
    genericName: 'Doxycycline',
    uses: 'Antibiotic for acne, UTIs, and malaria prevention.',
    dosage: '100mg twice daily.',
    warnings: 'Stay upright for 30 min after taking. Sun sensitivity.',
    sideEffects: ['Nausea', 'Sunburn risk', 'Stomach pain'],
  },
  {
    name: 'Loratadine (Claritin)',
    genericName: 'Loratadine',
    uses: 'Non-drowsy antihistamine for allergies.',
    dosage: '10mg once daily.',
    warnings: 'Consult doctor if liver/kidney disease exists.',
    sideEffects: ['Headache', 'Dry mouth', 'Fatigue'],
  },
  {
    name: 'Furosemide (Lasix)',
    genericName: 'Furosemide',
    uses: 'Water pill for edema and heart failure.',
    dosage: '20-80mg daily.',
    warnings: 'Monitor potassium and dehydration.',
    sideEffects: ['Frequent urination', 'Dizziness', 'Muscle cramps'],
  },
  {
    name: 'Montelukast (Singulair)',
    genericName: 'Montelukast',
    uses: 'Prevents asthma attacks and treats allergies.',
    dosage: '10mg once daily in evening.',
    warnings: 'Can cause mood/behavior changes.',
    sideEffects: ['Headache', 'Stomach pain', 'Mood changes'],
  },
  {
    name: 'Meloxicam (Mobic)',
    genericName: 'Meloxicam',
    uses: 'NSAID for arthritis pain and inflammation.',
    dosage: '7.5-15mg once daily.',
    warnings: 'Take with food. Risk of stomach ulcers.',
    sideEffects: ['Stomach upset', 'Nausea', 'Dizziness'],
  },
  {
    name: 'Rosuvastatin (Crestor)',
    genericName: 'Rosuvastatin',
    uses: 'Statin for high cholesterol.',
    dosage: '5-40mg once daily.',
    warnings: 'Monitor for muscle pain.',
    sideEffects: ['Headache', 'Muscle pain', 'Nausea'],
  },
  {
    name: 'Bupropion (Wellbutrin)',
    genericName: 'Bupropion',
    uses: 'Antidepressant and smoking cessation aid.',
    dosage: '150-300mg daily.',
    warnings: 'Risk of seizures at high doses.',
    sideEffects: ['Dry mouth', 'Insomnia', 'Agitation'],
  },
  {
    name: 'Venlafaxine (Effexor)',
    genericName: 'Venlafaxine',
    uses: 'SNRI for depression and anxiety.',
    dosage: '75-225mg daily.',
    warnings: 'Monitor blood pressure. Taper off slowly.',
    sideEffects: ['Nausea', 'Dry mouth', 'Sweating'],
  },
  {
    name: 'Allopurinol (Zyloprim)',
    genericName: 'Allopurinol',
    uses: 'Prevents gout attacks and kidney stones.',
    dosage: '100-300mg daily.',
    warnings: 'Drink plenty of water. Monitor for rash.',
    sideEffects: ['Skin rash', 'Stomach upset', 'Drowsiness'],
  },
  {
    name: 'Tadalafil (Cialis)',
    genericName: 'Tadalafil',
    uses: 'Treats erectile dysfunction and enlarged prostate.',
    dosage: '5-20mg as needed or daily.',
    warnings: 'Do NOT mix with nitrates (fatal BP drop).',
    sideEffects: ['Headache', 'Indigestion', 'Back pain'],
  },
  {
    name: 'Azithromycin (Zithromax)',
    genericName: 'Azithromycin',
    uses: 'Short-course antibiotic (Z-Pak).',
    dosage: '500mg day 1, then 250mg for 4 days.',
    warnings: 'Finish entire course. Monitor for heart issues.',
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting'],
  },
  {
    name: 'Ciprofloxacin (Cipro)',
    genericName: 'Ciprofloxacin',
    uses: 'Antibiotic for UTIs and respiratory infections.',
    dosage: '250-750mg every 12 hours.',
    warnings: 'Risk of tendon rupture. Avoid dairy with dose.',
    sideEffects: ['Nausea', 'Dizziness', 'Tendon pain'],
  },
  {
    name: 'Escitalopram (Lexapro)',
    genericName: 'Escitalopram',
    uses: 'SSRI for depression and generalized anxiety.',
    dosage: '10-20mg once daily.',
    warnings: 'May take 4 weeks for effect. Do not stop abruptly.',
    sideEffects: ['Nausea', 'Sleep issues', 'Sweating'],
  },
  {
    name: 'Metoprolol (Lopressor)',
    genericName: 'Metoprolol',
    uses: 'Beta-blocker for high blood pressure and chest pain.',
    dosage: '25-100mg twice daily.',
    warnings: 'Do not stop suddenly. May slow heart rate.',
    sideEffects: ['Fatigue', 'Dizziness', 'Slow heart rate'],
  },
  {
    name: 'Fluoxetine (Prozac)',
    genericName: 'Fluoxetine',
    uses: 'SSRI for depression and bulimia.',
    dosage: '20-60mg once daily.',
    warnings: 'Long half-life. Monitor mood changes.',
    sideEffects: ['Nausea', 'Insomnia', 'Nervousness'],
  },
  {
    name: 'Clopidogrel (Plavix)',
    genericName: 'Clopidogrel',
    uses: 'Antiplatelet to prevent heart attack/stroke.',
    dosage: '75mg once daily.',
    warnings: 'Increases bleeding risk. Notify surgeons.',
    sideEffects: ['Bruising', 'Bleeding', 'Nosebleeds'],
  },
  {
    name: 'Spironolactone (Aldactone)',
    genericName: 'Spironolactone',
    uses: 'Treats heart failure and hormonal acne.',
    dosage: '25-100mg daily.',
    warnings: 'Avoid high potassium foods.',
    sideEffects: ['Breast tenderness', 'High potassium', 'Dizziness'],
  },
  {
    name: 'Tamsulosin (Flomax)',
    genericName: 'Tamsulosin',
    uses: 'Treats symptoms of enlarged prostate.',
    dosage: '0.4mg once daily after a meal.',
    warnings: 'May cause sudden BP drop upon standing.',
    sideEffects: ['Dizziness', 'Runny nose', 'Ejaculation issues'],
  },
  {
    name: 'Valsartan (Diovan)',
    genericName: 'Valsartan',
    uses: 'ARB for high blood pressure and heart failure.',
    dosage: '80-320mg daily.',
    warnings: 'Not for pregnancy. Monitor kidneys.',
    sideEffects: ['Dizziness', 'Fatigue', 'Headache'],
  },
  {
    name: 'Aripiprazole (Abilify)',
    genericName: 'Aripiprazole',
    uses: 'Antipsychotic for bipolar and schizophrenia.',
    dosage: '2-15mg daily.',
    warnings: 'Risk of movement disorders. Monitor weight.',
    sideEffects: ['Weight gain', 'Restlessness', 'Nausea'],
  },
  {
    name: 'Carvedilol (Coreg)',
    genericName: 'Carvedilol',
    uses: 'Beta-blocker for heart failure and high BP.',
    dosage: '3.125-25mg twice daily.',
    warnings: 'Take with food to reduce dizziness.',
    sideEffects: ['Dizziness', 'Fatigue', 'Weight gain'],
  },
  {
    name: 'Duloxetine (Cymbalta)',
    genericName: 'Duloxetine',
    uses: 'SNRI for depression and nerve pain.',
    dosage: '30-60mg daily.',
    warnings: 'Avoid heavy alcohol (liver risk).',
    sideEffects: ['Dry mouth', 'Nausea', 'Drowsiness'],
  },
  {
    name: 'Verapamil',
    genericName: 'Verapamil',
    uses: 'Calcium channel blocker for BP and chest pain.',
    dosage: '120-240mg daily.',
    warnings: 'Can cause severe constipation. Avoid grapefruit.',
    sideEffects: ['Constipation', 'Dizziness', 'Headache'],
  },
  {
    name: 'Trazodone',
    genericName: 'Trazodone',
    uses: 'Antidepressant often used for insomnia.',
    dosage: '50-100mg at bedtime for sleep.',
    warnings: 'May cause daytime grogginess.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Dizziness'],
  },
  {
    name: 'Diclofenac (Voveran)',
    genericName: 'Diclofenac',
    uses: 'Potent NSAID for severe pain and arthritis.',
    dosage: '50mg two or three times daily.',
    warnings: 'Take with food. Risk of stomach issues.',
    sideEffects: ['Stomach pain', 'Nausea', 'Headache'],
  },
  {
    name: 'Ondansetron (Zofran)',
    genericName: 'Ondansetron',
    uses: 'Prevents nausea and vomiting.',
    dosage: '4-8mg every 8 hours.',
    warnings: 'May cause heart rhythm issues.',
    sideEffects: ['Headache', 'Constipation', 'Fatigue'],
  },
  {
    name: 'Azathioprine',
    genericName: 'Azathioprine',
    uses: 'Immunosuppressant for transplant and RA.',
    dosage: '50-150mg daily.',
    warnings: 'High infection risk. Blood tests required.',
    sideEffects: ['Nausea', 'Low white blood cell count'],
  },
  {
    name: 'Fexofenadine (Allegra)',
    genericName: 'Fexofenadine',
    uses: 'Non-drowsy antihistamine.',
    dosage: '60mg twice daily or 180mg once daily.',
    warnings: 'Avoid fruit juices with dose.',
    sideEffects: ['Headache', 'Dizziness', 'Nausea'],
  },
  {
    name: 'Aspirin (Ecospirin)',
    genericName: 'Aspirin',
    uses: 'Pain relief and heart attack prevention.',
    dosage: '75-150mg daily for heart protection.',
    warnings: 'Risk of stomach bleeding. Not for children.',
    sideEffects: ['Heartburn', 'Bruising', 'Stomach pain'],
  },
  {
    name: 'Ranitidine (Aciloc)',
    genericName: 'Ranitidine',
    uses: 'Reduces stomach acid.',
    dosage: '150mg twice daily.',
    warnings: 'Consult doctor for long-term use.',
    sideEffects: ['Headache', 'Dizziness', 'Diarrhea'],
  },
  {
    name: 'Cefixime (Taxim-O)',
    genericName: 'Cefixime',
    uses: 'Antibiotic for throat and urinary infections.',
    dosage: '200-400mg once daily.',
    warnings: 'Finish full course. Penicillin allergy check.',
    sideEffects: ['Diarrhea', 'Nausea', 'Stomach pain'],
  },
  {
    name: 'Telmisartan (Telma)',
    genericName: 'Telmisartan',
    uses: 'Treats high blood pressure.',
    dosage: '20-80mg once daily.',
    warnings: 'Not for pregnancy. Monitor potassium.',
    sideEffects: ['Dizziness', 'Back pain', 'Fatigue'],
  },
  {
    name: 'Gliclazide (Diamicron)',
    genericName: 'Gliclazide',
    uses: 'Diabetes medication to lower blood sugar.',
    dosage: '30-120mg daily with breakfast.',
    warnings: 'Risk of low blood sugar (hypoglycemia).',
    sideEffects: ['Weight gain', 'Nausea', 'Dizziness'],
  }
]

// Expanded list of common medicine names for autocomplete/fuzzy search
export const commonMedicineNames = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Cetirizine', 'Omeprazole', 'Metformin', 'Atorvastatin', 'Lisinopril', 'Levothyroxine', 'Salbutamol', 'Sertraline', 'Amlodipine', 'Gabapentin', 'Amoxicillin', 'Alprazolam', 'Pantoprazole', 'Losartan', 'Prednisone', 'Hydrochlorothiazide', 'Warfarin', 'Doxycycline', 'Loratadine', 'Furosemide', 'Montelukast', 'Meloxicam', 'Rosuvastatin', 'Bupropion', 'Venlafaxine', 'Allopurinol', 'Tadalafil', 'Azithromycin', 'Ciprofloxacin', 'Escitalopram', 'Metoprolol', 'Fluoxetine', 'Clopidogrel', 'Spironolactone', 'Tamsulosin', 'Valsartan', 'Aripiprazole', 'Carvedilol', 'Duloxetine', 'Verapamil', 'Trazodone', 'Diclofenac', 'Ondansetron', 'Azathioprine', 'Fexofenadine', 'Ecospirin', 'Aciloc', 'Taxim-O', 'Telma', 'Diamicron', 'Telmisartan', 'Cefixime', 'Ranitidine', 'Digene', 'Gelusil', 'Eno', 'Combiflam', 'Saridon', 'Vicks Action 500', 'Limcee', 'Zincovit', 'Neurobion', 'Becosules', 'Liv 52', 'Cystone', 'Septilin', 'Shelcal', 'Calcirol', 'Omez', 'Pan 40', 'Rabipraz', 'Domstal', 'Metrogyl', 'Norflox', 'Oflox', 'Zifi', 'Gudcef', 'Clavam', 'Augmentin', 'Dolo', 'Calpol', 'Crocin', 'Meftal Spas', 'Cyclopam', 'Brufen', 'Nimulid', 'Zerodol', 'Chymoral', 'Trypsin', 'Wymox', 'Mox', 'K-Stat', 'Pause', 'Styptovit', 'Ethental', 'Ethamsylate', 'Tranostat', 'Rantac', 'Histac', 'Zantac', 'Nexium', 'Lanzol', 'Rabium', 'Veloz', 'Pari', 'Sompraz', 'Esomac', 'Lucid', 'Gemer', 'Glycomet', 'Voglibose', 'Glimepiride', 'Pioglitazone', 'Sitagliptin', 'Vildagliptin', 'Teneligliptin', 'Linagliptin', 'Dapagliflozin', 'Empagliflozin', 'Canagliflozin', 'Remogliflozin'
]

export function searchMedicine(query: string): Medicine[] {
  // Normalize query: lowercase and remove non-alphanumeric for matching (e.g. "dolo-650" -> "dolo650")
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '').trim()
  
  if (!normalizedQuery) return []
  
  // 1. Check exact database first
  const matches = medicinesDatabase.filter((med) => {
    const normalizedName = med.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const normalizedGeneric = (med.genericName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    
    return normalizedName.includes(normalizedQuery) || normalizedGeneric.includes(normalizedQuery)
  })

  if (matches.length > 0) return matches

  // 2. Fuzzy Match Fallback (Starts With)
  const fuzzyMatches = medicinesDatabase.filter(med => 
    med.name.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(normalizedQuery.substring(0, 3))
  )

  return fuzzyMatches
}
