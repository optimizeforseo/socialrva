"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Authenticating with LinkedIn...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) throw new Error(`LinkedIn OAuth error: ${error}`);
        if (!code) throw new Error('No authorization code received');

        setMessage('Exchanging authorization code...');

        // Use backend which has LinkedIn credentials and handles full OAuth flow
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
        const res = await fetch(`${apiBaseUrl}/auth/linkedin/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Authentication failed');
        }

        const data = await res.json();

        if (!data.success || !data.data?.user) {
          throw new Error('Invalid response from server');
        }

        setMessage('Setting up your account...');

        const { user, token } = data.data;

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          ...user,
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          profile: { isOnboardingComplete: true },
        }));
        localStorage.removeItem('linkedin_oauth_state');
        window.dispatchEvent(new Event('storage'));

        setStatus('success');
        setMessage('Welcome! Redirecting to your dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);

      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
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
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <img src="/socialrva-logo-full.png" alt="SocialRva" className="h-16 object-contain mx-auto drop-shadow-2xl" />
        </motion.div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="mb-6">
          {status === 'processing' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto"
            />
          )}
          {status === 'success' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Welcome to SocialRva!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          <p className="text-gray-300">{message}</p>
        </motion.div>

        {status === 'processing' && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6">
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
