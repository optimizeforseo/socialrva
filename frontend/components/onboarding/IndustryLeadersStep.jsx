"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export default function IndustryLeadersStep({ userData, updateUserData, nextStep }) {
  const [leaders, setLeaders] = useState([]);
  const [selectedLeaders, setSelectedLeaders] = useState(userData.selectedLeaders || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch real industry leaders from backend API
    const fetchLeaders = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/onboarding/industry-leaders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            selectedTopics: userData.selectedTopics || [],
            selectedSuperstars: userData.selectedSuperstars || []
          })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setLeaders(data.data.leaders);
          
          // Show success message with count
          console.log(`Loaded ${data.data.leaders.length} industry leaders based on topics:`, data.data.basedOnTopics);
        } else {
          setError(data.error || 'Failed to load industry leaders');
          console.error('API Error:', data.error);
        }
      } catch (error) {
        console.error('Network Error fetching leaders:', error);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaders();
  }, [userData.selectedTopics, userData.selectedSuperstars]);

  const toggleLeader = (leaderId) => {
    setSelectedLeaders(prev => {
      if (prev.includes(leaderId)) {
        return prev.filter(id => id !== leaderId);
      } else {
        return [...prev, leaderId];
      }
    });
  };

  const openLinkedInProfile = (url) => {
    // Open real LinkedIn profile in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContinue = () => {
    updateUserData({ selectedLeaders });
    nextStep();
  };

  const handleRetry = () => {
    // Retry fetching data
    const fetchLeaders = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/onboarding/industry-leaders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            selectedTopics: userData.selectedTopics || [],
            selectedSuperstars: userData.selectedSuperstars || []
          })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setLeaders(data.data.leaders);
        } else {
          setError(data.error || 'Failed to load industry leaders');
        }
      } catch (error) {
        setError('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaders();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="crown" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Discover Industry Thought Leaders
        </h2>
        <p className="text-gray-300 text-lg">
          Follow real top industry leaders in your field for inspiration
        </p>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-6"
          />
          <h3 className="text-xl font-semibold text-white mb-2">
            Fetching Real Industry Leaders...
          </h3>
          <p className="text-gray-400">
            Loading authentic industry leaders from LinkedIn based on your interests
          </p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="alert-circle" size={32} className="text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Failed to Load Industry Leaders
          </h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <motion.button
            onClick={handleRetry}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="refresh-cw" size={16} />
            <span>Retry</span>
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Real Industry Leaders Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all ${
                  selectedLeaders.includes(leader.id)
                    ? 'border-purple-500 bg-purple-600/10'
                    : 'border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {/* Real Profile Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {/* Real Profile Picture or Initials */}
                      {leader.profilePicture && leader.profilePicture !== 'https://media.licdn.com/dms/image/example' ? (
                        <img 
                          src={leader.profilePicture} 
                          alt={leader.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ display: leader.profilePicture && leader.profilePicture !== 'https://media.licdn.com/dms/image/example' ? 'none' : 'flex' }}
                      >
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Verified Badge */}
                      {leader.verified && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center border-2 border-slate-800">
                          <Icon name="check" size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-xl leading-tight">
                        {leader.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-1">
                        {leader.title}
                      </p>
                      <p className="text-purple-400 text-sm font-medium mb-1">
                        {leader.company}
                      </p>
                      {leader.location && (
                        <p className="text-gray-500 text-xs flex items-center">
                          <Icon name="map-pin" size={10} className="mr-1" />
                          {leader.location}
                        </p>
                      )}
                      {leader.companySize && (
                        <p className="text-gray-500 text-xs flex items-center mt-1">
                          <Icon name="building" size={10} className="mr-1" />
                          {leader.companySize}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => toggleLeader(leader.id)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedLeaders.includes(leader.id)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-600 hover:border-purple-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedLeaders.includes(leader.id) && (
                      <Icon name="check" size={16} className="text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Real Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Icon name="users" size={14} />
                    <span>{leader.followers} followers</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Icon name="building" size={14} />
                    <span>{leader.industry}</span>
                  </div>
                  {leader.engagement && (
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <Icon name="trending-up" size={14} />
                      <span>{leader.engagement}</span>
                    </div>
                  )}
                </div>

                {/* Real Expertise Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {leader.expertise && leader.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Real Recent Post Preview */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    "{leader.recentPost}"
                  </p>
                </div>

                {/* Real Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => openLinkedInProfile(leader.linkedinUrl)}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 text-purple-300 rounded-xl font-medium hover:from-purple-600/30 hover:to-purple-700/30 transition-all flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name="external-link" size={14} />
                    <span>View Real Profile</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => toggleLeader(leader.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-1 ${
                      selectedLeaders.includes(leader.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name={selectedLeaders.includes(leader.id) ? "check" : "plus"} size={14} />
                    <span>{selectedLeaders.includes(leader.id) ? "Selected" : "Follow"}</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Selected Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-gray-300">
              <Icon name="crown" size={16} />
              <span>{selectedLeaders.length} real industry leaders selected</span>
            </div>
            {leaders.length > 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Showing {leaders.length} authentic industry leaders based on your interests
              </p>
            )}
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
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Generate Your First Post</span>
              <Icon name="arrow-right" size={20} />
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
}