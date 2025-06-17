import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SubmitStatus = {
  ok: boolean;
  message: string;
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  notes: string;
}

interface AppointmentCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export default function AppointmentCalendar({ onDateSelect }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ ok: true, message: '' });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if device is low-end
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const isLowEndDevice = 
        navigator.hardwareConcurrency <= 4 || // Low CPU cores
        !window.matchMedia('(prefers-reduced-motion: no-preference)').matches || // Reduced motion preference
        window.innerWidth < 768; // Small screen
      setIsLowEnd(isLowEndDevice);
    };

    checkDeviceCapabilities();
    window.addEventListener('resize', checkDeviceCapabilities);
    return () => window.removeEventListener('resize', checkDeviceCapabilities);
  }, []);

  // Generate time slots from 9:00 to 16:00 with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
      onDateSelect?.(date);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ ok: false, message: 'Bezig met verzenden...' });

    try {
      if (!selectedDate || !selectedTime) {
        setSubmitStatus({ 
          ok: false, 
          message: "Selecteer een datum en tijd" 
        });
        return;
      }

      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date: formattedDate,
          time: selectedTime,
          address: `${formData.street} ${formData.houseNumber}`,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setSubmitStatus({ 
          ok: false, 
          message: error ?? "Kon e-mail niet verzenden" 
        });
        return;
      }

      setSubmitStatus({ 
        ok: true, 
        message: "Afspraak bevestigd! Controleer uw inbox." 
      });

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        notes: '',
      });
      setSelectedDate(null);
      setSelectedTime(null);

    } catch (error) {
      console.error('Error submitting appointment:', error);
      setSubmitStatus({ 
        ok: false, 
        message: "Er is een fout opgetreden bij het verzenden van de afspraak" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  return (
    <div className="relative isolate">
      {/* Background effects - only for high-end devices */}
      {!isLowEnd && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F2C90]/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-transparent to-transparent opacity-60 mix-blend-soft-light" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Plan een afspraak
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Kies een datum en tijd die het beste bij u past. We helpen u graag verder.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl ring-1 ring-white/10 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <div className="mt-10 flex items-center gap-x-4">
              <h3 className="flex-none text-sm font-semibold leading-6 text-white">Wat kunt u verwachten?</h3>
              <div className="h-px flex-auto bg-white/10"></div>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6">
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Professionele diagnose
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Snelle service
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Transparante prijzen
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Expert advies
              </li>
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className={`rounded-2xl ${isLowEnd ? 'bg-[#1F2C90]/10' : 'bg-gradient-to-b from-[#1F2C90]/20 to-[#1F2C90]/10 backdrop-blur-sm'} py-10 text-center ring-1 ring-inset ring-white/10 lg:flex lg:flex-col lg:justify-center lg:py-16`}>
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-white">Beschikbare tijden</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">9:00</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-300">- 17:00</span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-[#1F2C90] shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Plan nu
                </a>
                <p className="mt-6 text-xs leading-5 text-gray-300">
                  Maandag t/m Vrijdag
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 