'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle } from 'lucide-react';

const faqs = [
  {
    question: "Wat betekent 'Niet opgelost = geen kosten'?",
    answer: "Als wij uw computerprobleem niet kunnen oplossen, betaalt u niets. Deze garantie geldt voor alle onze diensten en geeft u volledige gemoedsrust. Uitzonderingen zijn hardware vervanging, software licenties, en problemen veroorzaakt door externe factoren zoals internetstoringen of elektriciteitsproblemen.",
    highlight: true
  },
  {
    question: "Hoe werkt remote computerhulp?",
    answer: "Remote hulp werkt via een veilig programma (TeamViewer) dat u downloadt. Onze expert maakt dan verbinding met uw computer en lost het probleem op afstand op. U kunt alles zien wat er gebeurt en kunt de verbinding op elk moment verbreken."
  },
  {
    question: "Wat kost computerhulp?",
    answer: "Onze diensten beginnen vanaf €35. Remote hulp kost €44 per uur, aan huis service €50 per uur, en service bundles hebben vaste prijzen (Virus & Malware Scan €99, Computer Tune-up €79). Alle prijzen zijn inclusief btw."
  },
  {
    question: "Komen jullie ook aan huis?",
    answer: "Ja, we bieden zowel remote hulp als aan huis service. Voor aan huis service maken we een afspraak en komen we bij u langs. We werken in heel Nederland, met voorrijkosten vanaf €0,25/km buiten Rotterdam."
  },
  {
    question: "Is mijn computer veilig tijdens remote hulp?",
    answer: "Ja, TeamViewer is een zeer veilig programma dat wereldwijd wordt gebruikt. U kunt de verbinding op elk moment verbreken en u ziet alles wat er gebeurt. We hebben geen toegang tot uw wachtwoorden of persoonlijke bestanden."
  },
  {
    question: "Wat als ik niet tevreden ben?",
    answer: "Onze 'Niet opgelost = geen kosten' garantie betekent dat u alleen betaalt als we uw probleem daadwerkelijk oplossen. Als u niet tevreden bent, betalen we het geld terug."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Start with guarantee open

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-28 lg:py-36">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#FFFFFF] mb-8">
            Veelgestelde Vragen
          </h2>
          <p className="text-lg sm:text-xl text-[#D8E0FF] max-w-3xl mx-auto">
            Antwoorden op de meest gestelde vragen over onze diensten
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden ${
                faq.highlight ? 'border-[#00d4ff]/40 bg-[#00d4ff]/5' : ''
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-center gap-3">
                  {faq.highlight && (
                    <CheckCircle className="w-5 h-5 text-[#00d4ff] flex-shrink-0" />
                  )}
                  <h3 className={`text-lg font-semibold ${faq.highlight ? 'text-[#00d4ff]' : 'text-white'}`}>
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-white transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    id={`faq-answer-${index}`}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-[#D8E0FF] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-[#D8E0FF] mb-6">
            Heeft u nog andere vragen?
          </p>
          <a 
            href="tel:+31624837889" 
            className="inline-flex items-center gap-2 bg-[#00d4ff] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00b8e6] transition-colors"
          >
            Bel ons direct: 0624837889
          </a>
        </motion.div>
      </div>
    </section>
  );
} 