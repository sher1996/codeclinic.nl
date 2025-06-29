import { Computer, Home, Zap, Shield, Wifi, Mail, Smartphone, Database, Lock, Video, CreditCard, Play, Image, Printer, RefreshCw, Accessibility, ChevronRight, ChevronDown, CheckCircle, Info } from 'lucide-react';
import { useState, lazy, Suspense, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import NextImage from 'next/image';
const PricingSchema = lazy(() => import('./PricingSchema'));

const categories = [
  { id: 'all', label: 'Alle diensten', shortLabel: 'Alle' },
  { id: 'security', label: 'Beveiliging', shortLabel: 'Beveiliging' },
  { id: 'productivity', label: 'Productiviteit', shortLabel: 'Productiviteit' },
  { id: 'hardware', label: 'Hardware', shortLabel: 'Hardware' },
  { id: 'software', label: 'Software', shortLabel: 'Software' }
];

const services = [
  { 
    key: 'virus', 
    title: 'Virus- & malware-verwijdering', 
    price: 'vanaf €49',
    icon: <Shield className="w-8 h-8 text-white" />,
    description: 'Veilig verwijderen van schadelijke programma\'s van uw computer',
    category: 'security'
  },
  { 
    key: 'opschonen', 
    title: 'Computer opschonen & versnellen', 
    price: 'vanaf €39',
    icon: <Zap className="w-8 h-8 text-white" />,
    description: 'Uw computer sneller en soepeler laten werken',
    category: 'hardware'
  },
  { 
    key: 'wifi', 
    title: 'Wifi- & netwerkoptimalisatie', 
    price: 'vanaf €45',
    icon: <Wifi className="w-8 h-8 text-white" />,
    description: 'Wifi sterker maken en internetverbinding verbeteren',
    category: 'hardware'
  },
  { 
    key: 'email', 
    title: 'E-mail & internet instellen', 
    price: 'vanaf €35',
    icon: <Mail className="w-8 h-8 text-white" />,
    description: 'E-mail en veilige internetinstellingen voor u regelen',
    category: 'software'
  },
  { 
    key: 'smartphone', 
    title: 'Smartphone/tablet uitleg', 
    price: 'vanaf €35',
    icon: <Smartphone className="w-8 h-8 text-white" />,
    description: 'Stap-voor-stap uitleg voor uw telefoon of tablet',
    category: 'hardware'
  },
  { 
    key: 'backup', 
    title: 'Back-up & bestanden herstellen', 
    price: 'vanaf €45',
    icon: <Database className="w-8 h-8 text-white" />,
    description: 'Automatisch opslaan van uw foto\'s en documenten',
    category: 'software'
  },
  { 
    key: 'wachtwoord', 
    title: 'Wachtwoorden & beveiliging', 
    price: 'vanaf €35',
    icon: <Lock className="w-8 h-8 text-white" />,
    description: 'Veilige wachtwoorden en accountbeveiliging instellen',
    category: 'security'
  },
  { 
    key: 'videobellen', 
    title: 'Videobellen & online contact', 
    price: 'vanaf €35',
    icon: <Video className="w-8 h-8 text-white" />,
    description: 'Apps installeren en uitleggen voor videobellen',
    category: 'productivity'
  },
  { 
    key: 'bankieren', 
    title: 'Online bankieren & betalingen', 
    price: 'vanaf €45',
    icon: <CreditCard className="w-8 h-8 text-white" />,
    description: 'Veilig internetbankieren instellen en uitleggen',
    category: 'security'
  },
  { 
    key: 'streaming', 
    title: 'Films kijken & muziek luisteren', 
    price: 'vanaf €35',
    icon: <Play className="w-8 h-8 text-white" />,
    description: 'Netflix, Spotify en andere diensten instellen',
    category: 'productivity'
  },
  { 
    key: 'foto', 
    title: 'Foto\'s & documenten ordenen', 
    price: 'vanaf €45',
    icon: <Image className="w-8 h-8 text-white" aria-label="Foto icoon" />,
    description: 'Foto\'s en documenten netjes organiseren',
    category: 'productivity'
  },
  { 
    key: 'printer', 
    title: 'Printer & scanner hulp', 
    price: 'vanaf €35',
    icon: <Printer className="w-8 h-8 text-white" />,
    description: 'Printer aansluiten en instellen',
    category: 'hardware'
  },
  { 
    key: 'updates', 
    title: 'Programma\'s bijwerken', 
    price: 'vanaf €35',
    icon: <RefreshCw className="w-8 h-8 text-white" />,
    description: 'Alle programma\'s veilig bijwerken',
    category: 'software'
  },
  { 
    key: 'toegankelijkheid', 
    title: 'Lettergrootte & contrast aanpassen', 
    price: 'vanaf €35',
    icon: <Accessibility className="w-8 h-8 text-white" />,
    description: 'Computer aanpassen voor betere leesbaarheid',
    category: 'software'
  }
];

function ServiceCard() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'remote': true,
    'aan-huis': true
  });

  const toggleCard = useCallback((key: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const serviceCards = useMemo(() => [
    {
      key: 'remote',
      title: 'Remote Hulp',
      tagline: 'Veilige hulp via internet – eenvoudig programma downloaden',
      icon: <Computer className="service-card-icon" />,
      steps: [
        'Maak een afspraak via de planner of telefonisch (0624837889)',
        'Download en start TeamViewer (link in bevestigingsmail)',
        'Wij maken verbinding en lossen uw probleem op',
        'Klaar! U betaalt alleen voor de werkelijk bestede tijd'
      ],
      teamviewerLogo: true,
      fallback: 'Komt het er niet van? Lukt downloaden of installeren niet, dan sturen we <strong>eenmalig</strong> een monteur langs (tegen een kleine toeslag).'
    },
    {
      key: 'aan-huis',
      title: 'Computerhulp aan huis',
      tagline: 'Persoonlijke hulp bij u thuis – geen gedoe met slepen',
      icon: <Home className="service-card-icon" />,
      steps: [
        'Maak een afspraak: kies dag en tijd in onze planner of telefonisch (0624837889)',
        'Bevestiging & telefonisch overleg: monteur belt 30 min voor aankomst',
        'Bezoek aan huis: probleem wordt ter plaatse opgelost',
        'Afronding & advies: duidelijke uitleg en vrijblijvende prijsopgave'
      ],
      teamviewerLogo: false,
      fallback: 'Kosten: vanaf €49 plus eventuele onderdelen die vervangen moeten worden'
    }
  ], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {serviceCards.map((card) => (
        <div 
          key={card.key} 
          className={`service-card transition-all duration-300 ease-in-out backdrop-blur-md border border-white/20 ${
            expandedCards[card.key] ? 'bg-white/15' : 'bg-white/10'
          }`}
        >
          <div className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {card.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-white/80">
                  {card.tagline}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4">
                <button
                  onClick={() => toggleCard(card.key)}
                  className="flex items-center justify-center"
                  aria-expanded={expandedCards[card.key]}
                  aria-label={`${expandedCards[card.key] ? 'Sluit' : 'Open'} ${card.title} sectie`}
                  style={{ minHeight: '48px', minWidth: '48px' }}
                >
                  <ChevronDown 
                    className={`w-6 h-6 text-white/80 transition-transform duration-300 ${
                      expandedCards[card.key] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedCards[card.key] ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-8 pb-8">
              <div className="h-px bg-white/20 mb-8" />
              <ol className="space-y-6">
                {card.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00b8e6]/20 flex items-center justify-center text-[#00b8e6] font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-grow">
                      <span className="text-white/80">{step}</span>
                      {/* Plan Appointment Button for first step of Remote Help */}
                      {card.key === 'remote' && index === 0 && (
                        <div className="mt-4">
                          <a 
                            href="#contact" 
                            className="inline-flex items-center gap-2 bg-[#00d4ff] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#00b8e6] transition-colors"
                            style={{ minHeight: '48px' }}
                          >
                            <span role="img" aria-label="Kalender icoon">📅</span>
                            Plan een Afspraak
                          </a>
                        </div>
                      )}
                      {/* Plan Appointment Button for first step of Aan Huis Service */}
                      {card.key === 'aan-huis' && index === 0 && (
                        <div className="mt-4">
                          <a 
                            href="#contact" 
                            className="inline-flex items-center gap-2 bg-[#00d4ff] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#00b8e6] transition-colors"
                            style={{ minHeight: '48px' }}
                          >
                            <span role="img" aria-label="Kalender icoon">📅</span>
                            Plan een Afspraak
                          </a>
                        </div>
                      )}
                      {/* TeamViewer logo for step 2 of Remote Help */}
                      {card.key === 'remote' && index === 1 && card.teamviewerLogo && (
                        <div className="mt-4">
                          {/* TeamViewer logo (generated at https://www.teamviewer.com) */}
                          <div style={{position: 'relative', width: '234px', height: '60px'}}>
                            <a href="https://www.teamviewer.com/link/?url=842558" style={{textDecoration: 'none'}}>
                              <NextImage 
                                src="https://static.teamviewer.com/resources/badges/teamviewer_badge_flat4.png" 
                                alt="Download TeamViewer Remote Control" 
                                title="Download TeamViewer Remote Control" 
                                width={234} 
                                height={60}
                                style={{ width: 'auto', height: 'auto' }}
                              />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              
              <p className="mt-8 text-white/60 text-sm" dangerouslySetInnerHTML={{ __html: card.fallback }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1); // 1 = normal, 1.2 = large, 1.4 = extra large

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 0.2, 1.6));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 0.2, 0.8));
  };

  const resetFontSize = () => {
    setFontSize(1);
  };

  // Apply font size to document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 16}px`;
  }, [fontSize]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 transition-all duration-300 ${
        isOpen ? 'p-4' : 'p-2'
      }`}>
        {isOpen && (
          <div className="mb-4 space-y-3">
            <div className="text-center">
              <p className="text-white text-sm font-medium mb-2">Tekstgrootte</p>
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={decreaseFontSize}
                  className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Tekst kleiner maken"
                  disabled={fontSize <= 0.8}
                >
                  <span className="text-lg font-bold">A-</span>
                </button>
                <button
                  onClick={resetFontSize}
                  className="bg-[#00d4ff] text-white px-3 py-2 rounded-lg hover:bg-[#00b8e6] transition-colors text-sm"
                  aria-label="Tekstgrootte resetten"
                >
                  Normaal
                </button>
                <button
                  onClick={increaseFontSize}
                  className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Tekst groter maken"
                  disabled={fontSize >= 1.6}
                >
                  <span className="text-lg font-bold">A+</span>
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs">
                Huidige grootte: {Math.round(fontSize * 100)}%
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors w-full"
          aria-label="Toegankelijkheidsmenu"
          aria-expanded={isOpen}
        >
          <Accessibility className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// Add guarantee tooltip component
function GuaranteeTooltip() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center gap-1 text-[#00d4ff] hover:text-[#00b8e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-[#0A1A4B] rounded"
        aria-label="Meer informatie over onze garantie"
      >
        <Info className="w-4 h-4" />
      </button>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-[#0A1A4B] border border-[#00d4ff]/30 rounded-lg p-4 shadow-xl z-50">
          <div className="text-sm text-white space-y-2">
            <h4 className="font-semibold text-[#00d4ff] flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Niet opgelost = geen kosten
            </h4>
            <p className="text-white/90">
              Als wij uw computerprobleem niet kunnen oplossen, betaalt u niets. 
              Deze garantie geldt voor alle onze diensten.
            </p>
            <div className="text-xs text-white/70 mt-2">
              <strong>Uitzonderingen:</strong> Hardware vervanging, software licenties, 
              en problemen veroorzaakt door externe factoren vallen buiten deze garantie.
            </div>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0A1A4B]"></div>
        </div>
      )}
    </div>
  );
}

// Add guarantee badge component
function GuaranteeBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full px-3 py-1 text-sm font-medium text-[#00d4ff]">
      <CheckCircle className="w-4 h-4" />
      <span>Niet opgelost = geen kosten</span>
      <GuaranteeTooltip />
    </div>
  );
}

interface ServicesProps {
  forceVisible?: boolean;
}

export default function Services({ forceVisible = false }: ServicesProps) {
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <div className={`relative isolate overflow-hidden ${isLowEnd ? 'bg-[#1F2C90]/20' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20'}`}>
      {/* Subtle dark overlay for better readability - extended beyond boundaries */}
      <div className="absolute inset-0 -bottom-16 bg-black/10 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      
      {/* Lazy load PricingSchema */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
        <PricingSchema />
      </Suspense>

      {/* Hulp Die Bij U Past Section */}
      <motion.section
        id="services"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative py-24 sm:py-28 lg:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-12 mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#FFFFFF]">
                  Hulp Die Bij U Past
                </h2>
                <p className="text-lg sm:text-xl text-[#D8E0FF] max-w-3xl mx-auto senior-description">
                  Kies de manier van hulp die het beste bij u past - op afstand of bij u thuis
                </p>
                {/* Location context for local SEO */}
                <div className="mt-6 sr-only">
                  <p className="text-lg text-[#00d4ff] font-semibold">
                    Wij bieden computerhulp in Rotterdam en omstreken
                  </p>
                  <p className="text-base text-[#D8E0FF]/80 mt-2">
                    Geen voorrijkosten in Rotterdam - directe hulp bij u thuis
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <ServiceCard />
          </div>
        </div>
      </motion.section>

      {/* Onze Diensten Section */}
      <motion.section
        id="diensten"
        initial={{ opacity: 0 }}
        animate={forceVisible ? { opacity: 1 } : {}}
        whileInView={forceVisible ? {} : { opacity: 1 }}
        exit={{ opacity: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative py-24 sm:py-28 lg:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-12 mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#FFFFFF]">
                  Onze Diensten
                </h2>
                <p className="text-lg sm:text-xl text-[#D8E0FF] max-w-3xl mx-auto senior-description">
                  Wij helpen u met alle computerproblemen - van virussen tot wifi problemen
                </p>
              </motion.div>
            </div>
          </div>

          {/* Filter Bar */}
          <div id="filter-bar" className="sticky top-0 z-50 py-8 -mx-4 px-4 sm:mx-0 sm:px-0 pointer-events-none mb-24">
            <div className="flex flex-wrap gap-4 justify-center pointer-events-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border border-white/20
                    ${activeCategory === category.id 
                      ? 'bg-white/20 text-white border-white/40' 
                      : isLowEnd ? 'bg-white/10 text-[#D8E0FF]' : 'bg-white/10 text-[#D8E0FF] hover:bg-white/20'}
                    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0A1A4B]
                  `}
                  aria-label={`Filter by ${category.label}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <AnimatePresence mode="sync">
              {filteredServices.map((service) => (
                <motion.div
                  key={service.key}
                  layout={false}
                  initial={isLowEnd || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: isLowEnd || prefersReducedMotion ? 0 : 0.2,
                    type: "tween"
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${service.title} - ${service.description}. Klik om meer informatie te zien.`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Trigger the same action as clicking
                      const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                      });
                      e.currentTarget.dispatchEvent(event);
                    }
                  }}
                  className={`
                    w-full max-w-[320px] mx-auto
                    ${isLowEnd ? 'bg-white/10' : 'bg-white/10'}
                    rounded-xl p-8
                    flex flex-col items-center text-center
                    cursor-pointer transition-all duration-300
                    border border-white/10 shadow-lg hover:border-white/20
                    pointer-events-auto
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400
                    active:scale-[0.98]
                    ${isLowEnd ? '' : 'hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]'}
                  `}
                  style={{ 
                    willChange: isLowEnd ? 'auto' : 'transform, opacity', 
                    transform: isLowEnd ? 'none' : 'translateZ(0)' 
                  }}
                >
                  <div className="flex flex-col items-center justify-between h-full w-full space-y-8">
                    <div className="flex flex-col items-center space-y-6">
                      <motion.div 
                        className="relative w-16 h-16 mb-2"
                        whileHover={isLowEnd ? {} : { scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        aria-hidden="true"
                        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                      >
                        <div className={`absolute inset-0 ${isLowEnd ? 'bg-[#00b8e6]/10' : 'bg-[#00b8e6]/10 blur-sm'} rounded-full group-hover:bg-[#00b8e6]/20 transition-colors duration-300`}></div>
                        <div className="relative w-full h-full flex items-center justify-center text-[#00b8e6] transition-colors duration-300">
                          {React.cloneElement(service.icon, { 
                            className: "w-10 h-10 stroke-[1.5]",
                            strokeWidth: 1.5
                          })}
                        </div>
                      </motion.div>
                      <h4 className="text-lg font-semibold text-white">{service.title}</h4>
                    </div>
                    <p className="text-sm text-[#E6EFFF] leading-relaxed senior-description">{service.description}</p>
                    
                    {/* Small guarantee indicator */}
                    <div className="flex items-center gap-1 text-xs text-[#00d4ff]/80">
                      <CheckCircle className="w-3 h-3" />
                      <span>Garantie inbegrepen</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Additional Info Bar */}
          <div className="mt-24">
            <div className={`relative ${isLowEnd ? 'bg-white/10' : 'bg-white/10'} rounded-xl border border-white/20 p-10 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-10`} style={{ minHeight: '120px' }}>
              <div className="flex items-center gap-8 sm:gap-10 w-full sm:w-auto">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-[#00b8e6]" />
                </div>
                <div className="text-center sm:text-left space-y-3">
                  <h3 className="text-xl font-semibold text-white">En nog veel meer</h3>
                  <p className="text-base text-white/80 senior-description">Persoonlijke hulp voor álles waar u problemen mee heeft!</p>
                </div>
              </div>
              <button className="bg-[#00b8e6] text-white font-medium px-6 py-3 rounded-full flex items-center gap-2 mt-4 sm:mt-0">
                Vraag maatwerk aan <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tarieven Section */}
      <section 
        id="tarieven" 
        className="relative py-24 sm:py-28 lg:py-36 pb-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-12 mb-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#FFFFFF]">
                  Transparante Tarieven
                </h2>
                <p className="text-lg sm:text-xl text-[#D8E0FF] max-w-3xl mx-auto senior-description">
                  Duidelijke prijzen zonder verrassingen - u betaalt alleen voor wat we doen
                </p>
              </motion.div>
            </div>
            
            {/* Prominent Guarantee Section */}
            <div className="col-span-1 md:col-span-12 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-[#00d4ff]/10 to-[#00b8e6]/10 border border-[#00d4ff]/30 rounded-2xl p-8 text-center"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center gap-3 text-[#00d4ff]">
                    <CheckCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Onze Garantie</h3>
                  </div>
                  <p className="text-xl text-white font-semibold">
                    Niet opgelost = geen kosten
                  </p>
                  <p className="text-[#D8E0FF] max-w-2xl">
                    Heeft u een computerprobleem dat wij niet kunnen oplossen? Dan betaalt u niets. 
                    Deze garantie geldt voor alle onze diensten en geeft u volledige gemoedsrust.
                  </p>
                  <GuaranteeTooltip />
                </div>
              </motion.div>
            </div>

            {/* Remote Support Pricing */}
            <motion.div 
              className="col-span-1 md:col-span-4 mb-8 md:mb-0"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-10 h-full flex flex-col justify-between w-full
                hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <div className="flex items-center gap-6 mb-6">
                  <motion.span 
                    className="text-4xl w-6 text-[#FFFFFF]" 
                    role="img" 
                    aria-label="Remote computer support"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >💻</motion.span>
                  <h4 className="text-2xl font-bold text-[#FFFFFF]">Remote Hulp</h4>
                </div>
                
                {/* Guarantee Badge - Prominent placement */}
                <div className="mb-6 flex justify-center">
                  <GuaranteeBadge />
                </div>
                
                <p className="text-[#FFFFFF]/80 mb-8">Klaar terwijl u kijkt</p>
                <div className="space-y-8 flex-grow">
                  <p className="text-3xl font-semibold text-[#FFFFFF]">€44 <span className="text-base">/uur</span></p>
                  <p className="text-[#FFFFFF]/80">Direct start, per-minuut facturering</p>
                  <p className="text-sm text-[#FFFFFF]/80">Daarna afrekening per minuut, geen minimum.</p>
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                      <span className="text-2xl text-[#FFFFFF]/80" role="img" aria-label="Bliksem icoon voor direct start">⚡</span>
                      <span className="text-[#FFFFFF]/80">Direct start, betalen per minuut</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-2xl text-[#FFFFFF]/80" role="img" aria-label="Creditcard icoon voor iDEAL betaling">💳</span>
                      <span className="text-[#FFFFFF]/80">iDEAL betaling</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-2xl text-[#FFFFFF]/80" role="img" aria-label="Klok icoon voor snelle verbinding">⏰</span>
                      <span className="text-[#FFFFFF]/80">Meestal binnen 5 min verbonden</span>
                    </li>
                  </ul>
                </div>
                <a href="#boek" className="mt-10 bg-[#00d4ff] text-[#FFFFFF] font-bold px-8 py-4 rounded-lg text-center hover:brightness-110 transition-colors flex items-center justify-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4ff] hover:bg-[#00b8e6]" data-analytics="pricing_button_remote">
                  Start direct <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Bundles Pricing */}
            <motion.div 
              className="col-span-1 md:col-span-4 mb-8 md:mb-0"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
            >
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-10 h-full flex flex-col justify-between w-full
                hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <div className="flex items-center gap-6 mb-6">
                  <motion.span 
                    className="text-4xl w-6 text-[#FFFFFF]" 
                    role="img" 
                    aria-label="Service bundles"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >🛠️</motion.span>
                  <h4 className="text-2xl font-bold text-[#FFFFFF]">Service Bundles</h4>
                </div>
                
                {/* Guarantee Badge - Prominent placement */}
                <div className="mb-6 flex justify-center">
                  <GuaranteeBadge />
                </div>
                
                <p className="text-[#FFFFFF]/80 mb-8">Vaste prijs, geen verrassingen</p>
                <div className="space-y-8 flex-grow">
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                      <span className="text-2xl text-[#FFFFFF]/80" role="img" aria-label="Vinkje icoon voor virus scan">✅</span>
                      <span className="text-[#FFFFFF]/80"><strong className="text-[#FFFFFF]">Virus & Malware Scan</strong> — €99</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-2xl text-[#FFFFFF]/80" role="img" aria-label="Vinkje icoon voor computer tune-up">✅</span>
                      <span className="text-[#FFFFFF]/80"><strong className="text-[#FFFFFF]">Computer Tune-up</strong> — €79</span>
                    </li>
                  </ul>
                </div>
                <a href="#boek" className="mt-10 bg-[#00d4ff] text-[#FFFFFF] font-bold px-8 py-4 rounded-lg text-center hover:brightness-110 transition-colors flex items-center justify-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4ff] hover:bg-[#00b8e6]" data-analytics="pricing_button_bundle">
                  Boek bundle <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* On-Site Support Pricing */}
            <motion.div 
              className="col-span-1 md:col-span-4"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
            >
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-10 h-full flex flex-col justify-between w-full
                hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <div className="flex items-center gap-6 mb-6">
                  <motion.span 
                    className="text-4xl w-6 text-[#FFFFFF]" 
                    role="img" 
                    aria-label="On-site computer support"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >🏠</motion.span>
                  <h4 className="text-2xl font-bold text-[#FFFFFF]">Computerhulp aan huis</h4>
                </div>
                
                {/* Guarantee Badge - Prominent placement */}
                <div className="mb-6 flex justify-center">
                  <GuaranteeBadge />
                </div>
                
                <p className="text-[#FFFFFF]/80 mb-8">Geen voorrijkosten in Rotterdam</p>
                <div className="space-y-8 flex-grow">
                  <p className="text-3xl font-semibold text-[#FFFFFF]">€50 <span className="text-base">/uur</span></p>
                  <p className="text-[#FFFFFF]/80">≤ 10 km vanaf Rotterdam-centrum, daarna €0,25/km</p>
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                      <span className="text-2xl text-[#FFFFFF]/80" role="img" aria-label="Creditcard icoon voor betalingsmethoden">💳</span>
                      <span className="text-[#FFFFFF]/80">iDEAL, contant of pin</span>
                    </li>
                  </ul>
                </div>
                <a href="#boek" className="mt-10 bg-[#00d4ff] text-[#FFFFFF] font-bold px-8 py-4 rounded-lg text-center hover:brightness-110 transition-colors flex items-center justify-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4ff] hover:bg-[#00b8e6]" data-analytics="pricing_button_onsite">
                  Plan bezoek <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* VAT Notice */}
            <div className="col-span-1 md:col-span-12 mt-6 flex justify-center items-center">
              <div className="text-center">
                <p className="text-sm opacity-80">
                  Alle bedragen incl. 21% btw.
                </p>
                <p className="text-sm opacity-80 mt-1">
                  <a href="/terms" className="text-[#00d4ff] hover:underline">Zie voorwaarden voor details</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless transition to Contact section */}
      <div className="h-8 sm:h-12 lg:h-16 bg-gradient-to-b from-transparent to-transparent"></div>

      {/* Location Services Section - Local SEO */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-[#FFFFFF] mb-6">
                Computerhulp in Rotterdam
              </h2>
              <p className="text-lg sm:text-xl text-[#D8E0FF] max-w-3xl mx-auto senior-description">
                Professionele computerhulp in Rotterdam en omstreken - snel, betrouwbaar en persoonlijk
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl" role="img" aria-label="Locatie icoon">📍</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Rotterdam Centrum</h3>
                <p className="text-[#D8E0FF]/80">
                  Geen voorrijkosten binnen 10 km van Rotterdam-centrum
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl" role="img" aria-label="Klok icoon">⏰</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Snelle Service</h3>
                <p className="text-[#D8E0FF]/80">
                  Meestal binnen 24 uur beschikbaar voor spoedgevallen
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 md:col-span-2 lg:col-span-1"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl" role="img" aria-label="Telefoon icoon">📞</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Direct Contact</h3>
                <p className="text-[#D8E0FF]/80">
                  Bel direct: 0624837889 voor computerhulp in Rotterdam
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <AccessibilityMenu />
    </div>
  );
} 