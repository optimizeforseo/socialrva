"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/Icon';
import EmailVerificationStep from './EmailVerificationStep';
import LanguageCountryStep from './LanguageCountryStep';
import LinkedInTopicsStep from './LinkedInTopicsStep';
import LinkedInSuperstarsStep from './LinkedInSuperstarsStep';
import IndustryLeadersStep from './IndustryLeadersStep';
import AIPostGenerationStep from './AIPostGenerationStep';
import ProfileAnalysisStep from './ProfileAnalysisStep';
import OnboardingProgress from './OnboardingProgress';

const STEPS = [
  { id: 'email', title: 'Email Verification', component: EmailVerificationStep },
  { id: 'language', title: 'Language & Country', component: LanguageCountryStep },
  { id: 'topics', title: 'LinkedIn Topics', component: LinkedInTopicsStep },
  { id: 'superstars', title: 'LinkedIn Superstars', component: LinkedInSuperstarsStep },
  { id: 'leaders', title: 'Industry Leaders', component: IndustryLeadersStep },
  { id: 'post', title: 'AI Post Generation', component: AIPostGenerationStep },
  { id: 'analysis', title: 'Profile Analysis', component: ProfileAnalysisStep }
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Complete onboarding and redirect to dashboard
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsTransitioning(true);
      
      console.log('Saving onboarding data:', userData);
      
      // Get API base URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
      
      // Save onboarding data to backend
      const response = await fetch(`${apiBaseUrl}/onboarding/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      console.log('Backend response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Onboarding saved successfully:', data);
        
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.profile = { 
          ...currentUser.profile, 
          isOnboardingComplete: true,
          language: userData.language,
          country: userData.country
        };
        currentUser.preferences = {
          ...currentUser.preferences,
          selectedTopics: userData.selectedTopics,
          selectedSuperstars: userData.selectedSuperstars,
          selectedLeaders: userData.selectedLeaders
        };
        currentUser.onboardingCompletedAt = new Date().toISOString();
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Trigger storage event to update AuthContext
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to dashboard
        console.log('Redirecting to dashboard...');
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        console.error('Failed to save onboarding data:', errorData);
        alert('Failed to save onboarding data. Please try again.');
        setIsTransitioning(false);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error completing onboarding. Please check your connection and try again.');
      setIsTransitioning(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const updateUserData = (stepData) => {
    setUserData(prev => ({ ...prev, ...stepData }));
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/socialrva-logo-full.png" 
              alt="SocialRva" 
              className="h-8 object-contain"
            />
            <div className="text-white">
              <h1 className="text-lg font-semibold">Welcome to SocialRva</h1>
              <p className="text-sm text-gray-400">Your guided social growth journey starts here</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon name="x" size={20} />
          </motion.button>
        </div>
      </motion.header>

      {/* Progress Bar */}
      <OnboardingProgress 
        currentStep={currentStep} 
        totalSteps={STEPS.length}
        steps={STEPS}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={isTransitioning ? 'pointer-events-none' : ''}
            >
              <CurrentStepComponent
                userData={userData}
                updateUserData={updateUserData}
                nextStep={nextStep}
                prevStep={prevStep}
                currentStep={currentStep}
                totalSteps={STEPS.length}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              currentStep === 0 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
            }`}
            whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
          >
            <Icon name="arrow-left" size={16} />
            <span>Previous</span>
          </motion.button>

          <div className="text-center text-gray-400 text-sm">
            Step {currentStep + 1} of {STEPS.length}
          </div>

          <motion.button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}</span>
            <Icon name={currentStep === STEPS.length - 1 ? "check" : "arrow-right"} size={16} />
          </motion.button>
        </div>
      </motion.footer>
    </div>
  );
}