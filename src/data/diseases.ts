export interface DiseaseInfo {
  name: string
  symptoms: string[]
  advice: string
  severity: 'low' | 'medium' | 'high' | 'emergency'
}

export const diseaseDictionary: DiseaseInfo[] = [
  {
    name: 'Malaria',
    symptoms: ['High fever', 'Chills', 'Sweating', 'Headache', 'Nausea'],
    severity: 'high',
    advice: 'Seek medical attention immediately for blood tests. ACT treatment is usually required.'
  },
  {
    name: 'Typhoid',
    symptoms: ['Sustained fever', 'Stomach pain', 'Headache', 'Rose spots rash'],
    severity: 'high',
    advice: 'Consult a doctor for antibiotics. Drink boiled water and maintain high hygiene.'
  },
  {
    name: 'Dengue',
    symptoms: ['High fever', 'Severe joint pain', 'Pain behind eyes', 'Rash'],
    severity: 'high',
    advice: 'Hydrate extensively. DO NOT take Aspirin/Ibuprofen. Monitor platelet count.'
  },
  {
    name: 'Diabetes Type 2',
    symptoms: ['Increased thirst', 'Frequent urination', 'Hunger', 'Fatigue', 'Blurred vision'],
    severity: 'medium',
    advice: 'Monitor blood sugar. Follow a low-GI diet. Regular exercise and medication (Metformin) as prescribed.'
  },
  {
    name: 'Hypertension',
    symptoms: ['Headache', 'Shortness of breath', 'Nosebleeds', 'Often no symptoms'],
    severity: 'medium',
    advice: 'Reduce salt intake. Regular BP monitoring. Stress management and prescribed medication.'
  },
  {
    name: 'Asthma',
    symptoms: ['Shortness of breath', 'Chest tightness', 'Wheezing', 'Coughing'],
    severity: 'high',
    advice: 'Use rescue inhaler. Avoid triggers like dust/pollen. Seek ER if breathing is very difficult.'
  },
  {
    name: 'Pneumonia',
    symptoms: ['Cough with phlegm', 'Fever', 'Chills', 'Difficulty breathing'],
    severity: 'high',
    advice: 'Urgent medical consult needed. Antibiotics or antivirals often required. Rest and fluids.'
  },
  {
    name: 'Tuberculosis (TB)',
    symptoms: ['Coughing for 3+ weeks', 'Coughing blood', 'Chest pain', 'Weight loss'],
    severity: 'high',
    advice: 'Long-term antibiotic course (6-9 months) required. Do not stop early. Wear a mask.'
  },
  {
    name: 'Anemia',
    symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Cold hands/feet'],
    severity: 'low',
    advice: 'Increase iron-rich foods (spinach, red meat). Take iron and Vitamin C supplements.'
  },
  {
    name: 'Gastroenteritis (Stomach Flu)',
    symptoms: ['Diarrhea', 'Stomach cramps', 'Nausea', 'Vomiting', 'Fever'],
    severity: 'medium',
    advice: 'Stay hydrated with ORS. Eat bland foods (BRAT diet). Avoid dairy and caffeine.'
  },
  {
    name: 'UTI (Urinary Tract Infection)',
    symptoms: ['Burning urination', 'Frequent urge', 'Cloudy urine', 'Pelvic pain'],
    severity: 'medium',
    advice: 'Drink plenty of water. Consult doctor for antibiotics. Cranberry juice may help prevention.'
  },
  {
    name: 'Kidney Stones',
    symptoms: ['Severe side/back pain', 'Painful urination', 'Pink/red urine'],
    severity: 'high',
    advice: 'Drink massive amounts of water. Pain relief as needed. See urologist.'
  },
  {
    name: 'Appendicitis',
    symptoms: ['Lower right abdominal pain', 'Nausea', 'Loss of appetite'],
    severity: 'emergency',
    advice: 'SEEK EMERGENCY CARE. This often requires surgery. Do not eat or drink.'
  },
  {
    name: 'Heart Attack',
    symptoms: ['Chest pressure/pain', 'Shortness of breath', 'Pain in arm/jaw', 'Cold sweat'],
    severity: 'emergency',
    advice: 'CALL EMERGENCY SERVICES NOW. Chew an aspirin if not allergic.'
  },
  {
    name: 'Stroke',
    symptoms: ['Facial drooping', 'Arm weakness', 'Speech difficulty', 'Sudden confusion'],
    severity: 'emergency',
    advice: 'CALL EMERGENCY SERVICES. Time is critical for brain saving treatment.'
  },
  {
    name: 'Hepatitis (Jaundice)',
    symptoms: ['Yellow skin/eyes', 'Dark urine', 'Fatigue', 'Abdominal pain'],
    severity: 'high',
    advice: 'Rest, avoid alcohol/fats. Consult doctor for testing. High-glucose, low-fat diet.'
  },
  {
    name: 'Arthritis',
    symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Decreased range of motion'],
    severity: 'low',
    advice: 'Maintain healthy weight. Low-impact exercise. Anti-inflammatory diet (Omega-3).'
  },
  {
    name: 'Migraine',
    symptoms: ['Severe throbbing headache', 'Nausea', 'Sensitivity to light/sound'],
    severity: 'medium',
    advice: 'Rest in dark, quiet room. Stay hydrated. Use OTC or prescribed migraine relief.'
  },
  {
    name: 'PCOS',
    symptoms: ['Irregular periods', 'Excess hair growth', 'Acne', 'Weight gain'],
    severity: 'low',
    advice: 'Healthy diet and regular exercise. Consult endocrinologist for hormonal management.'
  },
  {
    name: 'Depression',
    symptoms: ['Persistent sadness', 'Loss of interest', 'Sleep changes', 'Fatigue'],
    severity: 'medium',
    advice: 'Reach out for professional support. Stick to a routine. Therapy or medication can help.'
  },
  {
    name: 'Anxiety Disorder',
    symptoms: ['Excessive worry', 'Restlessness', 'Rapid heart rate', 'Panic attacks'],
    severity: 'medium',
    advice: 'Try grounding exercises. Avoid caffeine. Consult a therapist for coping strategies.'
  },
  {
    name: 'Eczema',
    symptoms: ['Dry skin', 'Itching', 'Red patches', 'Small raised bumps'],
    severity: 'low',
    advice: 'Moisturize multiple times daily. Use mild soaps. Avoid triggers like wool or fragrance.'
  },
  {
    name: 'GERD (Acid Reflux)',
    symptoms: ['Heartburn', 'Regurgitation', 'Chest pain', 'Difficulty swallowing'],
    severity: 'low',
    advice: 'Avoid spicy/fatty foods. Don\'t lie down after eating. Use antacids if needed.'
  },
  {
    name: 'Hypothyroidism',
    symptoms: ['Fatigue', 'Weight gain', 'Cold sensitivity', 'Dry skin'],
    severity: 'medium',
    advice: 'Requires life-long thyroid hormone replacement (Levothyroxine). Regular blood tests.'
  },
  {
    name: 'Hyperthyroidism',
    symptoms: ['Weight loss', 'Rapid heartbeat', 'Sweating', 'Irritability'],
    severity: 'medium',
    advice: 'Consult endocrinologist for antithyroid medications or other treatments.'
  },
  {
    name: 'Chickenpox',
    symptoms: ['Itchy red rash/blisters', 'Fever', 'Fatigue', 'Loss of appetite'],
    severity: 'low',
    advice: 'Calamine lotion for itching. Avoid scratching (prevents scars). Highly contagious.'
  },
  {
    name: 'Measles',
    symptoms: ['High fever', 'Cough', 'Runny nose', 'Red watery eyes', 'White spots in mouth'],
    severity: 'high',
    advice: 'Isolate to prevent spread. Hydrate. Seek medical advice for symptom management.'
  },
  {
    name: 'Cholera',
    symptoms: ['Severe watery diarrhea', 'Vomiting', 'Muscle cramps', 'Dehydration'],
    severity: 'emergency',
    advice: 'URGENT REHYDRATION (ORS/IV). Seek immediate medical attention.'
  },
  {
    name: 'Amoebiasis',
    symptoms: ['Abdominal pain', 'Diarrhea with blood/mucus', 'Fatigue'],
    severity: 'medium',
    advice: 'Consult doctor for Metronidazole treatment. Ensure clean water and food.'
  },
  {
    name: 'Bronchitis',
    symptoms: ['Cough with mucus', 'Shortness of breath', 'Chest discomfort', 'Mild fever'],
    severity: 'low',
    advice: 'Hydrate, use humidifier, rest. See doctor if fever is high or cough lasts weeks.'
  },
  {
    name: 'Sinusitis',
    symptoms: ['Facial pain/pressure', 'Stuffy nose', 'Thick yellow/green mucus', 'Headache'],
    severity: 'low',
    advice: 'Steam inhalation, nasal rinse, fluids. See doctor if symptoms persist >10 days.'
  },
  {
    name: 'Dermatitis',
    symptoms: ['Itchy skin', 'Red rash', 'Dry/scaly skin'],
    severity: 'low',
    advice: 'Avoid irritants. Use thick moisturizers. Hydrocortisone cream for itching.'
  },
  {
    name: 'Peptic Ulcer',
    symptoms: ['Burning stomach pain', 'Bloating', 'Heartburn', 'Nausea'],
    severity: 'medium',
    advice: 'Avoid NSAIDs like Ibuprofen. Use acid blockers. See doctor for H. pylori test.'
  },
  {
    name: 'Gallstones',
    symptoms: ['Sudden pain in upper right abdomen', 'Pain between shoulder blades', 'Nausea'],
    severity: 'high',
    advice: 'Consult a surgeon. Often requires gallbladder removal if symptomatic.'
  },
  {
    name: 'Influenza (Flu)',
    symptoms: ['Sudden high fever', 'Body aches', 'Fatigue', 'Dry cough'],
    severity: 'medium',
    advice: 'Rest, fluids, and Paracetamol. Antivirals (Tamiflu) may help if started early.'
  },
  {
    name: 'Cataract',
    symptoms: ['Cloudy/blurred vision', 'Sensitivity to light', 'Fading colors'],
    severity: 'low',
    advice: 'See an ophthalmologist. Definitive treatment is simple surgical replacement of lens.'
  },
  {
    name: 'Glaucoma',
    symptoms: ['Gradual loss of peripheral vision', 'Eye pain', 'Blurred vision', 'Halos around lights'],
    severity: 'high',
    advice: 'Requires urgent eye pressure management to prevent permanent blindness.'
  },
  {
    name: 'Sepsis',
    symptoms: ['High heart rate', 'Confusion', 'Extreme shivering/muscle pain', 'No urine'],
    severity: 'emergency',
    advice: 'LIFE-THREATENING EMERGENCY. Call 112/911 immediately. Requires hospital IV antibiotics.'
  },
  {
    name: 'Meningitis',
    symptoms: ['Sudden high fever', 'Stiff neck', 'Severe headache', 'Confusion', 'Seizures'],
    severity: 'emergency',
    advice: 'LIFE-THREATENING EMERGENCY. Seek immediate care for spinal fluid testing and IV treatment.'
  },
  {
    name: 'Alzheimer Disease',
    symptoms: ['Memory loss', 'Confusion with time/place', 'Difficulty planning', 'Mood changes'],
    severity: 'medium',
    advice: 'Maintain routine. Support groups. Consult neurologist for management medications.'
  },
  {
    name: 'Parkinson Disease',
    symptoms: ['Tremors', 'Slow movement', 'Rigid muscles', 'Impaired posture'],
    severity: 'medium',
    advice: 'Consult neurologist for Dopamine-related treatments. Physical therapy is beneficial.'
  },
  {
    name: 'Epilepsy',
    symptoms: ['Recurring seizures', 'Temporary confusion', 'Staring spells'],
    severity: 'medium',
    advice: 'Consistent medication is key. Ensure safety during seizures (don\'t restrain, cushion head).'
  },
  {
    name: 'HIV/AIDS',
    symptoms: ['Fever', 'Rash', 'Fatigue', 'Swollen lymph nodes (early stage)', 'Frequent infections'],
    severity: 'high',
    advice: 'Consult infectious disease specialist for ART (Antiretroviral Therapy). High quality of life possible.'
  },
  {
    name: 'Lupus',
    symptoms: ['Butterfly rash on face', 'Joint pain', 'Fatigue', 'Sun sensitivity'],
    severity: 'high',
    advice: 'Autoimmune management required. Consult rheumatologist for steroids/immunosuppressants.'
  },
  {
    name: 'Osteoporosis',
    symptoms: ['Back pain', 'Loss of height', 'Stooped posture', 'Easy bone fractures'],
    severity: 'low',
    advice: 'Increase calcium and Vitamin D. Weight-bearing exercise. Bone-density strengthening meds.'
  },
  {
    name: 'Celiac Disease',
    symptoms: ['Diarrhea', 'Bloating', 'Fatigue', 'Weight loss after eating gluten'],
    severity: 'medium',
    advice: 'Strict GLUTEN-FREE diet for life. Avoid wheat, barley, and rye.'
  },
  {
    name: 'Crohn Disease',
    symptoms: ['Abdominal pain', 'Severe diarrhea', 'Fatigue', 'Weight loss', 'Malnutrition'],
    severity: 'high',
    advice: 'Consult gastroenterologist for anti-inflammatory or immunosuppressant treatments.'
  },
  {
    name: 'Psoriasis',
    symptoms: ['Red patches with silvery scales', 'Dry cracked skin', 'Itching/burning'],
    severity: 'low',
    advice: 'Topical treatments, UV light therapy, or systemic meds for severe cases.'
  },
  {
    name: 'Common Cold',
    symptoms: ['Runny nose', 'Sneezing', 'Mild cough', 'Sore throat'],
    severity: 'low',
    advice: 'Rest, fluids, and time. Symptoms usually resolve in 7-10 days.'
  },
  {
    name: 'Heat Stroke',
    symptoms: ['Body temp >104F', 'Confusion', 'Rapid pulse', 'Nausea', 'Lack of sweating'],
    severity: 'emergency',
    advice: 'Move to shade, cool body with water/ice. Call emergency services immediately.'
  }
]

export function searchDiseases(query: string): DiseaseInfo[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  
  return diseaseDictionary.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.symptoms.some(s => s.toLowerCase().includes(q))
  )
}
