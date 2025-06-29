import type { Metadata } from 'next';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen - CodeClinic Computerhulp Rotterdam',
  description: 'Antwoorden op veelgestelde vragen over computerhulp, remote ondersteuning en aan huis service in Rotterdam. Duidelijke uitleg over onze diensten en garanties.',
  keywords: 'FAQ computerhulp, veelgestelde vragen computer reparatie, computerhulp Rotterdam vragen, remote hulp uitleg, computer ondersteuning FAQ',
  openGraph: {
    title: 'Veelgestelde Vragen - CodeClinic Computerhulp Rotterdam',
    description: 'Antwoorden op veelgestelde vragen over computerhulp, remote ondersteuning en aan huis service in Rotterdam.',
    url: 'https://codeclinic.nl/faq',
  },
  twitter: {
    title: 'Veelgestelde Vragen - CodeClinic Computerhulp Rotterdam',
    description: 'Antwoorden op veelgestelde vragen over computerhulp, remote ondersteuning en aan huis service in Rotterdam.',
  },
  alternates: {
    canonical: '/faq',
  },
};

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