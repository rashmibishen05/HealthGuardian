export interface HealthInsight {
  type: 'BP' | 'Sugar' | 'HeartRate' | 'Weight'
  value: number
  status: 'normal' | 'low' | 'high' | 'critical'
  advice: string
}

export function analyzeVitals(text: string): HealthInsight[] {
  const insights: HealthInsight[] = []
  
  // 1. Blood Pressure (e.g. 120/80)
  const bpMatch = text.match(/(\d{2,3})\/(\d{2,3})/);
  if (bpMatch) {
    const sys = parseInt(bpMatch[1]);
    const dia = parseInt(bpMatch[2]);
    let status: HealthInsight['status'] = 'normal';
    let advice = 'Your BP is within a healthy range.';
    
    if (sys >= 140 || dia >= 90) {
      status = 'high';
      advice = 'High BP detected (Hypertension). Please consult a doctor.';
    } else if (sys < 90 || dia < 60) {
      status = 'low';
      advice = 'Low BP detected (Hypotension). Ensure hydration and see a doctor.';
    }
    
    insights.push({ type: 'BP', value: sys, status, advice });
  }

  // 2. Blood Sugar (e.g. 150 mg/dl)
  const sugarMatch = text.match(/(\d{2,3})\s*(mg\/dl|sugar)/i);
  if (sugarMatch) {
    const val = parseInt(sugarMatch[1]);
    let status: HealthInsight['status'] = 'normal';
    let advice = 'Sugar levels seem stable.';
    
    if (val >= 140) {
      status = 'high';
      advice = 'Elevated sugar levels. Monitor your diet and see a specialist.';
    } else if (val < 70) {
      status = 'low';
      advice = 'Low blood sugar (Hypoglycemia). Consume fast-acting sugar immediately.';
    }
    
    insights.push({ type: 'Sugar', value: val, status, advice });
  }

  // 3. Heart Rate (e.g. 105 bpm)
  const hrMatch = text.match(/(\d{2,3})\s*(bpm|pulse|heartrate)/i);
  if (hrMatch) {
    const val = parseInt(hrMatch[1]);
    let status: HealthInsight['status'] = 'normal';
    let advice = 'Resting heart rate is normal.';
    
    if (val > 100) {
      status = 'high';
      advice = 'Tachycardia detected. Seek rest or consult if persistent.';
    } else if (val < 60) {
      status = 'low';
      advice = 'Bradycardia detected. Monitor for dizziness.';
    }
    
    insights.push({ type: 'HeartRate', value: val, status, advice });
  }

  return insights;
}

export interface HealthScoreResult {
  score: number
  summary: string
  color: string
}

export function calculateHealthScore(insights: HealthInsight[]): HealthScoreResult {
  if (insights.length === 0) return { score: 0, summary: 'No data to analyze.', color: 'gray' }
  
  let score = 100
  let criticalCount = 0
  
  insights.forEach(insight => {
    if (insight.status === 'critical') {
      score -= 40
      criticalCount++
    } else if (insight.status === 'high' || insight.status === 'low') {
      score -= 15
    }
  })
  
  score = Math.max(0, score)
  
  let summary = 'Your health markers are excellent.'
  let color = 'green'
  
  if (score < 50 || criticalCount > 0) {
    summary = 'Immediate medical attention may be needed.'
    color = 'red'
  } else if (score < 85) {
    summary = 'Some markers need attention and lifestyle changes.'
    color = 'amber'
  }
  
  return { score, summary, color }
}
