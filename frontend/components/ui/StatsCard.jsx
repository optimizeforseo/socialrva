"use client";

import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon, 
  trend = [],
  className,
  ...props 
}) {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400", 
    neutral: "text-gray-400"
  };

  const changeIcons = {
    positive: "📈",
    negative: "📉",
    neutral: "➡️"
  };

  return (
    <motion.div
      className={cn(
        "relative p-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-lg border border-purple-500/30"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {icon}
              </motion.div>
            )}
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          {change && (
            <motion.div
              className={cn(
                "flex items-center space-x-1 text-sm font-medium",
                changeColors[changeType]
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span>{changeIcons[changeType]}</span>
              <span>{change}</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-3xl font-bold text-white mb-1">
            {typeof value === 'string' ? value : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {value.toLocaleString()}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Trend Line */}
        {trend.length > 0 && (
          <motion.div
            className="h-12 flex items-end space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {trend.map((point, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-gradient-to-t from-purple-500/30 to-blue-500/30 rounded-t-sm min-h-[4px]"
                style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                transition={{ 
                  delay: 0.5 + (index * 0.05),
                  duration: 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}