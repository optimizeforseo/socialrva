"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";

export default function LinkedInAnalytics() {
  const [animatedValues, setAnimatedValues] = useState({
    connections: 0,
    posts: 0,
    engagement: 0,
  });

  // Animate numbers on component mount
  useEffect(() => {
    const targets = {
      connections: 1247,
      posts: 24,
      engagement: 89.5,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        connections: Math.floor(targets.connections * progress),
        posts: Math.floor(targets.posts * progress),
        engagement: Math.floor(targets.engagement * progress * 10) / 10,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg"
          >
            <Icon name="trending-up" size={20} className="text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">LinkedIn Analytics</h3>
            <Badge variant="success" size="sm" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Icon name="activity" size={10} className="mr-1" />
              Live Data
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Track your social media growth with AI insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Connections */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-blue-500/20"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="users" size={16} className="text-white" />
          </div>
          <motion.p
            className="text-lg font-bold text-white"
            key={animatedValues.connections}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {animatedValues.connections.toLocaleString()}
          </motion.p>
          <p className="text-xs text-gray-400">Connections</p>
        </motion.div>

        {/* Posts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-blue-500/20"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="edit-3" size={16} className="text-white" />
          </div>
          <motion.p
            className="text-lg font-bold text-white"
            key={animatedValues.posts}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {animatedValues.posts}
          </motion.p>
          <p className="text-xs text-gray-400">Posts</p>
        </motion.div>

        {/* Engagement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-blue-500/20"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="zap" size={16} className="text-white" />
          </div>
          <motion.p
            className="text-lg font-bold text-white"
            key={animatedValues.engagement}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {animatedValues.engagement}%
          </motion.p>
          <p className="text-xs text-gray-400">Engagement</p>
        </motion.div>
      </div>

      {/* Growth Chart Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-blue-500/20 p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white flex items-center">
            <Icon name="bar-chart-3" size={16} className="mr-2 text-blue-400" />
            Weekly Growth
          </h4>
          <Badge variant="success" size="sm">
            <Icon name="trending-up" size={10} className="mr-1" />
            +12.5%
          </Badge>
        </div>

        {/* Mini Chart */}
        <div className="flex items-end space-x-1 h-12 mb-2">
          {[65, 78, 82, 95, 88, 92, 98].map((value, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
              style={{ height: `${(value / 100) * 100}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${(value / 100) * 100}%` }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs backdrop-blur-sm">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-blue-400 rounded-full mr-2"
          />
          AI-powered real-time insights
        </div>
      </motion.div>
    </motion.div>
  );
}