'use client';

import Hero from '@/components/Hero';
// import TrustBar from '@/components/TrustBar';
import Services from '@/components/Services';
// import HowItWorks from '@/components/HowItWorks';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex-grow">
      <Hero />
      {/* <TrustBar /> */}
      <Services />
      {/* <HowItWorks /> */}
      <Contact />
      <Footer />
    </main>
  );
}