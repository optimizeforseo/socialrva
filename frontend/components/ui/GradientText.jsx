"use client";

import { motion } from 'framer-motion';

export default function GradientText({ 
  children, 
  gradient = 'from-purple-400 via-pink-400 to-blue-400',
  className = '',
  animate = false
}) {
  return (
    <motion.span
      className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient} ${className}`}
      animate={animate ? {
        backgroundPosition: ['0%', '100%', '0%']
      } : {}}
      transition={animate ? {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      } : {}}
      style={{
        backgroundSize: animate ? '200% 200%' : '100% 100%'
      }}
    >
      {children}
    </motion.span>
  );
}