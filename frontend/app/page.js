"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import LinkedInLoginButton from "../components/auth/LinkedInLoginButton";
import LinkedInAnalytics from "../components/linkedin/LinkedInAnalytics";
import DebugInfo from "../components/utils/DebugInfo";
import LinkedInStatus from "../components/linkedin/LinkedInStatus";
import { Icon } from "../components/ui/Icon";
import AnimatedIcon from "../components/icons/AnimatedIcon";


export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check if user is already authenticated - direct dashboard
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (authLoading) return;

      // Authenticated user ko direct dashboard pe bhejo
      if (isAuthenticated && user) {
        router.push('/dashboard');
        return;
      }
      
      setIsCheckingOnboarding(false);
    };

    checkOnboardingStatus();
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Show loading while checking authentication and onboarding
  if (authLoading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl"
          />
        </div>

        <div className="text-center relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto mb-8"
          >
            <img 
              src="/socialrva-logo-full.png" 
              alt="SocialRva - Guided Social Growth" 
              className="h-16 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
          />

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {isCheckingOnboarding ? 'Checking your status...' : 'Loading SocialRva'}
            </h2>
            <p className="text-gray-400">
              {isCheckingOnboarding 
                ? 'Please wait, checking your account...' 
                : 'Preparing your social growth experience...'}
            </p>
          </motion.div>

          {/* Progress Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl"
          />
        </div>

        <div className="text-center relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto mb-8"
          >
            <img 
              src="/socialrva-logo-full.png" 
              alt="SocialRva - Guided Social Growth" 
              className="h-16 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
          />

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Loading SocialRva</h2>
            <p className="text-gray-400">Preparing your social growth experience...</p>
          </motion.div>

          {/* Progress Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between p-4"
      >
        <div className="flex items-center space-x-4">
          <img 
            src="/socialrva-logo-full.png" 
            alt="SocialRva - Guided Social Growth" 
            className="h-10 object-contain drop-shadow-lg"
          />
        </div>

        <div className="flex items-center space-x-4">
          <LinkedInLoginButton className="!h-10 !py-0 !px-4 text-sm flex items-center" />
          <LinkedInStatus />
          <DebugInfo />
        </div>
      </motion.nav>

      {/* Hero Section - Full Height */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            
            {/* Left Side - Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-6"
            >
              {/* Hero Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm w-fit shadow-lg"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-400 rounded-full mr-2"
                />
                <AnimatedIcon name="rocket" animation="bounce" size={14} className="mr-2" />
                AI-Powered Social Media Growth
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                >
                  <span className="text-white">Guided</span>
                  <br />
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                    animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Social Growth
                  </motion.span>
                  <br />
                  <span className="text-white">with</span>{" "}
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    AI
                  </motion.span>
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-300 leading-relaxed max-w-xl"
                >
                  <span>
                    Transform your social media presence with{" "}
                    <span className="text-blue-400 font-semibold">AI-powered content creation</span>,{" "}
                    smart analytics, and guided growth strategies. Join{" "}
                    <span className="text-blue-300 font-semibold">10,000+ creators</span> already growing with SocialRva!
                  </span>
                  <span className="inline-block ml-2">
                    <AnimatedIcon name="sparkles" animation="glow" size={18} />
                  </span>
                </motion.div>
              </div>

              {/* CTA Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                {/* Social Proof Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-blue-500/20"
                  >
                    <div className="text-xl font-bold text-blue-400">10K+</div>
                    <div className="text-xs text-gray-400">Posts Generate</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-blue-500/20"
                  >
                    <div className="text-xl font-bold text-blue-400">50+</div>
                    <div className="text-xs text-gray-400">Languages</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-blue-500/20"
                  >
                    <div className="text-xl font-bold text-blue-400">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </motion.div>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </motion.div>

            {/* Right Side - Interactive Demo */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center relative h-full"
            >
              {/* Main Demo Container */}
              <div className="relative max-w-lg mx-auto">
                {/* Glowing border effect */}
                <motion.div 
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-3xl blur-lg opacity-30"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Demo Content */}
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl">
                  <LinkedInAnalytics />
                </div>

                {/* Floating Action Buttons */}
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer"
                >
                  <Icon name="zap" size={24} className="text-white" />
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 12, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer"
                >
                  <Icon name="rocket" size={20} className="text-white" />
                </motion.div>

                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute top-1/2 -right-6 w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
                >
                  <Icon name="sparkles" size={16} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
