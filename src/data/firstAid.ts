export interface FirstAidInstruction {
  id: number
  title: string
  symptoms: string[]
  steps: string[]
  warnings: string[]
  callEmergency: boolean
}

export const firstAidInstructions: FirstAidInstruction[] = [
  {
    id: 1,
    title: 'Heart Attack',
    symptoms: [
      'Chest pain or discomfort',
      'Pain in arms, back, neck, jaw',
      'Shortness of breath',
      'Cold sweat, nausea',
    ],
    steps: [
      'Call emergency services (112) immediately',
      'Have the person sit down and rest',
      'Loosen any tight clothing',
      'If person is unconscious, begin CPR if trained',
      'Give aspirin if available and not allergic (chew, don\'t swallow)',
    ],
    warnings: ['Do not drive to hospital', 'Do not give food or water'],
    callEmergency: true,
  },
  {
    id: 2,
    title: 'Choking',
    symptoms: [
      'Cannot speak or breathe',
      'Clutching throat',
      'Blue skin color',
      'Weak cough',
    ],
    steps: [
      'Ask "Are you choking?" - if they nod, help immediately',
      'Stand behind person, wrap arms around waist',
      'Make a fist, place above navel',
      'Grasp fist with other hand and give quick upward thrusts',
      'Repeat until object is expelled',
      'If unconscious, call 112 and start CPR',
    ],
    warnings: ['Do not slap back if airway is partially blocked'],
    callEmergency: true,
  },
  {
    id: 3,
    title: 'Severe Bleeding',
    symptoms: [
      'Blood spurting or flowing continuously',
      'Wound not clotting',
      'Dizziness or weakness',
    ],
    steps: [
      'Call 112 if bleeding is severe',
      'Wear gloves if available',
      'Apply direct pressure with clean cloth',
      'Keep pressure for 10-15 minutes without checking',
      'If blood soaks through, add more cloth on top',
      'Elevate wound above heart if possible',
      'Apply pressure to artery if direct pressure fails',
    ],
    warnings: ['Do not remove embedded objects', 'Do not use tourniquet unless trained'],
    callEmergency: true,
  },
  {
    id: 4,
    title: 'Burns',
    symptoms: [
      'Red, painful skin (1st degree)',
      'Blisters, swelling (2nd degree)',
      'White/charred skin (3rd degree)',
    ],
    steps: [
      'Remove from heat source immediately',
      'Cool the burn with cool (not cold) running water for 10-20 minutes',
      'Remove jewelry and tight clothing before swelling',
      'Cover with sterile, non-stick bandage',
      'Take over-the-counter pain reliever if needed',
      'Do NOT break blisters',
    ],
    warnings: [
      'Do not apply ice, butter, or ointments',
      'Call 112 for large burns or burns on face/hands/feet/genitals',
    ],
    callEmergency: false,
  },
  {
    id: 5,
    title: 'Stroke',
    symptoms: [
      'Face drooping on one side',
      'Arm weakness or numbness',
      'Speech difficulty or slurred',
      'Sudden severe headache',
      'Vision problems',
    ],
    steps: [
      'Call 112 immediately - Time is critical!',
      'Note the time symptoms started',
      'Keep person calm and lying down',
      'Loosen tight clothing',
      'Do not give food, water, or medication',
      'If unconscious, check breathing and pulse',
    ],
    warnings: ['FAST test: Face-Arms-Speech-Time', 'Every minute counts - call 112 NOW'],
    callEmergency: true,
  },
  {
    id: 6,
    title: 'Seizure',
    symptoms: [
      'Uncontrollable jerking movements',
      'Loss of consciousness',
      'Stiffening of body',
      'Foam at mouth',
    ],
    steps: [
      'Stay calm and time the seizure',
      'Clear area of dangerous objects',
      'Cushion head with soft object',
      'Turn person on side after seizure stops',
      'Stay with person until fully conscious',
      'Do NOT restrain or put anything in mouth',
    ],
    warnings: ['Call 112 if seizure lasts more than 5 minutes', 'Never hold person down'],
    callEmergency: false,
  },
  {
    id: 7,
    title: 'Allergic Reaction (Anaphylaxis)',
    symptoms: [
      'Difficulty breathing',
      'Swelling of face/throat',
      'Rapid pulse',
      'Dizziness or fainting',
      'Hives or rash',
    ],
    steps: [
      'Call 112 immediately',
      'Use epinephrine auto-injector (EpiPen) if available',
      'Help person lie down with legs elevated',
      'Loosen tight clothing',
      'Keep person warm',
      'Do not give anything by mouth if breathing is difficult',
    ],
    warnings: ['This is life-threatening', 'Use EpiPen immediately if prescribed'],
    callEmergency: true,
  },
  {
    id: 8,
    title: 'Fracture or Broken Bone',
    symptoms: [
      'Severe pain at injury site',
      'Swelling and bruising',
      'Visible deformity',
      'Unable to move limb',
    ],
    steps: [
      'Do not move the injured area',
      'Immobilize the bone with splint if trained',
      'Apply ice pack wrapped in cloth (20 min on, 20 min off)',
      'Elevate if possible',
      'Call 112 for severe fractures or if bone pierces skin',
      'Monitor for shock symptoms',
    ],
    warnings: ['Do not try to straighten bone', 'Do not apply ice directly to skin'],
    callEmergency: false,
  },
  {
    id: 9,
    title: 'Snake Bite',
    symptoms: [
      'Fang marks on skin',
      'Swelling and pain at bite site',
      'Nausea, vomiting, dizziness',
      'Difficulty breathing',
    ],
    steps: [
      'Call 112 immediately',
      'Keep person calm and still',
      'Immobilize the bitten limb below the level of the heart',
      'Remove jewelry or tight clothing near the bite',
      'Mark the edge of swelling with a pen every 15 minutes',
      'Do NOT try to suck out venom',
    ],
    warnings: ['Do not cut the wound', 'Do not apply tourniquet or ice', 'Note snake appearance if safe to do so'],
    callEmergency: true,
  },
  {
    id: 10,
    title: 'Heatstroke',
    symptoms: [
      'Body temperature above 104°F (40°C)',
      'Hot, red, dry or damp skin',
      'Rapid, strong pulse',
      'Confusion or loss of consciousness',
    ],
    steps: [
      'Call 112 immediately',
      'Move person to cool, shaded area',
      'Remove excess clothing',
      'Apply cool water to skin, fan to reduce temperature',
      'Place ice packs on neck, armpits and groin',
      'Do not give fluids if unconscious',
    ],
    warnings: ['Do not give aspirin or paracetamol for heat stroke', 'This is life-threatening'],
    callEmergency: true,
  },
]
