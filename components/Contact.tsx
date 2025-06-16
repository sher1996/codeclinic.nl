'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AppointmentCalendar from './AppointmentCalendar';

export default function Contact() {
  return (
    <section id="contact" className="relative pt-0 pb-20 overflow-hidden">
      <div className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/30 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px'
        }} aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-transparent to-transparent opacity-60 mix-blend-soft-light pointer-events-none" />

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
            <AppointmentCalendar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
  