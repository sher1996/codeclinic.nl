'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DynamicAppointmentCalendar } from './dynamic-imports';

export default function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/20 via-[#2B3CA0]/10 to-[#4F4F00]/10">
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="relative container mx-auto px-4 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Plan een afspraak</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
  