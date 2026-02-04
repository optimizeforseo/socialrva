"use client";

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ 
  className, 
  type = "text", 
  variant = "outline",
  size = "md",
  leftIcon,
  rightIcon,
  error,
  helper,
  label,
  ...props 
}, ref) => {
  const baseClasses = "w-full transition-all duration-200 focus:outline-none";
  
  const variantClasses = {
    outline: "bg-slate-800/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:bg-slate-800/80 backdrop-blur-sm",
    filled: "bg-slate-700/80 border border-transparent text-white placeholder:text-gray-400 focus:bg-slate-700 focus:border-purple-500",
    ghost: "bg-transparent border-b border-slate-600/50 text-white placeholder:text-gray-400 focus:border-purple-500 rounded-none",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm rounded-lg",
    md: "h-11 px-4 text-base rounded-xl", 
    lg: "h-13 px-5 text-lg rounded-xl",
  };

  const errorClasses = error ? "border-red-500 focus:border-red-500" : "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            errorClasses,
            className
          )}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 flex items-center space-x-1"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };