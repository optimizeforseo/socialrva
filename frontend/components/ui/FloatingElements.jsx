"use client";

import { motion } from 'framer-motion';

export default function FloatingElements() {
  const elements = [
    { emoji: '🚀', size: 'text-4xl', delay: 0 },
    { emoji: '⚡', size: 'text-3xl', delay: 0.5 },
    { emoji: '💡', size: 'text-2xl', delay: 1 },
    { emoji: '🎯', size: 'text-3xl', delay: 1.5 },
    { emoji: '✨', size: 'text-2xl', delay: 2 },
    { emoji: '🔥', size: 'text-4xl', delay: 2.5 },
    { emoji: '💎', size: 'text-2xl', delay: 3 },
    { emoji: '🌟', size: 'text-3xl', delay: 3.5 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.size} opacity-20`}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0,
            scale: 0
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0, 1, 0.8, 1, 0],
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
}