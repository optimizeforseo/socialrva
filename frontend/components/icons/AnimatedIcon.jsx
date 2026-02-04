"use client";

import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export default function AnimatedIcon({ 
  name, 
  animation = "bounce",
  size = 24,
  className,
  ...props 
}) {
  const animations = {
    bounce: {
      animate: { y: [0, -10, 0] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    spin: {
      animate: { rotate: 360 },
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    },
    pulse: {
      animate: { scale: [1, 1.2, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    float: {
      animate: { y: [0, -8, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    glow: {
      animate: { 
        filter: [
          "drop-shadow(0 0 0px rgba(147, 51, 234, 0.5))",
          "drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))",
          "drop-shadow(0 0 0px rgba(147, 51, 234, 0.5))"
        ]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    wiggle: {
      animate: { rotate: [0, 10, -10, 0] },
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
    }
  };

  const animationProps = animations[animation] || animations.bounce;

  return (
    <motion.div
      className={className}
      {...animationProps}
      {...props}
    >
      <Icon name={name} size={size} />
    </motion.div>
  );
}