"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        // Public routes that don't need authentication
        const publicRoutes = ['/', '/auth/callback', '/auth/login', '/auth/page', '/auth/error'];
        if (publicRoutes.includes(pathname)) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Check if user is authenticated
        if (!token || !userStr) {
          router.push('/');
          return;
        }

        const user = JSON.parse(userStr);

        // Onboarding bypassed - direct dashboard access
        // If user lands on /onboarding, redirect to dashboard
        if (pathname === '/onboarding') {
          router.push('/dashboard');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Route guard error:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="shield-x" size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
}