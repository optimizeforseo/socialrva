"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const d = params.get('d');
      if (!d) throw new Error('No data');

      const { user, token } = JSON.parse(atob(d));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('linkedin_oauth_state');
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save auth data:', e);
    }
    // Always redirect to dashboard
    router.replace('/dashboard');
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
      />
    </div>
  );
}
