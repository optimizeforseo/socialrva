"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' }
];

export default function LanguageCountryStep({ userData, updateUserData, nextStep }) {
  const [selectedLanguage, setSelectedLanguage] = useState(userData.language || 'en');
  const [selectedCountry, setSelectedCountry] = useState(userData.country || 'US');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleContinue = () => {
    setIsAnimating(true);
    updateUserData({ 
      language: selectedLanguage, 
      country: selectedCountry 
    });
    
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="globe" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Language & Country Selection
        </h2>
        <p className="text-gray-300 text-lg">
          Aapki language aur country select kariye taaki hum aapko personalized content de sakein
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Icon name="message-circle" size={20} />
            <span>Select Language</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`p-3 rounded-xl border transition-all text-left ${
                  selectedLanguage === language.code
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-700/30 border-slate-600/50 text-gray-300 hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs opacity-70">{language.code.toUpperCase()}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Country Selection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Icon name="map-pin" size={20} />
            <span>Select Country</span>
          </h3>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {COUNTRIES.map((country) => (
              <motion.button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className={`w-full p-3 rounded-xl border transition-all text-left ${
                  selectedCountry === country.code
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-700/30 border-slate-600/50 text-gray-300 hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{country.flag}</span>
                  <div>
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs opacity-70">{country.code}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <motion.button
          onClick={handleContinue}
          disabled={isAnimating}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <Icon name="arrow-right" size={20} />
            </>
          )}
        </motion.button>
        
        <div className="mt-4 text-sm text-gray-400">
          Selected: {LANGUAGES.find(l => l.code === selectedLanguage)?.name} • {COUNTRIES.find(c => c.code === selectedCountry)?.name}
        </div>
      </motion.div>
    </div>
  );
}