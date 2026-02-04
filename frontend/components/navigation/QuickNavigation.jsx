"use client";

import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';

export default function QuickNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: 'home', 
      description: 'Landing page' 
    },
    { 
      path: '/overview', 
      label: 'Overview', 
      icon: 'bar-chart-3', 
      description: 'Dashboard overview',
      badge: 'New'
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: 'trending-up', 
      description: 'Performance metrics',
      badge: 'AI'
    },
    { 
      path: '/insights', 
      label: 'Insights', 
      icon: 'brain', 
      description: 'AI-powered insights',
      badge: 'Smart'
    },
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: 'monitor', 
      description: 'Main dashboard' 
    },
    { 
      path: '/create-ai', 
      label: 'Create', 
      icon: 'sparkles', 
      description: 'AI content creation' 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-3 shadow-2xl">
        <div className="flex items-center space-x-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? "text-white" : "text-current"}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                  
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'New' ? 'success' : item.badge === 'AI' ? 'primary' : 'warning'} 
                      size="sm"
                      className="absolute -top-1 -right-1 text-xs px-1 py-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  whileHover={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 text-white text-xs rounded-lg shadow-xl border border-blue-500/30 whitespace-nowrap pointer-events-none"
                >
                  {item.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95" />
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}