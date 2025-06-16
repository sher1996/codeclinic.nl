'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  delay?: number;
}

export default function ScrollAnimation({ children, delay = 0 }: ScrollAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
} 