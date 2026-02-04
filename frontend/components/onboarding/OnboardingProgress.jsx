"use client";

import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export default function OnboardingProgress({ currentStep, totalSteps, steps }) {
  return (
    <div className="relative z-10 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-slate-800/50 border-slate-600 text-gray-500'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Icon name="check" size={16} />
                  </motion.div>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}

                {/* Active Step Pulse */}
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <motion.div
                className="ml-3 hidden sm:block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              >
                <div className={`text-sm font-medium transition-colors ${
                  index <= currentStep ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
              </motion.div>

              {/* Connection Line */}
              {index < totalSteps - 1 && (
                <motion.div
                  className="flex-1 h-0.5 mx-4 bg-slate-700 relative overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {index < currentStep && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Percentage */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-gray-400 mb-2">
            Progress: {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}