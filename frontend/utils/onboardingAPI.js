// API functions for onboarding process

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Save user onboarding data
export const saveOnboardingData = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to save onboarding data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    throw error;
  }
};

// Get user onboarding status
export const getOnboardingStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get onboarding status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    throw error;
  }
};

// Send email verification
export const sendEmailVerification = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Verify email token
export const verifyEmailToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/verify-email/${token}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to verify email token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying email token:', error);
    throw error;
  }
};

// Get LinkedIn profile data
export const getLinkedInProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/linkedin/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get LinkedIn profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting LinkedIn profile:', error);
    throw error;
  }
};

// Get AI recommendations based on profile
export const getAIRecommendations = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

// Generate personalized content strategy
export const generateContentStrategy = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/content-strategy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to generate content strategy');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating content strategy:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`${API_BASE_URL}/onboarding/upload-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Check if user needs onboarding
export const checkOnboardingRequired = () => {
  const isComplete = localStorage.getItem('socialrva_onboarding_complete');
  const userData = localStorage.getItem('socialrva_user_data');
  
  return !isComplete || !userData;
};

// Get saved user data
export const getSavedUserData = () => {
  try {
    const userData = localStorage.getItem('socialrva_user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting saved user data:', error);
    return null;
  }
};

// Clear onboarding data (for testing)
export const clearOnboardingData = () => {
  localStorage.removeItem('socialrva_onboarding_complete');
  localStorage.removeItem('socialrva_user_data');
};