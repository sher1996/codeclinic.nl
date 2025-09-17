'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const appointmentDate = searchParams.get('date');
  const appointmentTime = searchParams.get('time');
  const customerName = searchParams.get('name');

  useEffect(() => {
    // Track GA4 conversion event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', 'book_appointment', {
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

          {/* Appointment Details - Simplified */}
          {(appointmentDate || appointmentTime) && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
              <div className="space-y-3 text-blue-100 text-center">
                {customerName && (
                  <p className="text-lg"><span className="font-medium">Naam:</span> {customerName}</p>
                )}
                {appointmentDate && (
                  <p className="text-lg"><span className="font-medium">Datum:</span> {new Date(appointmentDate).toLocaleDateString('nl-NL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                )}
                {appointmentTime && (
                  <p className="text-lg"><span className="font-medium">Tijd:</span> {appointmentTime}</p>
                )}
                {bookingId && (
                  <p className="text-lg text-blue-200">
                    <span className="font-medium">Boekingsnummer:</span> {bookingId}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
