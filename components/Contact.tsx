'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DynamicAppointmentCalendar } from './dynamic-imports';

export default function Contact() {
  const [selectedType, setSelectedType] = useState<'onsite' | 'remote' | null>(null);

  const handleTypeSelect = (type: 'onsite' | 'remote') => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20">
      {/* Subtle dark overlay for better readability - extended beyond boundaries */}
      <div className="absolute inset-0 -top-16 bg-black/10 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      
      {/* Seamless transition from Services section */}
      <div className="h-8 sm:h-12 lg:h-16 bg-gradient-to-t from-transparent to-transparent relative z-10"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36">
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20 space-y-8"
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
            {selectedType === null ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                    Kies uw type afspraak
                  </h3>
                  <p className="text-gray-300">
                    Selecteer het type computerhulp dat u nodig heeft
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Onsite Option */}
                  <motion.button
                    onClick={() => handleTypeSelect('onsite')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-left hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#00d4ff]/20 rounded-lg flex items-center justify-center text-2xl">
                        🏠
                      </div>
                      <h4 className="text-xl font-semibold text-white">Aan huis bezoek</h4>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Wij komen bij u langs voor persoonlijke computerhulp aan huis.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Persoonlijke begeleiding</li>
                      <li>• Directe hulp ter plaatse</li>
                      <li>• €50/uur + reiskosten</li>
                    </ul>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[#00d4ff] font-semibold">€50/uur</span>
                      <span className="text-white/60 group-hover:text-white transition-colors">
                        Kies deze optie →
                      </span>
                    </div>
                  </motion.button>

                  {/* Remote Option */}
                  <motion.button
                    onClick={() => handleTypeSelect('remote')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-left hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#00d4ff]/20 rounded-lg flex items-center justify-center text-2xl">
                        💻
                      </div>
                      <h4 className="text-xl font-semibold text-white">Remote hulp</h4>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Computerhulp op afstand via een veilige verbinding.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Hulp op afstand</li>
                      <li>• Geen reiskosten</li>
                      <li>• €50/uur</li>
                    </ul>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[#00d4ff] font-semibold">€50/uur</span>
                      <span className="text-white/60 group-hover:text-white transition-colors">
                        Kies deze optie →
                      </span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    ← Terug naar opties
                  </button>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedType === 'onsite' ? '🏠 Aan huis bezoek' : '💻 Remote hulp'}
                    </h3>
                  </div>
                </div>
                <DynamicAppointmentCalendar appointmentType={selectedType} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
  