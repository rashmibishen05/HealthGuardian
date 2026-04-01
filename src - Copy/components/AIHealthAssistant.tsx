import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function AIHealthAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I\'m your offline health assistant. I can provide general health information, first-aid guidance, and answer basic health questions. How can I help you today?\n\nNote: I am NOT a replacement for professional medical advice.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sdkInitialized, setSDKInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Initialize RunAnywhere SDK (simplified - actual initialization would be more complex)
    initializeSDK()
  }, [])

  const initializeSDK = async () => {
    try {
      // In a real implementation, you would initialize the RunAnywhere SDK here
      // For now, we'll simulate initialization
      console.log('Initializing RunAnywhere SDK...')
      
      // Simulate SDK initialization delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setSDKInitialized(true)
      console.log('SDK initialized (simulated)')
    } catch (error) {
      console.error('Failed to initialize SDK:', error)
      setInitError('Failed to initialize AI assistant. Using fallback mode.')
    }
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Health-related knowledge base for offline responses
    const responses: { [key: string]: string } = {
      fever: 'For fever:\n• Rest and stay hydrated\n• Take acetaminophen or ibuprofen as directed\n• Use cool compresses\n• Seek medical attention if fever is >103°F (39.4°C) or lasts >3 days\n• For children, consult a pediatrician',
      headache: 'For headaches:\n• Rest in a quiet, dark room\n• Apply cold or warm compress\n• Stay hydrated\n• Take OTC pain relievers if needed\n• Seek help if sudden, severe, or accompanied by other symptoms',
      cold: 'For common cold:\n• Rest and fluids\n• Warm liquids can soothe throat\n• Use saline nasal drops\n• OTC medications for symptom relief\n• See doctor if symptoms worsen or last >10 days',
      cough: 'For cough:\n• Stay hydrated\n• Use honey (for age 1+)\n• Humidifier may help\n• Avoid irritants/smoke\n• See doctor if persistent, bloody, or with fever',
      pain: 'For pain management:\n• Rest the affected area\n• Apply ice (first 48 hours) then heat\n• OTC pain relievers as directed\n• Gentle stretching\n• Seek medical care for severe or persistent pain',
      'stomach ache': 'For stomach ache:\n• Avoid solid foods temporarily\n• Sip clear fluids\n• Try BRAT diet (Bananas, Rice, Applesauce, Toast)\n• Avoid dairy, caffeine, alcohol\n• See doctor if severe, persistent, or with other symptoms',
      dehydration: 'For dehydration:\n• Sip water or electrolyte drinks\n• Eat water-rich foods\n• Avoid caffeine and alcohol\n• Rest\n• Seek medical help if severe symptoms (dizziness, rapid heartbeat, confusion)',
      'first aid': 'First aid basics:\n• Stay calm and assess situation\n• Call 911 for emergencies\n• Stop any bleeding with pressure\n• Protect wounds from infection\n• Never move someone with suspected spine injury\n• Learn CPR if possible',
    }

    const lowerMessage = userMessage.toLowerCase()

    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response
      }
    }

    // Default response
    return `I understand you're asking about "${userMessage}". While I can provide general health information, I recommend:\n\n1. Consult a healthcare professional for personalized advice\n2. Call emergency services (911) if it's an emergency\n3. Visit the SOS tab for first-aid instructions\n4. Check the Medicine Info tab for medication details\n\nPlease rephrase your question or ask about: fever, headache, cold, cough, pain, stomach ache, dehydration, or first aid.`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Generate response (in real app, this would use RunAnywhere LLM)
      const response = await generateResponse(input)
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      alert('Voice input failed. Please try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">AI Health Assistant</h2>
        <p className="text-sm text-green-100">
          {sdkInitialized ? 'Offline Mode Active' : initError || 'Initializing...'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a health question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleVoiceInput}
            disabled={isListening || isLoading}
            className={`p-2 rounded-lg ${
              isListening
                ? 'bg-red-500 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50`}
            title="Voice input"
          >
            <svg
              className={`w-6 h-6 ${isListening ? 'text-white' : 'text-gray-700'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • Click microphone for voice input
        </p>
      </div>
    </div>
  )
}

export default AIHealthAssistant
