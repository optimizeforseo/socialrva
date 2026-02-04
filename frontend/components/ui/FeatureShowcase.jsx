"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

export default function FeatureShowcase({ features = [], className }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const defaultFeatures = [
    {
      id: 1,
      title: "AI Content Generation",
      description: "Create engaging posts with advanced AI that understands your brand voice and audience preferences.",
      icon: "🤖",
      gradient: "from-purple-500 to-blue-500",
      stats: "10K+ Posts Generated",
      image: "/api/placeholder/400/300",
      benefits: ["Save 5+ hours weekly", "Increase engagement by 300%", "Multi-language support"]
    },
    {
      id: 2,
      title: "Smart Analytics",
      description: "Get deep insights into your content performance with AI-powered analytics and predictions.",
      icon: "📊",
      gradient: "from-blue-500 to-cyan-500",
      stats: "99.9% Accuracy",
      image: "/api/placeholder/400/300",
      benefits: ["Real-time insights", "Predictive analytics", "Custom reports"]
    },
    {
      id: 3,
      title: "Voice to Content",
      description: "Speak your ideas and watch them transform into polished, professional social media posts.",
      icon: "🎤",
      gradient: "from-pink-500 to-red-500",
      stats: "Voice Recognition",
      image: "/api/placeholder/400/300",
      benefits: ["Natural speech processing", "Instant transcription", "Context understanding"]
    },
    {
      id: 4,
      title: "Multi-Platform Publishing",
      description: "Publish to all your social media platforms simultaneously with optimized content for each.",
      icon: "🌐",
      gradient: "from-green-500 to-teal-500",
      stats: "15+ Platforms",
      image: "/api/placeholder/400/300",
      benefits: ["One-click publishing", "Platform optimization", "Scheduled posting"]
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <div className={cn("w-full", className)}>
      {/* Feature Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {displayFeatures.map((feature, index) => (
          <motion.button
            key={feature.id}
            onClick={() => setActiveFeature(index)}
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
            className={cn(
              "relative p-6 rounded-2xl border transition-all duration-300 text-left",
              activeFeature === index
                ? "bg-slate-800/80 border-purple-500/50 shadow-xl"
                : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50"
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Gradient */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                `bg-gradient-to-br ${feature.gradient}/10`
              )}
              animate={{
                opacity: activeFeature === index || hoveredFeature === index ? 1 : 0
              }}
            />

            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-all duration-300",
                  activeFeature === index
                    ? `bg-gradient-to-r ${feature.gradient} shadow-lg`
                    : "bg-slate-700/50"
                )}
                animate={{
                  rotate: activeFeature === index ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {feature.description}
              </p>

              {/* Stats Badge */}
              <Badge 
                variant={activeFeature === index ? "primary" : "secondary"}
                size="sm"
              >
                {feature.stats}
              </Badge>

              {/* Active Indicator */}
              {activeFeature === index && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-b-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Feature Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content Side */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-r ${displayFeatures[activeFeature].gradient} shadow-lg`}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {displayFeatures[activeFeature].icon}
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {displayFeatures[activeFeature].title}
                  </h2>
                  <Badge variant="primary" className="mt-2">
                    {displayFeatures[activeFeature].stats}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed">
                {displayFeatures[activeFeature].description}
              </p>

              {/* Benefits */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">Key Benefits:</h4>
                <div className="space-y-2">
                  {displayFeatures[activeFeature].benefits?.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-sm">
                        ✓
                      </div>
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1 sm:flex-none">
                  <span className="mr-2">🚀</span>
                  Try Now
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative">
              {/* Main Visual Container */}
              <motion.div
                className="relative bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${displayFeatures[activeFeature].gradient}/10`} />
                
                {/* Demo Content */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  
                  {/* Simulated Interface */}
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-4 bg-slate-700/50 rounded animate-pulse"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                      />
                    ))}
                  </div>

                  {/* Interactive Elements */}
                  <div className="flex space-x-2 mt-6">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${displayFeatures[activeFeature].gradient}/30 border border-current/20`}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-xl shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}