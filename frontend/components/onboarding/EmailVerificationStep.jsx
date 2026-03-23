"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export default function EmailVerificationStep({ userData, updateUserData, nextStep }) {
  const [email, setEmail] = useState(userData.email || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyEmail = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Simulate email verification for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsVerified(true);
      updateUserData({ email, emailVerified: true });
      
      // Auto proceed after verification
      setTimeout(() => {
        nextStep();
      }, 1500);
      
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="mail" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Email Verification
        </h2>
        <p className="text-gray-300 text-lg">
          First, let's verify your email to keep your account secure
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
      >
        {!isVerified ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isVerifying}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <Icon name="alert-circle" size={16} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.button
              onClick={handleVerifyEmail}
              disabled={isVerifying || !email}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isVerifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Icon name="mail-check" size={20} />
                  <span>Verify Email</span>
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="check" size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Email Verified!</h3>
            <p className="text-gray-300">
              Your email has been successfully verified
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Icon name="arrow-right" size={16} />
              <span className="text-sm">Proceeding to next step...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}