import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaRobot, FaMicrophone, FaPaperPlane, FaBrain } from 'react-icons/fa'

// =====================================================================
// OFFLINE AI HEALTH ASSISTANT
// Architecture: Pure offline keyword engine (no SDK dependency)
// The RunAnywhere SDK is attempted as an OPTIONAL upgrade only if
// a .gguf model file exists in public/models/. If that fails (which it
// usually does without the model), the keyword engine handles all queries.
// =====================================================================

interface Message {
  role: 'user' | 'assistant'
  content: string
  time?: string
}

// ---------- Comprehensive offline health knowledge base -----------
const HEALTH_KB: Record<string, string> = {
  fever: `🌡️ **Fever Management**\n\n• Rest and stay well-hydrated\n• Take Paracetamol (500mg) or Ibuprofen as directed\n• Use cool, damp cloth compress on forehead\n• Remove excess clothing to help cool down\n• Monitor temperature every few hours\n\n⚠️ **Seek emergency care if:**\n→ Fever >104°F (40°C) in adults\n→ Any fever in infants <3 months\n→ Fever with stiff neck, confusion, or rash\n→ Fever lasting more than 3 days`,

  headache: `🤕 **Headache Relief**\n\n• Rest in a quiet, dark room\n• Apply cold or warm compress to head/neck\n• Drink plenty of water (dehydration is common cause)\n• Take Paracetamol or Ibuprofen as directed\n• Avoid screens and bright lights\n\n⚠️ **Seek emergency care if:**\n→ Sudden, severe "thunderclap" headache\n→ Headache with fever, stiff neck, or rash\n→ Headache after a head injury\n→ Vision changes or weakness`,

  cold: `🤧 **Common Cold Treatment**\n\n• Rest and drink plenty of warm fluids (kadha, soup)\n• Use saline nasal spray/drops to clear congestion\n• Honey with warm water can soothe a sore throat (age 1+)\n• OTC decongestants or antihistamines for symptom relief\n• Inhale steam to relieve nasal congestion\n\n💊 Common OTC options: Cetirizine, Loratadine, Phenylephrine\n\n⚠️ See a doctor if symptoms worsen after 10 days or you develop high fever`,

  cough: `😮‍💨 **Cough Management**\n\n• Stay hydrated throughout the day\n• Honey (1-2 tsp) can soothe throat (not for children <1 year)\n• Steam inhalation helps loosen mucus\n• Avoid smoke and air pollutants\n• Sleep with head slightly elevated\n\n💊 OTC options: Dextromethorphan (dry cough), Guaifenesin (wet cough)\n\n⚠️ See a doctor if:\n→ Coughing blood\n→ Cough with high fever\n→ Persistent for more than 3 weeks`,

  stomach: `🤢 **Stomach Ache / Gastritis**\n\n• Avoid solid food for a few hours, sip clear fluids\n• Try BRAT diet: Bananas, Rice, Applesauce, Toast\n• Drink ORS (Oral Rehydration Solution) if dehydrated\n• Avoid spicy, oily, or dairy foods temporarily\n• Antacids (Gelusil, ENO) can help for acid-related pain\n\n⚠️ Seek immediate care if:\n→ Severe, sudden stomach pain\n→ Blood in vomit or stool\n→ Pain with high fever\n→ Abdomen is hard/rigid`,

  diarrhea: `💧 **Diarrhea Treatment**\n\n• Most important: prevent dehydration with ORS\n• ORS recipe: 1 liter water + 6 tsp sugar + 1/2 tsp salt\n• Eat bland foods: rice, bananas, toast, boiled potatoes\n• Avoid dairy, caffeine, alcohol, and raw vegetables\n• Zinc tablets (for children) help reduce duration\n\n⚠️ Seek care if:\n→ Blood or mucus in stool\n→ High fever (>102°F)\n→ Lasts more than 2 days \n→ Signs of severe dehydration (no urination, dry mouth, dizziness)`,

  vomiting: `🤮 **Vomiting Management**\n\n• Sip small amounts of water, ORS, or coconut water frequently\n• Avoid solid food until vomiting stops for 1-2 hours\n• Ginger tea or ginger candy can help nausea\n• Rest with head elevated\n• OTC: Domperidone or Ondansetron (with doctor advice)\n\n⚠️ Seek emergency care if:\n→ Vomiting blood (bright red or coffee-ground appearance)\n→ Signs of dehydration\n→ No improvement after 24 hours\n→ Associated with severe headache or stiff neck`,

  pain: `😣 **Pain Management**\n\n• Rest the affected area completely\n• Ice pack for first 48 hours (20 min on, 20 min off)\n• Switch to warm compress after 48 hours\n• OTC pain relief: Paracetamol, Ibuprofen, or Diclofenac\n• Gentle stretching can prevent stiffness\n\n⚠️ Seek care immediately if:\n→ Chest pain (could be cardiac)\n→ Severe abdominal pain\n→ Pain after a significant injury\n→ Pain with numbness or weakness`,

  dehydration: `💦 **Dehydration Treatment**\n\n• Drink ORS (Oral Rehydration Solution) regularly\n• ORS sachets available at any pharmacy\n• Home remedy: 1L water + 6 tsp sugar + ½ tsp salt\n• Avoid caffeine and alcohol\n• Water-rich foods: cucumber, watermelon, oranges\n\n🚨 **Signs of severe dehydration (Emergency):**\n→ No urination for 8+ hours\n→ Rapid heartbeat\n→ Extreme dizziness or confusion\n→ Sunken eyes, dry mouth\n→ **Call 108 (Ambulance) immediately!**`,

  diabetes: `🩸 **Diabetes Management**\n\n• Monitor blood glucose as prescribed (fasting: 80-130 mg/dL)\n• Take medications/insulin exactly as prescribed\n• Follow a low-GI diet: avoid sugar, refined carbs\n• Exercise 30 minutes daily (walking is excellent)\n• Never skip meals when on insulin\n• Carry fast-acting glucose (glucose tablets, sugar) for hypoglycemia\n\n🚨 **Hypoglycemia Emergency (<70 mg/dL):**\n→ Eat 15g of fast-acting sugar (3 glucose tablets, 4 oz juice)\n→ Recheck in 15 minutes\n→ If unconscious: Call 112 immediately!`,

  bp: `💓 **Blood Pressure Management**\n\n• Reduce salt intake to <5g/day\n• Follow the DASH diet (fruits, vegetables, whole grains)\n• Exercise 30 min daily, 5 days a week\n• Maintain healthy body weight\n• Limit alcohol and quit smoking\n• Manage stress with yoga or meditation\n• Take BP medications consistently, never skip doses\n\n⚠️ **Hypertensive Crisis (BP >180/120):**\n→ Symptoms: severe headache, blurred vision, chest pain\n→ **Call 112 emergency immediately!**`,

  hypertension: `💓 **Hypertension (High BP) Control**\n\n• Ideal BP target: below 130/80 mmHg\n• Reduce sodium in diet significantly\n• Eat potassium-rich foods: bananas, spinach, sweet potato\n• Avoid processed and packaged foods\n• Regular aerobic exercise lowers BP naturally\n• Stress reduction: meditation, deep breathing\n• Take prescribed antihypertensives daily\n\n💊 Common medications: Amlodipine, Atenolol, Losartan, Ramipril`,

  allergy: `🤧 **Allergy Management**\n\n• Identify and strictly avoid allergens\n• Keep antihistamines (Cetirizine, Loratadine) handy\n• For nasal symptoms: use corticosteroid nasal spray\n• Keep windows closed during high-pollen seasons\n• Use air purifier if available\n• Keep pet dander low if allergic to pets\n\n🚨 **Anaphylaxis Emergency:**\n→ Sudden difficulty breathing, swelling of throat, rapid pulse\n→ Use EpiPen immediately if prescribed\n→ **Call 112 immediately — this is life-threatening!**`,

  heart: `❤️ **Heart Attack Signs & Action**\n\n**FAST RECOGNITION:**\n• Chest pain, pressure, or tightness\n• Pain spreading to left arm, jaw, or back\n• Shortness of breath\n• Cold sweat, nausea, dizziness\n\n🚨 **IMMEDIATE ACTIONS:**\n1. Call 112 (Emergency) immediately\n2. Call 108 (Ambulance) for transport\n3. Make patient sit or lie in comfortable position\n4. Loosen tight clothing\n5. Give aspirin (chew, don't swallow) if available and not allergic\n6. Begin CPR if patient becomes unresponsive and trained`,

  stroke: `🧠 **Stroke — FAST Test**\n\n**F** - Face drooping on one side?\n**A** - Arm weakness or numbness?\n**S** - Speech difficulty or slurred?\n**T** - Time to call 112 immediately!\n\n🚨 **Emergency Actions:**\n1. Call 112 NOW — every minute matters\n2. Note the exact time symptoms started\n3. Keep patient calm, do NOT give food or water\n4. Do NOT give aspirin (different from heart attack)\n5. Stay with patient until ambulance arrives`,

  firstaid: `🏥 **First Aid Basics**\n\n**Emergency Numbers:**\n→ Medical Emergency: **112** (National)\n→ Ambulance: **108**\n→ Women Helpline: **1091**\n→ Police: **100** | Fire: **101**\n\n**General Principles:**\n• Stay calm — panic worsens situations\n• Assess safety for yourself first\n• Prioritize: Airway → Breathing → Circulation\n• Call 112 for any life-threatening emergency\n• Document time of injury/symptoms for doctors\n• Do NOT move someone with suspected spinal injury`,

  'first aid': `🏥 **First Aid Basics**\n\n**Emergency Numbers:**\n→ Medical Emergency: **112** (National)\n→ Ambulance: **108**\n\n**General Principles:**\n• Stay calm and assess the situation\n• Call 112 for any life-threatening emergency\n• Prioritize: Airway → Breathing → Circulation\n• Do NOT move someone with suspected spinal injury`,

  cpr: `💓 **CPR (Cardiopulmonary Resuscitation)**\n\n1. Ensure scene safety\n2. Check if person is responsive (tap shoulders, call out)\n3. Call 112 immediately or ask someone to call\n4. Check for breathing (look for chest rise, max 10 sec)\n5. Begin chest compressions:\n   → Place heel of hand on center of chest\n   → Compress 2-2.4 inches deep at 100-120 per minute\n   → Allow full chest recoil between compressions\n6. If trained: give 2 rescue breaths after every 30 compressions\n7. Continue until ambulance arrives or AED is available`,

  snake: `🐍 **Snake Bite Emergency**\n\n🚨 **IMMEDIATELY:**\n1. Call 112 for emergency\n2. Keep the person calm and still (reduces venom spread)\n3. Keep bitten limb below heart level\n4. Remove jewelry/tight clothing near bite\n5. Mark edge of swelling with pen, note time every 15 min\n\n❌ **NEVER:**\n→ Cut the wound or try to suck out venom\n→ Apply tourniquet or ice\n→ Give alcohol or medications\n\nNote snake appearance if safe — helps with antivenom`,

  heat: `🌞 **Heatstroke Emergency**\n\n🚨 **CALL 112 IMMEDIATELY if:**\n• Body temp >40°C (104°F)\n• Confusion, loss of consciousness\n• Hot, dry or damp skin\n\n**Immediate Actions:**\n1. Move person to cool, shaded area\n2. Remove excess clothing\n3. Apply cool water to skin, fan vigorously\n4. Ice packs on neck, armpits, and groin\n5. Do NOT give fluids if unconscious\n\n⚠️ Do NOT give aspirin or paracetamol — they don't help heatstroke`,

  pregnancy: `🤰 **Pregnancy Health Tips**\n\n• Take folic acid 400mcg daily (pre and during pregnancy)\n• Attend all prenatal check-ups\n• Avoid alcohol, smoking, and raw/undercooked foods\n• Take iron and calcium supplements as prescribed\n• Rest adequately and stay hydrated\n• Safe exercise: walking, swimming, prenatal yoga\n\n🚨 **Seek immediate care:**\n→ Heavy vaginal bleeding\n→ Severe abdominal pain\n→ Decreased fetal movement\n→ Severe headache with vision changes`,

  asthma: `🫁 **Asthma Attack Management**\n\n**Mild to Moderate:**\n1. Sit upright, stay calm, breathe slowly\n2. Use blue relief inhaler (Salbutamol) immediately\n3. Take puffs every 30-60 seconds, up to 10 puffs\n4. Rest and monitor breathing\n\n🚨 **Severe Attack — Call 112 if:**\n→ Blue lips or fingernails\n→ Too breathless to speak\n→ Heart racing rapidly\n→ Rescue inhaler not working after 10 puffs\n\n⚠️ Never withhold reliever inhaler during attack`,
}

// Match user query to knowledge base
function findResponse(query: string): string | null {
  const q = query.toLowerCase()
  
  // Direct keyword matching
  const keywordMap: Record<string, string> = {
    fever: 'fever', temperature: 'fever', 'high temp': 'fever',
    headache: 'headache', migraine: 'headache', 'head pain': 'headache',
    cold: 'cold', flu: 'cold', runny: 'cold', sneezing: 'cold', 'sore throat': 'cold',
    cough: 'cough', coughing: 'cough',
    stomach: 'stomach', 'stomach ache': 'stomach', gastritis: 'stomach',
    'nausea': 'stomach', abdomen: 'stomach', tummy: 'stomach',
    diarrhea: 'diarrhea', loose: 'diarrhea', 'loose motion': 'diarrhea',
    vomit: 'vomiting', vomiting: 'vomiting',
    dehydration: 'dehydration', dehydrated: 'dehydration', thirst: 'dehydration',
    pain: 'pain', ache: 'pain', hurt: 'pain',
    diabetes: 'diabetes', sugar: 'diabetes', diabetic: 'diabetes',
    'blood pressure': 'bp', hypertension: 'hypertension', bp: 'bp',
    allergy: 'allergy', allergic: 'allergy',
    heart: 'heart', cardiac: 'heart', chest: 'heart', 'heart attack': 'heart',
    stroke: 'stroke', paralysis: 'stroke',
    cpr: 'cpr', resuscitation: 'cpr',
    snake: 'snake', 'snake bite': 'snake', snakebite: 'snake',
    heat: 'heat', heatstroke: 'heat', sunstroke: 'heat',
    pregnancy: 'pregnancy', pregnant: 'pregnancy',
    asthma: 'asthma', breathing: 'asthma', inhaler: 'asthma',
    'first aid': 'firstaid', firstaid: 'firstaid', emergency: 'firstaid',
    help: 'firstaid',
  }

  for (const [keyword, topic] of Object.entries(keywordMap)) {
    if (q.includes(keyword)) {
      return HEALTH_KB[topic] || null
    }
  }
  return null
}

// Simulate a small delay for natural feel
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function AIHealthAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 Hello! I'm your **Offline Health Assistant** — working 100% on your device with no internet needed.\n\nI can help with:\n• 🤒 Fever, cold, cough, headache\n• 💊 Diabetes, BP, asthma management\n• 🚑 Heart attack, stroke, first aid\n• 💧 Dehydration, stomach issues\n• 🐍 Snake bite, heatstroke emergencies\n\nType your symptom or health question below!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    const userMessage: Message = {
      role: 'user',
      content: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Small delay for natural feel
    await sleep(600)

    let response = findResponse(userMsg)

    if (!response) {
      response = `I don't have specific information on "${userMsg}", but here's what I can help with:\n\n` +
        `• Fever, headache, cold, cough\n` +
        `• Stomach ache, diarrhea, vomiting\n` +
        `• Diabetes, blood pressure, asthma\n` +
        `• Heart attack, stroke, first aid\n` +
        `• Dehydration, allergies, CPR\n` +
        `• Snake bite, heatstroke, pregnancy\n\n` +
        `🚨 **Emergency?** Go to SOS tab → Call **112** (emergency) or **108** (ambulance)\n\n` +
        `*This app provides general health guidance, not medical diagnosis. Always consult a doctor for diagnosis and treatment.*`
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is supported in Chrome/Edge browsers on Android phones.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick suggestion chips
  const suggestions = ['Fever', 'Headache', 'Diabetes', 'Blood Pressure', 'First Aid', 'CPR', 'Heart Attack', 'Asthma']

  return (
    <div className="glass-card flex-1 flex flex-col p-0 overflow-hidden border-none shadow-2xl h-[750px] relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <FaRobot className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white">HEALTH AI</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Offline Knowledge Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-[11px] font-bold border border-white/20">
            <FaBrain className="text-green-300" />
            <span>100% OFFLINE</span>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 flex gap-2 overflow-x-auto scrollbar-thin shrink-0">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            className="whitespace-nowrap text-xs font-bold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shrink-0"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line font-medium leading-relaxed">{message.content}</p>
              {message.time && (
                <span className="text-[10px] opacity-40 mt-1.5 block text-right">{message.time}</span>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-1">AI</div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex space-x-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask about any symptom or health topic..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="w-full pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none text-slate-900 dark:text-white text-sm transition-all"
            />
          </div>
          <motion.button
            onClick={handleVoiceInput}
            disabled={isListening || isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <FaMicrophone className={isListening ? 'animate-pulse' : ''} />
          </motion.button>
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center disabled:opacity-40 disabled:shadow-none transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane className="text-sm" />
          </motion.button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center font-medium uppercase tracking-widest">
          {isListening ? '🎤 Listening...' : '⚡ Instant • No Internet • 100% Private'}
        </p>
      </div>
    </div>
  )
}

export default AIHealthAssistant
