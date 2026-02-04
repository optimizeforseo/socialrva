const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/onboarding/save
// @desc    Save LinkedIn-focused onboarding data
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    console.log('📥 Onboarding save request received');
    console.log('User ID:', req.user.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      email,
      emailVerified,
      language,
      country,
      selectedTopics,
      selectedSuperstars,
      selectedLeaders,
      selectedPostTopic,
      generatedPost,
      profileAnalysis
    } = req.body;

    // Validation
    if (!language || !country) {
      console.error('❌ Validation failed: Language and country are required');
      return res.status(400).json({
        success: false,
        error: 'Language and country are required'
      });
    }

    if (!selectedTopics || selectedTopics.length === 0) {
      console.error('❌ Validation failed: At least one topic is required');
      return res.status(400).json({
        success: false,
        error: 'Please select at least one topic'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('❌ User not found:', req.user.id);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('✅ User found:', user.email);

    // Update email if provided and different
    if (email && email !== user.email) {
      console.log('📧 Updating email from', user.email, 'to', email);
      user.email = email;
    }

    // Update profile
    user.profile = {
      ...user.profile,
      isOnboardingComplete: true,
      language: language || user.profile.language,
      country: country || user.profile.country,
      emailVerified: emailVerified !== undefined ? emailVerified : user.profile.emailVerified
    };

    // Update preferences (preserve existing values)
    user.preferences = {
      ...user.preferences,
      selectedTopics: selectedTopics || user.preferences.selectedTopics || [],
      selectedSuperstars: selectedSuperstars || user.preferences.selectedSuperstars || [],
      selectedLeaders: selectedLeaders || user.preferences.selectedLeaders || [],
      selectedPostTopic: selectedPostTopic || user.preferences.selectedPostTopic,
      generatedPost: generatedPost || user.preferences.generatedPost
    };

    // Save profile analysis
    if (profileAnalysis) {
      user.profileAnalysis = {
        profileScore: profileAnalysis.profileScore,
        strengths: profileAnalysis.strengths || [],
        improvements: profileAnalysis.improvements || [],
        insights: profileAnalysis.insights || [],
        recommendations: profileAnalysis.recommendations || [],
        analyzedAt: new Date()
      };
      console.log('📊 Profile analysis saved');
    }

    user.onboardingCompletedAt = new Date();

    console.log('💾 Saving user data to MongoDB...');
    console.log('   - Profile updated:', {
      isOnboardingComplete: user.profile.isOnboardingComplete,
      language: user.profile.language,
      country: user.profile.country
    });
    console.log('   - Preferences updated:', {
      topicsCount: user.preferences.selectedTopics.length,
      superstarsCount: user.preferences.selectedSuperstars.length,
      leadersCount: user.preferences.selectedLeaders.length
    });
    
    await user.save();
    console.log('✅ User data saved successfully to MongoDB');

    res.json({
      success: true,
      message: 'LinkedIn onboarding completed successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences,
          profileAnalysis: user.profileAnalysis,
          onboardingCompletedAt: user.onboardingCompletedAt
        }
      }
    });
  } catch (error) {
    console.error('❌ Error saving onboarding data:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save onboarding data',
      details: error.message
    });
  }
});

// @route   GET /api/onboarding/status
// @desc    Get user onboarding status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      isOnboardingComplete: user.profile?.isOnboardingComplete || false,
      onboardingCompletedAt: user.onboardingCompletedAt,
      profile: user.profile,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/onboarding/linkedin-topics
// @desc    Get LinkedIn topics based on user interests
// @access  Private
router.post('/linkedin-topics', protect, async (req, res) => {
  try {
    const linkedinTopics = [
      { id: 'technology', name: 'Technology', followers: '2.5M', trending: true },
      { id: 'business', name: 'Business Strategy', followers: '1.8M', trending: false },
      { id: 'marketing', name: 'Digital Marketing', followers: '3.2M', trending: true },
      { id: 'finance', name: 'Finance & Investment', followers: '1.5M', trending: false },
      { id: 'healthcare', name: 'Healthcare', followers: '900K', trending: true },
      { id: 'education', name: 'Education & Training', followers: '1.2M', trending: false }
    ];

    res.json({
      success: true,
      data: {
        topics: linkedinTopics,
        totalCount: linkedinTopics.length
      }
    });
  } catch (error) {
    console.error('Error fetching LinkedIn topics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch LinkedIn topics' 
    });
  }
});

module.exports = router;
