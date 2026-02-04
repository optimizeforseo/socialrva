"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '../../../components/ui/Icon';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Authenticating with LinkedIn...');
  const [userType, setUserType] = useState(null); // new, existing

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          throw new Error(`LinkedIn OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Verify state parameter for CSRF protection (optional for development)
        const storedState = localStorage.getItem('linkedin_oauth_state');
        if (storedState && state && state !== storedState) {
          console.warn('State parameter mismatch - this could be a CSRF attack');
          // In development, we'll continue but log the warning
          // In production, you should throw an error here
        }

        // Clean up stored state
        localStorage.removeItem('linkedin_oauth_state');

        setMessage('Exchanging authorization code...');

        // Get API base URL
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        // Exchange code for access token and user data
        const response = await fetch(`${apiBaseUrl}/auth/linkedin/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          let errorMessage = 'Authentication failed';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // If response is not JSON, use status text
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Check if response has expected structure
        if (!data.success || !data.data) {
          throw new Error('Invalid response from server');
        }

        console.log('LinkedIn Auth Response:', {
          routing: data.data.routing,
          isOnboardingComplete: data.data.user.profile?.isOnboardingComplete,
          userId: data.data.user.id
        });
        
        // Store authentication data in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Trigger a storage event to update AuthContext
        window.dispatchEvent(new Event('storage'));

        // Use backend routing hints for smart navigation
        const routing = data.data.routing;
        const isOnboardingComplete = data.data.user.profile?.isOnboardingComplete;
        
        setUserType(isOnboardingComplete ? 'existing' : 'new');
        setStatus('success');

        if (routing.shouldOnboard) {
          // User needs onboarding (new or incomplete)
          setMessage(routing.isNewUser 
            ? 'Welcome! Setting up your personalized experience...' 
            : 'Welcome back! Let\'s complete your setup...');
          setTimeout(() => {
            console.log('Redirecting to:', routing.redirectTo);
            router.push(routing.redirectTo);
          }, 1500);
        } else {
          // User already onboarded, go to dashboard
          setMessage('Welcome back! Redirecting to your dashboard...');
          setTimeout(() => {
            console.log('Redirecting to:', routing.redirectTo);
            router.push(routing.redirectTo);
          }, 1500);
        }

      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
        
        // Redirect to home page after error
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <img 
            src="/socialrva-logo-full.png" 
            alt="SocialRva" 
            className="h-16 object-contain mx-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          {status === 'processing' && (
            <div className="w-16 h-16 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
              />
            </div>
          )}
          
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto"
            >
              <Icon name="check" size={32} className="text-white" />
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto"
            >
              <Icon name="x" size={32} className="text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && userType === 'new' && 'Welcome to SocialRva!'}
            {status === 'success' && userType === 'existing' && 'Welcome Back!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          <p className="text-gray-300">{message}</p>
        </motion.div>

        {/* User Type Indicator */}
        {status === 'success' && userType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm"
          >
            <Icon 
              name={userType === 'new' ? 'user-plus' : 'user-check'} 
              size={16} 
              className="mr-2" 
            />
            {userType === 'new' ? 'New User - Starting Onboarding' : 'Existing User - Going to Dashboard'}
          </motion.div>
        )}

        {/* Progress Dots */}
        {status === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
            ))}
          </motion.div>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <motion.button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}