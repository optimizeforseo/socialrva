"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/Icon';

const ANALYSIS_STEPS = [
  { id: 'profile', text: 'Analyzing LinkedIn profile data...', icon: 'user' },
  { id: 'content', text: 'Reviewing content strategy...', icon: 'file-text' },
  { id: 'network', text: 'Evaluating network connections...', icon: 'users' },
  { id: 'engagement', text: 'Measuring engagement patterns...', icon: 'heart' },
  { id: 'insights', text: 'Generating personalized insights...', icon: 'lightbulb' },
  { id: 'recommendations', text: 'Creating growth recommendations...', icon: 'target' }
];

const MOCK_ANALYSIS_RESULTS = {
  profileScore: 78,
  strengths: [
    'Strong professional headline',
    'Comprehensive work experience',
    'Active in industry discussions',
    'Good connection diversity'
  ],
  improvements: [
    'Add more industry-specific keywords',
    'Increase posting frequency',
    'Engage more with others\' content',
    'Optimize profile summary'
  ],
  insights: [
    {
      title: 'Content Performance',
      description: 'Your posts about technology trends get 3x more engagement',
      icon: 'trending-up',
      color: 'green'
    },
    {
      title: 'Network Growth',
      description: 'You\'re well-connected in your industry with 85% relevant connections',
      icon: 'users',
      color: 'blue'
    },
    {
      title: 'Engagement Rate',
      description: 'Your engagement rate is 12% above industry average',
      icon: 'heart',
      color: 'red'
    },
    {
      title: 'Posting Consistency',
      description: 'Increase posting frequency to 2-3 times per week for better reach',
      icon: 'calendar',
      color: 'purple'
    }
  ],
  recommendations: [
    {
      title: 'Optimize Your Headline',
      description: 'Add industry keywords to increase discoverability',
      priority: 'High',
      effort: 'Low'
    },
    {
      title: 'Create Content Calendar',
      description: 'Plan and schedule posts for consistent engagement',
      priority: 'Medium',
      effort: 'Medium'
    },
    {
      title: 'Engage with Industry Leaders',
      description: 'Comment meaningfully on posts from thought leaders',
      priority: 'High',
      effort: 'Low'
    },
    {
      title: 'Share Industry Insights',
      description: 'Post about trends and developments in your field',
      priority: 'Medium',
      effort: 'High'
    }
  ]
};

export default function ProfileAnalysisStep({ userData, updateUserData, nextStep }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate AI analysis process
    const runAnalysis = async () => {
      // Step through analysis phases
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentStep(i);
      }
      
      // Complete analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAnalyzing(false);
      setAnalysisResults(MOCK_ANALYSIS_RESULTS);
      setShowResults(true);
    };

    runAnalysis();
  }, []);

  const handleComplete = () => {
    updateUserData({ 
      profileAnalysis: analysisResults,
      onboardingComplete: true 
    });
    nextStep();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-600/20 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-600/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="brain" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Analyzing Profile by AI
        </h2>
        <p className="text-gray-300 text-lg">
          AI is analyzing your LinkedIn profile for personalized insights
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold text-white mb-2">
                AI Analysis in Progress
              </h3>
              <p className="text-gray-400">
                Please wait while we analyze your profile and generate insights
              </p>
            </div>

            {/* Analysis Steps */}
            <div className="space-y-4">
              {ANALYSIS_STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0 
                  }}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                    index <= currentStep 
                      ? 'bg-indigo-600/20 border border-indigo-500/30' 
                      : 'bg-slate-700/30 border border-slate-600/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index < currentStep 
                      ? 'bg-green-600' 
                      : index === currentStep 
                        ? 'bg-indigo-600' 
                        : 'bg-slate-600'
                  }`}>
                    {index < currentStep ? (
                      <Icon name="check" size={20} className="text-white" />
                    ) : index === currentStep ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <Icon name={step.icon} size={20} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      index <= currentStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Score */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Your LinkedIn Profile Score
                </h3>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={`${getScoreColor(analysisResults.profileScore)}`}
                      initial={{ strokeDasharray: "0 314" }}
                      animate={{ 
                        strokeDasharray: `${(analysisResults.profileScore / 100) * 314} 314` 
                      }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(analysisResults.profileScore)}`}>
                      {analysisResults.profileScore}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 mt-4">
                  Great profile! You're above average in most areas.
                </p>
              </div>
            </div>

            {/* Insights Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {analysisResults.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${
                      insight.color === 'green' ? 'from-green-500 to-green-600' :
                      insight.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      insight.color === 'red' ? 'from-red-500 to-red-600' :
                      'from-purple-500 to-purple-600'
                    } rounded-xl flex items-center justify-center`}>
                      <Icon name={insight.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">
                        {insight.title}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Icon name="target" size={20} />
                <span>Personalized Recommendations</span>
              </h3>
              
              <div className="space-y-4">
                {analysisResults.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start justify-between p-4 bg-slate-700/30 rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs text-gray-500">
                          {rec.effort} Effort
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                onClick={handleComplete}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Complete Onboarding</span>
                <Icon name="check-circle" size={20} />
              </motion.button>
              <p className="text-gray-400 text-sm mt-3">
                Ready to start your LinkedIn growth journey!
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}