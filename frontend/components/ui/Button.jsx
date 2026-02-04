"use client";

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = {
  default: "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    primary: "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-purple-500",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-slate-500",
    outline: "border-2 border-purple-500/50 bg-transparent text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 focus-visible:ring-purple-500",
    ghost: "text-gray-300 hover:bg-slate-800/50 hover:text-white focus-visible:ring-slate-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-red-500",
  },
  sizes: {
    xs: "h-8 px-3 text-xs",
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-6 text-sm",
    lg: "h-12 px-8 text-base",
    xl: "h-14 px-10 text-lg",
  }
};

export const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  loading = false,
  ...props 
}, ref) => {
  const baseClasses = buttonVariants.default;
  const variantClasses = buttonVariants.variants[variant];
  const sizeClasses = buttonVariants.sizes[size];

  return (
    <motion.button
      ref={ref}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span>{children}</span>
        </div>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";