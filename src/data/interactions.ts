export interface Interaction {
  med1: string
  med2: string
  severity: 'high' | 'moderate' | 'low'
  warning: string
}

export const interactions: Interaction[] = [
  {
    med1: 'Aspirin',
    med2: 'Warfarin',
    severity: 'high',
    warning: 'Severe risk of bleeding. Both medications thin the blood. Do not combine without doctor supervision.'
  },
  {
    med1: 'Ibuprofen',
    med2: 'Aspirin',
    severity: 'moderate',
    warning: 'May decrease the heart-protective effects of aspirin and increase stomach irritation.'
  },
  {
    med1: 'Metformin',
    med2: 'Alcohol',
    severity: 'high',
    warning: 'Increased risk of lactic acidosis, a rare but serious complication.'
  },
  {
    med1: 'Atorvastatin',
    med2: 'Grapefruit Juice',
    severity: 'moderate',
    warning: 'Grapefruit juice can increase the levels of statins in your blood, increasing the risk of side effects.'
  },
  {
    med1: 'Lisinopril',
    med2: 'Potassium Supplements',
    severity: 'high',
    warning: 'Risk of hyperkalemia (high potassium levels), which can lead to irregular heart rhythms.'
  },
  {
    med1: 'Amoxicillin',
    med2: 'Oral Contraceptives',
    severity: 'low',
    warning: 'Antibiotics may slightly decrease the effectiveness of birth control pills.'
  },
  {
    med1: 'Sildenafil',
    med2: 'Nitroglycerin',
    severity: 'high',
    warning: 'Can cause a dangerous drop in blood pressure. NEVER combine these.'
  },
  {
    med1: 'Acetaminophen',
    med2: 'Alcohol',
    severity: 'high',
    warning: 'Significant risk of liver damage when combined in high doses.'
  }
]

export function checkInteraction(name1: string, name2: string): Interaction | null {
  const n1 = name1.toLowerCase()
  const n2 = name2.toLowerCase()
  
  return interactions.find(i => 
    (n1.includes(i.med1.toLowerCase()) && n2.includes(i.med2.toLowerCase())) ||
    (n2.includes(i.med1.toLowerCase()) && n1.includes(i.med2.toLowerCase()))
  ) || null
}
