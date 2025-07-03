import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import HashNavigation from '@/components/HashNavigation';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import WebSocketTest from '@/components/WebSocketTest';

export default function Home() {
  return (
    <main className="flex-grow">
      <HashNavigation />
      <PerformanceMonitor />
      <Hero />
      <Services />
      <Contact />
      <WebSocketTest />
      <Footer />
    </main>
  );
}