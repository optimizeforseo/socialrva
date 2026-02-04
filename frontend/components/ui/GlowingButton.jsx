"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GlowingButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  glowColor = 'purple'
}) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
    secondary: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white',
    success: 'bg-gradient-to-r from-green-600 to-blue-600 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
    outline: 'border-2 border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const glowColors = {
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    pink: 'shadow-pink-500/50',
    green: 'shadow-green-500/50',
    red: 'shadow-red-500/50'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${isHovered ? `shadow-2xl ${glowColors[glowColor]}` : 'shadow-lg'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{
        boxShadow: isHovered 
          ? `0 0 30px ${glowColor === 'purple' ? '#a855f7' : glowColor === 'blue' ? '#3b82f6' : '#ec4899'}40`
          : '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6 }}
      />

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>

      {/* Glow effect */}
      {isHovered && (
        <motion.div
          className={`absolute inset-0 rounded-xl blur-xl ${glowColors[glowColor]} opacity-50`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}