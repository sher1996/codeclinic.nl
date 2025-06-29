'use client';

import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-20">
        <FAQ />
        <Footer />
      </main>
    </>
  );
} 