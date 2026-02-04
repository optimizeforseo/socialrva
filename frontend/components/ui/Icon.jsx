"use client";

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import * as Icons from '../icons';

const Icon = forwardRef(({ 
  name, 
  size = 20, 
  className, 
  animated = false,
  color = "currentColor",
  strokeWidth = 2,
  ...props 
}, ref) => {
  // Convert name to PascalCase for icon lookup
  const iconName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const IconComponent = Icons[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(Icons));
    return (
      <div 
        className={cn("inline-flex items-center justify-center text-gray-400", className)}
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  const iconProps = {
    ref,
    size,
    color,
    strokeWidth,
    className: cn("flex-shrink-0", className),
    ...props
  };

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <IconComponent {...iconProps} />
      </motion.div>
    );
  }

  return <IconComponent {...iconProps} />;
});

Icon.displayName = "Icon";

export { Icon };