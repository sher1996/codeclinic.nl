'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const appointmentDate = searchParams.get('date');
  const appointmentTime = searchParams.get('time');
  const customerName = searchParams.get('name');

  useEffect(() => {
    // Track GA4 conversion event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'book_appointment', {
        'event_category': 'conversion',
        'event_label': 'appointment_booking',
        'value': 1,
        'currency': 'EUR',
        'transaction_id': bookingId,
        'custom_parameters': {
          'appointment_date': appointmentDate,
          'appointment_time': appointmentTime,
          'customer_name': customerName
        }
      });
    }
  }, [bookingId, appointmentDate, appointmentTime, customerName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bedankt voor uw afspraak!
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Uw afspraak is succesvol geboekt. U ontvangt binnenkort een bevestiging per e-mail 
            met alle details van uw afspraak.
          </p>

          {/* Appointment Details */}
          {(appointmentDate || appointmentTime) && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Afspraak Details
              </h2>
              <div className="space-y-2 text-blue-100">
                {customerName && (
                  <p><span className="font-medium">Naam:</span> {customerName}</p>
                )}
                {appointmentDate && (
                  <p><span className="font-medium">Datum:</span> {new Date(appointmentDate).toLocaleDateString('nl-NL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                )}
                {appointmentTime && (
                  <p><span className="font-medium">Tijd:</span> {appointmentTime}</p>
                )}
                {bookingId && (
                  <p className="text-sm text-blue-200">
                    <span className="font-medium">Boekingsnummer:</span> {bookingId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-6 mb-8 border border-blue-400/30">
            <h3 className="text-xl font-semibold text-white mb-4">
              Wat gebeurt er nu?
            </h3>
            <ul className="text-blue-100 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                U ontvangt een bevestigingsmail met alle details
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                Wij bereiden ons voor op uw afspraak
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                Wij nemen contact op als er vragen zijn
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <p className="text-blue-100 mb-4">
              Heeft u vragen over uw afspraak? Neem gerust contact met ons op:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+31612345678" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📞 Bel ons: 06-12345678
              </a>
              <a 
                href="mailto:info@codeclinic.nl" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ✉️ E-mail ons
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Terug naar Homepage
            </Link>
            <Link 
              href="/#plan-an-afspraak" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Nieuwe Afspraak Boeken
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
