"use client";

import { motion } from 'framer-motion';

const badgeVariants = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
  success: 'bg-gradient-to-r from-green-600 to-green-700 text-white',
  warning: 'bg-gradient-to-r from-orange-600 to-orange-700 text-white',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white',
  info: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white',
  secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
};

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  animate = false,
  ...props 
}) {
  const badgeClasses = `
    inline-flex items-center justify-center
    font-medium rounded-full
    shadow-lg backdrop-blur-sm
    ${badgeVariants[variant]}
    ${badgeSizes[size]}
    ${className}
  `.trim();

  if (animate) {
    return (
      <motion.span
        className={badgeClasses}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
}