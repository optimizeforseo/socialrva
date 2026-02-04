"use client";

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';

const IconButton = forwardRef(({ 
  icon,
  variant = "ghost",
  size = "md",
  className,
  children,
  tooltip,
  ...props 
}, ref) => {
  const variants = {
    ghost: "hover:bg-slate-700/50 text-gray-400 hover:text-white",
    solid: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg",
    outline: "border border-slate-600 text-gray-300 hover:border-purple-500 hover:text-white hover:bg-purple-500/10",
    danger: "hover:bg-red-500/10 text-red-400 hover:text-red-300 hover:border-red-500/50",
  };

  const sizes = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-3",
    xl: "w-14 h-14 p-3.5",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900",
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={tooltip}
      {...props}
    >
      {icon && (
        <Icon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? "mr-2" : ""} 
        />
      )}
      {children}
    </motion.button>
  );
});

IconButton.displayName = "IconButton";

export { IconButton };