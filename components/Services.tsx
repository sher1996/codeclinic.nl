import { Computer, Home, Zap, Download, X, Shield, Wifi, Mail, Smartphone, Database, Lock, Video, CreditCard, Play, Image, Printer, RefreshCw, Accessibility, Plus, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect, useLayoutEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
const PricingSchema = lazy(() => import('./PricingSchema'));

// Service card styles
const serviceCardStyles = `
  .service-card {
    @apply w-full max-w-[280px];
  }
`;

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
    description: 'Professionele verwijdering van virussen en malware',
    category: 'security'
  },
  { 
    key: 'opschonen', 
    title: 'Computer opschonen & versnellen', 
    price: 'vanaf €39',
    icon: <Zap className="w-8 h-8 text-white" />,
    description: 'Optimalisatie van uw computer voor betere prestaties',
    category: 'hardware'
  },
  { 
    key: 'wifi', 
    title: 'Wifi- & netwerkoptimalisatie', 
    price: 'vanaf €45',
    icon: <Wifi className="w-8 h-8 text-white" />,
    description: 'Verbetering van wifi-bereik en netwerkverbinding',
    category: 'hardware'
  },
  { 
    key: 'email', 
    title: 'E-mail & internetconfiguratie', 
    price: 'vanaf €35',
    icon: <Mail className="w-8 h-8 text-white" />,
    description: 'Inrichten van e-mail en veilige internetinstellingen',
    category: 'software'
  },
  { 
    key: 'smartphone', 
    title: 'Smartphone/tablet-uitleg', 
    price: 'vanaf €35',
    icon: <Smartphone className="w-8 h-8 text-white" />,
    description: 'Praktische uitleg voor Android en iOS apparaten',
    category: 'hardware'
  },
  { 
    key: 'backup', 
    title: 'Back-up & gegevensherstel', 
    price: 'vanaf €45',
    icon: <Database className="w-8 h-8 text-white" />,
    description: 'Automatische back-ups en herstel van bestanden',
    category: 'software'
  },
  { 
    key: 'wachtwoord', 
    title: 'Wachtwoordbeheer & beveiliging', 
    price: 'vanaf €35',
    icon: <Lock className="w-8 h-8 text-white" />,
    description: 'Beveiliging van accounts en wachtwoordbeheer',
    category: 'security'
  },
  { 
    key: 'videobellen', 
    title: 'Videobellen & online contact', 
    price: 'vanaf €35',
    icon: <Video className="w-8 h-8 text-white" />,
    description: 'Installatie en uitleg van videobel-apps',
    category: 'productivity'
  },
  { 
    key: 'bankieren', 
    title: 'Online bankieren & betalingen', 
    price: 'vanaf €45',
    icon: <CreditCard className="w-8 h-8 text-white" />,
    description: 'Veilige inrichting van internetbankieren',
    category: 'security'
  },
  { 
    key: 'streaming', 
    title: 'Streamingdiensten & multimedia', 
    price: 'vanaf €35',
    icon: <Play className="w-8 h-8 text-white" />,
    description: 'Accounts voor Netflix, Spotify en andere diensten',
    category: 'productivity'
  },
  { 
    key: 'foto', 
    title: 'Digitale foto- & documentenbeheer', 
    price: 'vanaf €45',
    icon: <Image className="w-8 h-8 text-white" />,
    description: 'Organiseren van foto\'s en documenten',
    category: 'productivity'
  },
  { 
    key: 'printer', 
    title: 'Printer- & scannersupport', 
    price: 'vanaf €35',
    icon: <Printer className="w-8 h-8 text-white" />,
    description: 'Installatie en configuratie van printers',
    category: 'hardware'
  },
  { 
    key: 'updates', 
    title: 'Software-updates & licentiebeheer', 
    price: 'vanaf €35',
    icon: <RefreshCw className="w-8 h-8 text-white" />,
    description: 'Beheer van updates en softwarelicenties',
    category: 'software'
  },
  { 
    key: 'toegankelijkheid', 
    title: 'Toegankelijkheidsinstellingen', 
    price: 'vanaf €35',
    icon: <Accessibility className="w-8 h-8 text-white" />,
    description: 'Aanpassen van lettergrootte en contrast',
    category: 'software'
  }
];

function useKeepCentered(targetRef: React.RefObject<HTMLElement | null>, active: boolean) {
  const observerRef = useRef<ResizeObserver | null>(null);

  useLayoutEffect(() => {
    if (!active || !targetRef.current) return;

    const el = targetRef.current;
    const centre = () => {
      el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    };
    centre();
    observerRef.current = new ResizeObserver(() => centre());
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [active, targetRef]);
}

function ServiceCard() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'remote': false,
    'aan-huis': false
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
        'Maak een afspraak via de planner of telefonisch',
        'Ontvang de downloadlink per e-mail of sms',
        'Installeer het programma met hulp van onze expert',
        'Direct verbinding maken en het probleem oplossen'
      ],
      fallback: 'Komt het er niet van? Lukt downloaden of installeren niet, dan sturen we <strong>eenmalig</strong> een monteur langs (tegen een kleine toeslag).'
    },
    {
      key: 'aan-huis',
      title: 'Aan Huis Service',
      tagline: 'Persoonlijke hulp bij u thuis – geen gedoe met slepen',
      icon: <Home className="service-card-icon" />,
      steps: [
        'Maak een afspraak: kies dag en tijd in onze planner of telefonisch',
        'Bevestiging & telefonisch overleg: monteur belt 30 min voor aankomst',
        'Bezoek aan huis: probleem wordt ter plaatse opgelost',
        'Afronding & advies: duidelijke uitleg en vrijblijvende prijsopgave'
      ],
      fallback: 'Kosten: vanaf €49 plus eventuele hardware-onderdelen'
    }
  ], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {serviceCards.map((card) => (
        <div 
          key={card.key} 
          className={`service-card transition-all duration-300 ease-in-out backdrop-blur-md border border-white/20 ${
            expandedCards[card.key] ? 'bg-white/15' : 'bg-white/10'
          }`}
        >
          <button
            onClick={() => toggleCard(card.key)}
            className="w-full text-left p-6"
            aria-expanded={expandedCards[card.key]}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {card.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-white/80">
                  {card.tagline}
                </p>
              </div>
              <div className="flex-shrink-0">
                <ChevronDown 
                  className={`w-5 h-5 text-white/80 transition-transform duration-300 ${
                    expandedCards[card.key] ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedCards[card.key] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6">
              <div className="h-px bg-white/20 mb-6" />
              <ol className="space-y-4">
                {card.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00b8e6]/20 flex items-center justify-center text-[#00b8e6] text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-white/80">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-white/60 text-sm" dangerouslySetInnerHTML={{ __html: card.fallback }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AccessibilityMenu() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Toegankelijkheidsmenu"
      >
        <Accessibility className="w-6 h-6" />
      </button>
    </div>
  );
}

function ScrollCue() {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
      <ChevronDown className="w-6 h-6" />
    </div>
  );
}

export default function Services() {
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 || window.devicePixelRatio > 2 : false;

  const [activeCategory, setActiveCategory] = useState('all');
  const { scrollYProgress } = useScroll();

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <div className={`relative isolate overflow-hidden ${isLowEnd ? 'bg-[#1F2C90]/20' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20 backdrop-blur-sm'}`}>
      {!isLowEnd && (
        <>
          <div className="absolute inset-0 bg-black/30 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
          <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-transparent to-transparent opacity-60 mix-blend-soft-light pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
        </>
      )}

      {/* Lazy load PricingSchema */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
        <PricingSchema />
      </Suspense>

      {/* Main Services Section */}
      <motion.section
        id="services"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative py-32 sm:py-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-semibold text-white">Hulp Die Bij U Past</h2>
            <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto text-center">Kies zelf hoe u geholpen wilt worden: op afstand of aan huis</p>
          </motion.div>
          
          <div className="services-grid">
            <ServiceCard />
          </div>
        </div>
      </motion.section>

      {/* Diensten Section */}
      <motion.section
        id="diensten"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative py-36 sm:py-40 pb-64"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <div className="col-span-1 md:col-span-12 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h3 className="text-[3.5rem] font-black tracking-tight leading-[1.1] text-[#FFFFFF] mb-6">
                  Diensten
                </h3>
                <p className="text-xl text-[#D8E0FF] max-w-2xl mx-auto">
                  Bekijk ons complete aanbod van digitale ondersteuning
                </p>
              </motion.div>
            </div>
          </div>

          {/* Category Filter */}
          <div id="filter-bar" className="sticky top-0 z-50 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 pointer-events-none">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 sm:justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                    }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 pointer-events-auto
                      ${activeCategory === category.id 
                        ? 'bg-[#00b8e6] text-white shadow-lg' 
                        : isLowEnd ? 'bg-white/10 text-[#D8E0FF]' : 'bg-white/10 backdrop-blur-md text-[#D8E0FF] hover:bg-white/20'}
                      break-all xs:break-normal`}
                    aria-pressed={activeCategory === category.id}
                  >
                    <span className="hidden xs:inline">{category.label}</span>
                    <span className="xs:hidden">{category.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex flex-wrap justify-center gap-6 relative pointer-events-none mt-8">
            <AnimatePresence mode="sync">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.key}
                  layout={false}
                  initial={isLowEnd || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.2,
                    type: "tween"
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${service.title} - ${service.description}`}
                  className={`
                    w-[280px]
                    ${isLowEnd ? 'bg-white/10' : 'bg-white/10 backdrop-blur-sm'}
                    rounded-xl p-4
                    flex flex-col items-center text-center
                    cursor-pointer transition-all duration-300
                    border border-white/10 shadow-lg hover:border-white/20
                    pointer-events-auto
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400
                    active:scale-[0.98]
                    ${isLowEnd ? '' : 'hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]'}
                  `}
                  style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                >
                  <div className="flex flex-col items-center justify-between h-full w-full">
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="relative w-12 h-12 mb-3"
                        whileHover={isLowEnd ? {} : { scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        aria-hidden="true"
                        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                      >
                        <div className={`absolute inset-0 ${isLowEnd ? 'bg-[#00b8e6]/10' : 'bg-[#00b8e6]/10 blur-sm'} rounded-full group-hover:bg-[#00b8e6]/20 transition-colors duration-300`}></div>
                        <div className="relative w-full h-full flex items-center justify-center text-[#00b8e6] transition-colors duration-300">
                          {React.cloneElement(service.icon, { 
                            className: "w-8 h-8 stroke-[1.5]",
                            strokeWidth: 1.5
                          })}
                        </div>
                      </motion.div>
                      <h4 className="text-base font-semibold text-white mb-2">{service.title}</h4>
                    </div>
                    <p className="text-sm text-[#E6EFFF] leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Full-width bar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-12">
            <div className="col-span-full lg:col-span-4">
              <div className={`relative ${isLowEnd ? 'bg-white/10' : 'bg-white/10 backdrop-blur-md'} rounded-xl border border-white/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8`} style={{ minHeight: '96px' }}>
                <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-[#00b8e6]" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-white mb-1">En nog veel meer</h3>
                    <p className="text-sm text-white/80">Persoonlijke digitale ondersteuning voor álles waar u hulp bij nodig hebt!</p>
                  </div>
                </div>
                <button className="bg-[#00b8e6] text-white font-medium px-4 py-2 rounded-full flex items-center gap-2 mt-2 sm:mt-0">
                  Vraag maatwerk aan <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>
            </div>
          </div>
          <ScrollCue />
        </div>
      </motion.section>

      {/* Tarieven Section */}
      <section 
        id="tarieven" 
        className="relative py-36 sm:py-40 pb-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <div className="col-span-1 md:col-span-12 mb-24">
              <div className="text-center">
                <h3 className="text-[4.5rem] font-black tracking-tight leading-[1.1] text-center text-[#FFFFFF]">Tarieven</h3>
              </div>
            </div>
            
            {/* Remote Support Pricing */}
            <motion.div 
              className="col-span-1 md:col-span-4 mb-6 md:mb-0"
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
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 h-full flex flex-col justify-between w-full
                hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <motion.span 
                    className="text-4xl w-6 text-[#FFFFFF]" 
                    role="img" 
                    aria-label="Remote computer support"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >💻</motion.span>
                  <h4 className="text-2xl font-bold text-[#FFFFFF]">Remote Hulp</h4>
                </div>
                <p className="text-[#FFFFFF]/80 mb-6">Klaar terwijl u kijkt</p>
                <div className="space-y-6 flex-grow">
                  <p className="text-3xl font-semibold text-[#FFFFFF]">€11 <span className="text-base">/15 min</span></p>
                  <p className="text-[#FFFFFF]/80">(≈ €44/u)</p>
                  <p className="text-sm text-[#FFFFFF]/80">Daarna afrekening per minuut, geen minimum.</p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl text-[#FFFFFF]/80">⚡</span>
                      <span className="text-[#FFFFFF]/80">Direct start, per-minuut facturering</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl text-[#FFFFFF]/80">💳</span>
                      <span className="text-[#FFFFFF]/80">iDEAL betaling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl text-[#FFFFFF]/80">⏰</span>
                      <span className="text-[#FFFFFF]/80">Meestal binnen 5 min verbonden</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 text-sm text-[#FFFFFF]/80">Niet opgelost = geen kosten</div>
                <a href="#boek" className="mt-8 bg-[#00d4ff] text-[#FFFFFF] font-bold px-6 py-3 rounded-lg text-center hover:brightness-110 transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4ff] hover:bg-[#00b8e6]" data-analytics="pricing_button_remote">
                  Start direct <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Bundles Pricing */}
            <motion.div 
              className="col-span-1 md:col-span-4 mb-6 md:mb-0"
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
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 h-full flex flex-col justify-between w-full
                hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <motion.span 
                    className="text-4xl w-6 text-[#FFFFFF]" 
                    role="img" 
                    aria-label="Service bundles"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >🛠️</motion.span>
                  <h4 className="text-2xl font-bold text-[#FFFFFF]">Service Bundles</h4>
                </div>
                <p className="text-[#FFFFFF]/80 mb-6">Vaste prijs, geen verrassingen</p>
                <div className="space-y-6 flex-grow">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl text-[#FFFFFF]/80">✅</span>
                      <span className="text-[#FFFFFF]/80"><strong className="text-[#FFFFFF]">Virus & Malware Scan</strong> — €99</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl text-[#FFFFFF]/80">✅</span>
                      <span className="text-[#FFFFFF]/80"><strong className="text-[#FFFFFF]">Computer Tune-up</strong> — €79</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-sm text-[#FFFFFF]/80">Niet opgelost = geen kosten</div>
                </div>
                <a href="#boek" className="mt-8 bg-[#00d4ff] text-[#FFFFFF] font-bold px-6 py-3 rounded-lg text-center hover:brightness-110 transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4ff] hover:bg-[#00b8e6]" data-analytics="pricing_button_bundle">
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
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 h-full flex flex-col justify-between w-full
                hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <motion.span 
                    className="text-4xl w-6 text-[#FFFFFF]" 
                    role="img" 
                    aria-label="On-site computer support"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >🏠</motion.span>
                  <h4 className="text-2xl font-bold text-[#FFFFFF]">Computerhulp aan huis</h4>
                </div>
                <p className="text-[#FFFFFF]/80 mb-6">Geen voorrijkosten in Rotterdam</p>
                <div className="space-y-6 flex-grow">
                  <p className="text-3xl font-semibold text-[#FFFFFF]">€50 <span className="text-base">/uur</span></p>
                  <p className="text-[#FFFFFF]/80">≤ 10 km vanaf Rotterdam-centrum, daarna €0,25/km</p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl text-[#FFFFFF]/80">💳</span>
                      <span className="text-[#FFFFFF]/80">iDEAL, contant of pin</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-sm text-[#FFFFFF]/80">Niet opgelost = geen kosten</div>
                </div>
                <a href="#boek" className="mt-8 bg-[#00d4ff] text-[#FFFFFF] font-bold px-6 py-3 rounded-lg text-center hover:brightness-110 transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4ff] hover:bg-[#00b8e6]" data-analytics="pricing_button_onsite">
                  Plan bezoek <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* FAQ Link */}
            <div className="col-span-1 md:col-span-12 mt-12 text-center">
              <a 
                href="#faq" 
                className="inline-flex items-center gap-2 text-[#FFFFFF] hover:text-[#00d4ff] transition-colors"
                data-analytics="faq_link"
              >
                <span>Veelgestelde vragen</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* VAT Notice */}
            <div className="col-span-1 md:col-span-12 mt-4 text-center">
              <p className="text-xs opacity-70">
                Alle bedragen incl. 21% btw.
                <a href="/terms" className="ml-1 text-[#00d4ff] hover:underline">Zie voorwaarden voor details</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <AccessibilityMenu />
    </div>
  );
} 