"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/Icon';

const LINKEDIN_TOPICS = [
  { id: 'technology', name: 'Technology', icon: 'cpu', color: 'from-blue-500 to-blue-600', description: 'AI, Software, Innovation' },
  { id: 'business', name: 'Business Strategy', icon: 'briefcase', color: 'from-green-500 to-green-600', description: 'Leadership, Growth, Strategy' },
  { id: 'marketing', name: 'Digital Marketing', icon: 'trending-up', color: 'from-purple-500 to-purple-600', description: 'Social Media, Branding, Analytics' },
  { id: 'finance', name: 'Finance & Investment', icon: 'dollar-sign', color: 'from-yellow-500 to-yellow-600', description: 'Markets, Investment, Economics' },
  { id: 'healthcare', name: 'Healthcare', icon: 'heart', color: 'from-red-500 to-red-600', description: 'Medical, Wellness, Innovation' },
  { id: 'education', name: 'Education & Training', icon: 'book-open', color: 'from-indigo-500 to-indigo-600', description: 'Learning, Development, Skills' },
  { id: 'sales', name: 'Sales & CRM', icon: 'target', color: 'from-orange-500 to-orange-600', description: 'Sales Strategy, Customer Relations' },
  { id: 'hr', name: 'Human Resources', icon: 'users', color: 'from-pink-500 to-pink-600', description: 'Talent, Culture, Recruitment' },
  { id: 'consulting', name: 'Consulting', icon: 'lightbulb', color: 'from-teal-500 to-teal-600', description: 'Advisory, Solutions, Expertise' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: 'rocket', color: 'from-violet-500 to-violet-600', description: 'Startups, Innovation, Ventures' },
  { id: 'data-science', name: 'Data Science', icon: 'bar-chart', color: 'from-cyan-500 to-cyan-600', description: 'Analytics, ML, Big Data' },
  { id: 'design', name: 'Design & UX', icon: 'palette', color: 'from-rose-500 to-rose-600', description: 'UI/UX, Creative, Visual Design' }
];

export default function LinkedInTopicsStep({ userData, updateUserData, nextStep }) {
  const [selectedTopics, setSelectedTopics] = useState(userData.selectedTopics || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState(LINKEDIN_TOPICS);

  useEffect(() => {
    const filtered = LINKEDIN_TOPICS.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTopics(filtered);
  }, [searchQuery]);

  const toggleTopic = (topicId) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedTopics.length === 0) return;
    
    setIsLoading(true);
    updateUserData({ selectedTopics });
    
    // Simulate API call to fetch LinkedIn data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    nextStep();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="linkedin" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Finding Relevant Topics
        </h2>
        <p className="text-gray-300 text-lg">
          Select LinkedIn topics that match your interests
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="relative max-w-md mx-auto">
          <Icon name="search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Topics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <AnimatePresence>
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer ${
                selectedTopics.includes(topic.id)
                  ? 'border-blue-500 bg-blue-600/20'
                  : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-10`} />
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center`}>
                    <Icon name={topic.icon} size={24} className="text-white" />
                  </div>
                  
                  {selectedTopics.includes(topic.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <Icon name="check" size={14} className="text-white" />
                    </motion.div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {topic.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {topic.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Selected Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-gray-300">
          <Icon name="check-circle" size={16} />
          <span>{selectedTopics.length} topics selected</span>
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <motion.button
          onClick={handleContinue}
          disabled={selectedTopics.length === 0 || isLoading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          whileHover={selectedTopics.length > 0 ? { scale: 1.05 } : {}}
          whileTap={selectedTopics.length > 0 ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              <span>Finding LinkedIn Data...</span>
            </>
          ) : (
            <>
              <span>Continue to Superstars</span>
              <Icon name="arrow-right" size={20} />
            </>
          )}
        </motion.button>
        
        {selectedTopics.length === 0 && (
          <p className="text-sm text-gray-400 mt-2">
            Please select at least one topic to continue
          </p>
        )}
      </motion.div>
    </div>
  );
}