"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export default function LinkedInSuperstarsStep({ userData, updateUserData, nextStep }) {
  const [superstars, setSuperstars] = useState([]);
  const [selectedSuperstars, setSelectedSuperstars] = useState(userData.selectedSuperstars || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch real LinkedIn superstars from backend API
    const fetchSuperstars = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/onboarding/linkedin-superstars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            selectedTopics: userData.selectedTopics || [] 
          })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setSuperstars(data.data.superstars);
          
          // Show success message with count
          console.log(`Loaded ${data.data.superstars.length} LinkedIn superstars based on topics:`, data.data.basedOnTopics);
        } else {
          setError(data.error || 'Failed to load LinkedIn superstars');
          console.error('API Error:', data.error);
        }
      } catch (error) {
        console.error('Network Error fetching superstars:', error);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuperstars();
  }, [userData.selectedTopics]);

  const toggleSuperstar = (superstarId) => {
    setSelectedSuperstars(prev => {
      if (prev.includes(superstarId)) {
        return prev.filter(id => id !== superstarId);
      } else {
        return [...prev, superstarId];
      }
    });
  };

  const openLinkedInProfile = (url) => {
    // Open real LinkedIn profile in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContinue = () => {
    updateUserData({ selectedSuperstars });
    nextStep();
  };

  const handleRetry = () => {
    // Retry fetching data
    const fetchSuperstars = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/onboarding/linkedin-superstars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            selectedTopics: userData.selectedTopics || [] 
          })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setSuperstars(data.data.superstars);
        } else {
          setError(data.error || 'Failed to load LinkedIn superstars');
        }
      } catch (error) {
        setError('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuperstars();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="star" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Discovering Your LinkedIn Superstars
        </h2>
        <p className="text-gray-300 text-lg">
          Discover top LinkedIn influencers based on your selected topics
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
            className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
          />
          <h3 className="text-xl font-semibold text-white mb-2">
            Fetching Real LinkedIn Data...
          </h3>
          <p className="text-gray-400">
            Loading authentic profiles from LinkedIn based on your interests
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
            Failed to Load LinkedIn Data
          </h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <motion.button
            onClick={handleRetry}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="refresh-cw" size={16} />
            <span>Retry</span>
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Real LinkedIn Data Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {superstars.map((superstar, index) => (
              <motion.div
                key={superstar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all ${
                  selectedSuperstars.includes(superstar.id)
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {/* Real Profile Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {/* Real Profile Picture or Initials */}
                      {superstar.profilePicture && superstar.profilePicture !== 'https://media.licdn.com/dms/image/example' ? (
                        <img 
                          src={superstar.profilePicture} 
                          alt={superstar.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ display: superstar.profilePicture && superstar.profilePicture !== 'https://media.licdn.com/dms/image/example' ? 'none' : 'flex' }}
                      >
                        {superstar.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Verified Badge */}
                      {superstar.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-800">
                          <Icon name="check" size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg leading-tight">
                        {superstar.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {superstar.title}
                      </p>
                      {superstar.location && (
                        <p className="text-gray-500 text-xs mt-1 flex items-center">
                          <Icon name="map-pin" size={10} className="mr-1" />
                          {superstar.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => toggleSuperstar(superstar.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedSuperstars.includes(superstar.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600 hover:border-blue-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedSuperstars.includes(superstar.id) && (
                      <Icon name="check" size={14} className="text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Real Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Icon name="users" size={14} />
                    <span>{superstar.followers} followers</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Icon name="briefcase" size={14} />
                    <span>{superstar.industry}</span>
                  </div>
                  {superstar.engagement && (
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <Icon name="trending-up" size={14} />
                      <span>{superstar.engagement}</span>
                    </div>
                  )}
                </div>

                {/* Real Recent Post Preview */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    "{superstar.recentPost}"
                  </p>
                </div>

                {/* Real LinkedIn Profile Button */}
                <motion.button
                  onClick={() => openLinkedInProfile(superstar.linkedinUrl)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 text-blue-300 rounded-xl font-medium hover:from-blue-600/30 hover:to-blue-700/30 transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon name="external-link" size={16} />
                  <span>View Real LinkedIn Profile</span>
                </motion.button>
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
              <Icon name="star" size={16} />
              <span>{selectedSuperstars.length} real LinkedIn superstars selected</span>
            </div>
            {superstars.length > 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Showing {superstars.length} authentic LinkedIn profiles based on your interests
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Continue to Industry Leaders</span>
              <Icon name="arrow-right" size={20} />
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
}