'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DynamicAppointmentCalendar } from './dynamic-imports';

export default function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20">
      {/* Subtle dark overlay for better readability - extended beyond boundaries */}
      <div className="absolute inset-0 -top-16 bg-black/10 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      
      {/* Seamless transition from Services section */}
      <div className="h-8 sm:h-12 lg:h-16 bg-gradient-to-t from-transparent to-transparent relative z-10"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Plan een afspraak</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Heeft u een vraag of wilt u een afspraak maken? Neem gerust contact met ons op.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <DynamicAppointmentCalendar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
  