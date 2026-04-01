export interface SymptomCheckerNode {
  id: string
  question: string
  symptoms: string[]
  possibleConditions?: string[]
  severity?: 'low' | 'medium' | 'high' | 'emergency'
  advice: string
  nextQuestions?: { answer: string; nextId: string }[]
}

export const symptomCheckerTree: SymptomCheckerNode[] = [
  {
    id: 'start',
    question: 'What is your primary symptom?',
    symptoms: [],
    advice: 'Please select your main symptom to begin assessment.',
    nextQuestions: [
      { answer: 'Fever', nextId: 'fever' },
      { answer: 'Chest Pain', nextId: 'chest_pain' },
      { answer: 'Headache', nextId: 'headache' },
      { answer: 'Cough', nextId: 'cough' },
      { answer: 'Abdominal Pain', nextId: 'abdominal' },
      { answer: 'Other', nextId: 'other' }
    ]
  },
  {
    id: 'fever',
    question: 'How high is your temperature?',
    symptoms: ['fever'],
    advice: 'Fever assessment in progress.',
    nextQuestions: [
      { answer: 'Below 100°F (37.8°C)', nextId: 'mild_fever' },
      { answer: '100-102°F (37.8-38.9°C)', nextId: 'moderate_fever' },
      { answer: 'Above 102°F (38.9°C)', nextId: 'high_fever' }
    ]
  },
  {
    id: 'mild_fever',
    question: 'Do you have any other symptoms?',
    symptoms: ['fever', 'mild'],
    severity: 'low',
    possibleConditions: ['Common Cold', 'Mild Viral Infection'],
    advice: 'Rest, drink fluids, take acetaminophen if needed. Monitor temperature. See doctor if persists >3 days.',
    nextQuestions: []
  },
  {
    id: 'moderate_fever',
    question: 'How long have you had the fever?',
    symptoms: ['fever', 'moderate'],
    severity: 'medium',
    possibleConditions: ['Flu', 'Viral Infection', 'Bacterial Infection'],
    advice: 'Rest, hydrate, take fever reducers. See doctor if fever lasts >3 days or worsens.',
    nextQuestions: [
      { answer: 'Less than 2 days', nextId: 'recent_fever' },
      { answer: '3-5 days', nextId: 'persistent_fever' },
      { answer: 'More than 5 days', nextId: 'long_fever' }
    ]
  },
  {
    id: 'high_fever',
    question: 'Are you experiencing confusion, difficulty breathing, or severe pain?',
    symptoms: ['fever', 'high'],
    severity: 'emergency',
    possibleConditions: ['Serious Infection', 'Sepsis', 'Pneumonia'],
    advice: 'SEEK IMMEDIATE MEDICAL ATTENTION. Go to emergency room or call 911.',
    nextQuestions: []
  },
  {
    id: 'chest_pain',
    question: 'Where exactly is the chest pain located?',
    symptoms: ['chest_pain'],
    severity: 'emergency',
    possibleConditions: ['Heart Attack', 'Angina', 'Pulmonary Embolism', 'Panic Attack'],
    advice: 'CALL 911 IMMEDIATELY if pain is severe, crushing, or radiating to arm/jaw.',
    nextQuestions: [
      { answer: 'Center of chest', nextId: 'center_chest' },
      { answer: 'Left side', nextId: 'left_chest' },
      { answer: 'Right side', nextId: 'right_chest' }
    ]
  },
  {
    id: 'center_chest',
    question: 'Is the pain crushing, squeezing, or radiating to your arm or jaw?',
    symptoms: ['chest_pain', 'center'],
    severity: 'emergency',
    possibleConditions: ['Heart Attack', 'Angina'],
    advice: 'CALL 911 NOW! This could be a heart attack. Chew aspirin if available and not allergic.',
    nextQuestions: []
  },
  {
    id: 'headache',
    question: 'How severe is your headache?',
    symptoms: ['headache'],
    advice: 'Headache assessment in progress.',
    nextQuestions: [
      { answer: 'Mild (can function)', nextId: 'mild_headache' },
      { answer: 'Moderate (interferes with activities)', nextId: 'moderate_headache' },
      { answer: 'Severe (worst ever / sudden)', nextId: 'severe_headache' }
    ]
  },
  {
    id: 'mild_headache',
    question: 'Have you been dehydrated or stressed recently?',
    symptoms: ['headache', 'mild'],
    severity: 'low',
    possibleConditions: ['Tension Headache', 'Dehydration', 'Eye Strain'],
    advice: 'Rest in dark room, hydrate, take OTC pain reliever. Apply cold/warm compress.',
    nextQuestions: []
  },
  {
    id: 'moderate_headache',
    question: 'Do you have nausea, sensitivity to light, or visual changes?',
    symptoms: ['headache', 'moderate'],
    severity: 'medium',
    possibleConditions: ['Migraine', 'Cluster Headache', 'Sinusitis'],
    advice: 'Rest in dark quiet room, hydrate, take pain medication. See doctor if frequent or worsening.',
    nextQuestions: []
  },
  {
    id: 'severe_headache',
    question: 'Is this the worst headache of your life or came on suddenly?',
    symptoms: ['headache', 'severe'],
    severity: 'emergency',
    possibleConditions: ['Aneurysm', 'Stroke', 'Meningitis'],
    advice: 'SEEK IMMEDIATE MEDICAL ATTENTION. Go to ER or call 911.',
    nextQuestions: []
  },
  {
    id: 'cough',
    question: 'What type of cough do you have?',
    symptoms: ['cough'],
    advice: 'Cough assessment in progress.',
    nextQuestions: [
      { answer: 'Dry cough', nextId: 'dry_cough' },
      { answer: 'Productive (with mucus)', nextId: 'wet_cough' },
      { answer: 'With blood', nextId: 'bloody_cough' }
    ]
  },
  {
    id: 'dry_cough',
    question: 'How long have you had this cough?',
    symptoms: ['cough', 'dry'],
    severity: 'low',
    possibleConditions: ['Viral Infection', 'Allergies', 'Post-Nasal Drip'],
    advice: 'Use cough drops, honey, humidifier. Stay hydrated. See doctor if lasts >3 weeks.',
    nextQuestions: []
  },
  {
    id: 'wet_cough',
    question: 'What color is the mucus?',
    symptoms: ['cough', 'productive'],
    severity: 'medium',
    possibleConditions: ['Bronchitis', 'Pneumonia', 'Sinus Infection'],
    advice: 'Stay hydrated, use expectorant, rest. See doctor if yellow/green mucus, fever, or breathing difficulty.',
    nextQuestions: []
  },
  {
    id: 'bloody_cough',
    question: 'How much blood are you coughing up?',
    symptoms: ['cough', 'blood'],
    severity: 'emergency',
    possibleConditions: ['Pulmonary Embolism', 'Tuberculosis', 'Lung Cancer', 'Severe Infection'],
    advice: 'SEEK IMMEDIATE MEDICAL ATTENTION. This requires urgent evaluation.',
    nextQuestions: []
  },
  {
    id: 'abdominal',
    question: 'Where is the pain located?',
    symptoms: ['abdominal_pain'],
    advice: 'Abdominal pain assessment in progress.',
    nextQuestions: [
      { answer: 'Upper right (near ribs)', nextId: 'upper_right_abd' },
      { answer: 'Upper left', nextId: 'upper_left_abd' },
      { answer: 'Lower right', nextId: 'lower_right_abd' },
      { answer: 'Lower left', nextId: 'lower_left_abd' },
      { answer: 'Central/all over', nextId: 'central_abd' }
    ]
  },
  {
    id: 'lower_right_abd',
    question: 'Is the pain severe and did it start near the belly button and move to lower right?',
    symptoms: ['abdominal_pain', 'lower_right'],
    severity: 'emergency',
    possibleConditions: ['Appendicitis', 'Ovarian Cyst', 'Kidney Stone'],
    advice: 'If pain is severe and you cannot stand straight, SEEK IMMEDIATE MEDICAL ATTENTION. Possible appendicitis.',
    nextQuestions: []
  },
  {
    id: 'other',
    question: 'Please describe your main symptom:',
    symptoms: ['other'],
    severity: 'low',
    possibleConditions: ['Various'],
    advice: 'Based on your symptoms, consider seeing a healthcare provider for proper evaluation. Call 911 if symptoms are severe or life-threatening.',
    nextQuestions: []
  }
]

export function assessSymptom(symptomId: string): SymptomCheckerNode | undefined {
  return symptomCheckerTree.find(node => node.id === symptomId)
}

export function getSeverityColor(severity?: string): string {
  switch (severity) {
    case 'low': return 'green'
    case 'medium': return 'yellow'
    case 'high': return 'orange'
    case 'emergency': return 'red'
    default: return 'blue'
  }
}
