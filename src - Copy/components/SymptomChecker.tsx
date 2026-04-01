import { useState } from 'react'
import { motion } from 'framer-motion'
import { symptomCheckerTree, getSeverityColor } from '../data/symptomChecker'

function SymptomChecker() {
  const [currentNode, setCurrentNode] = useState(symptomCheckerTree[0])
  const [history, setHistory] = useState<string[]>([])

  const handleAnswer = (nextId: string) => {
    const nextNode = symptomCheckerTree.find(n => n.id === nextId)
    if (nextNode) {
      setHistory([...history, currentNode.id])
      setCurrentNode(nextNode)
    }
  }

  const restart = () => {
    setCurrentNode(symptomCheckerTree[0])
    setHistory([])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">Symptom Checker</h2>
        {history.length > 0 && (
          <button onClick={restart} className="btn-primary text-sm">
            Start Over
          </button>
        )}
      </div>

      <motion.div
        key={currentNode.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className={`p-6 rounded-xl bg-${getSeverityColor(currentNode.severity)}-50 dark:bg-${getSeverityColor(currentNode.severity)}-900/20 border border-${getSeverityColor(currentNode.severity)}-200 dark:border-${getSeverityColor(currentNode.severity)}-800`}>
          <h3 className="text-xl font-semibold mb-2">{currentNode.question}</h3>
          <p className="text-sm">{currentNode.advice}</p>
        </div>

        {currentNode.nextQuestions && currentNode.nextQuestions.length > 0 ? (
          <div className="space-y-3">
            {currentNode.nextQuestions.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(option.nextId)}
                className="w-full glass-button text-left p-4 hover:scale-[1.02]"
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.answer}
              </motion.button>
            ))}
          </div>
        ) : (
          <div>
            {currentNode.possibleConditions && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Possible Conditions:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentNode.possibleConditions.map((condition, idx) => (
                    <span key={idx} className="badge bg-blue-100 dark:bg-blue-900/30">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={restart} className="btn-primary w-full mt-4">
              Check Another Symptom
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default SymptomChecker
