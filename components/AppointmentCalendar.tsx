'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCSSLoader } from './CSSLoader';

interface AppointmentCalendarProps {
  onDateSelect?: (date: Date) => void;
  appointmentType?: 'onsite' | 'remote';
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  date?: string;
  time?: string;
  general?: string;
}

export default function AppointmentCalendar({ onDateSelect, appointmentType = 'onsite' }: AppointmentCalendarProps) {
  // Initialize calendar to current month (never show past months)
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // If we're in the current month and it's late in the month, start with next month
    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const isLateInMonth = today.getDate() >= daysInCurrentMonth - 2; // If we're in the last 2 days of the month
    
    if (isLateInMonth) {
      return new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }
    
    return currentMonth;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: ''
  });

  // Refs for focus management
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeGridRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Check if device is low-end
  const [isLowEnd, setIsLowEnd] = useState(false);

  // Load calendar CSS only when component is rendered
  useCSSLoader('/calendar.css', true);

  const fetchBookedTimes = useCallback(async (date: Date) => {
    setIsLoadingBookings(true);
    try {
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      console.log('[AppointmentCalendar] Fetching booked times for date:', dateString);
      
      // Fetch both available slots and existing bookings
      const [calendarResponse, slotsResponse] = await Promise.all([
        fetch('/api/calendar'),
        fetch(`/api/available-slots?date=${dateString}`)
      ]);
      
      if (calendarResponse.ok && slotsResponse.ok) {
        const calendarData = await calendarResponse.json();
        const slotsData = await slotsResponse.json();
        
        console.log('[AppointmentCalendar] All bookings from API:', calendarData.bookings);
        console.log('[AppointmentCalendar] Available slots from API:', slotsData.availableSlots);
        
        const bookedForDate = calendarData.bookings
          .filter((booking: { date: string; time: string }) => booking.date === dateString)
          .map((booking: { date: string; time: string }) => booking.time);
        
        console.log('[AppointmentCalendar] Booked times for', dateString, ':', bookedForDate);
        setBookedTimes(bookedForDate);
        setAnnouncement(`Beschikbare tijden geladen voor ${formatDateShort(date)}`);
      } else {
        console.error('[AppointmentCalendar] Failed to fetch data:', calendarResponse.status, slotsResponse.status);
        // Fallback to original behavior
        const response = await fetch('/api/calendar');
        if (response.ok) {
          const data = await response.json();
          const bookedForDate = data.bookings
            .filter((booking: { date: string; time: string }) => booking.date === dateString)
            .map((booking: { date: string; time: string }) => booking.time);
          setBookedTimes(bookedForDate);
        }
      }
    } catch (error) {
      console.error('Failed to fetch booked times:', error);
      setAnnouncement('Fout bij het laden van beschikbare tijden');
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedTimes(selectedDate);
    } else {
      setBookedTimes([]);
    }
  }, [selectedDate, fetchBookedTimes]);

  // Auto-advance to next month if current month has no available dates
  useEffect(() => {
    const today = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Check if we're in the current month and if there are any future dates
    if (currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()) {
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const hasFutureDates = lastDayOfMonth.getDate() > today.getDate();
      
      // If no future dates in current month, advance to next month
      if (!hasFutureDates) {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth() + 1, 1));
      }
    }
  }, [currentDate]);

  // Announce changes to screen readers
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

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

  const weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

  // Check if we can navigate to previous month (prevent showing past months)
  const canNavigateToPrevMonth = () => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const calendarMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return calendarMonth > currentMonth;
  };

  const handlePrevMonth = () => {
    if (canNavigateToPrevMonth()) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      setCurrentDate(newDate);
      setAnnouncement(`Vorige maand: ${formatMonthYear(newDate)}`);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setAnnouncement(`Volgende maand: ${formatMonthYear(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}`);
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
      setFormErrors({}); // Clear errors when selecting new date
      if (onDateSelect) {
        onDateSelect(date);
      }
      setAnnouncement(`Datum geselecteerd: ${formatDateShort(date)}`);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!bookedTimes.includes(time)) {
      setSelectedTime(time);
      setFormErrors({}); // Clear errors when selecting new time
      setAnnouncement(`Tijd geselecteerd: ${time}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Keyboard navigation for calendar
  const handleCalendarKeyDown = (e: React.KeyboardEvent, day: Date | null) => {
    if (!day) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleDateClick(day);
        break;
    }
  };

  // Keyboard navigation for time slots
  const handleTimeKeyDown = (e: React.KeyboardEvent, timeIndex: number, time: string) => {
    if (!selectedDate) return;
    
    // Use the available times from the API
    const availableTimes = availableTimeSlots.filter(time => !bookedTimes.includes(time));

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (timeIndex < availableTimes.length - 1) {
          // Focus management would go here if needed
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (timeIndex > 0) {
          // Focus management would go here if needed
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextRowIndex = timeIndex + 4;
        if (nextRowIndex < availableTimes.length) {
          // Focus management would go here if needed
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevRowIndex = timeIndex - 4;
        if (prevRowIndex >= 0) {
          // Focus management would go here if needed
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleTimeSelect(time);
        break;
      case 'Home':
        e.preventDefault();
        // Focus management would go here if needed
        break;
      case 'End':
        e.preventDefault();
        // Focus management would go here if needed
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField && firstErrorField !== 'general') {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
        }
      }
      
      // Announce errors to screen readers
      setAnnouncement('Er zijn fouten in het formulier. Controleer de rode velden en probeer opnieuw.');
      
      // Scroll to error summary
      if (errorSummaryRef.current) {
        errorSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    setIsSubmitting(true);
    setFormErrors({}); // Clear any existing errors

    try {
      // Debug: Check if we have a selected date
      console.log('[AppointmentCalendar] Selected date:', selectedDate);
      console.log('[AppointmentCalendar] Selected time:', selectedTime);
      
      if (!selectedDate) {
        throw new Error('Geen datum geselecteerd');
      }

      // 1. Create / confirm booking in DB
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateString = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;
      console.log('[AppointmentCalendar] Formatted date string:', dateString);
      
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: dateString,
        time: selectedTime || '',
        notes: formData.notes,
        appointmentType: appointmentType
      };

      console.log('[AppointmentCalendar] Creating booking:', bookingData);

      const bookingRes = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingRes.ok) {
        const errorData = await bookingRes.json();
        console.error('[AppointmentCalendar] Booking failed:', errorData);
        throw new Error(errorData.error || `Booking failed (${bookingRes.status})`);
      }

      const bookingResult = await bookingRes.json();
      console.log('[AppointmentCalendar] Booking created:', bookingResult);

      // Email confirmation is automatically sent by the backend API
      console.log('[AppointmentCalendar] Email confirmation will be sent automatically by the backend');
      
      // Track Google Ads conversion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-17577884942',
          'value': 1.0,
          'currency': 'EUR',
          'transaction_id': bookingResult.booking.booking_number || bookingResult.booking.id
        });
      }
      
      setAnnouncement('Afspraak succesvol geboekt! U wordt doorgestuurd naar de bevestigingspagina...');
      
      // Redirect to thank you page with booking details
      const thankYouParams = new URLSearchParams({
        booking_id: bookingResult.booking.booking_number || bookingResult.booking.id,
        date: dateString,
        time: selectedTime || '',
        name: formData.name
      });
      
      // Small delay to show success message, then redirect
      setTimeout(() => {
        window.location.href = `/thank-you?${thankYouParams.toString()}`;
      }, 1500);
    } catch (err: unknown) {
      console.error('[AppointmentCalendar] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Onbekende fout';
      setFormErrors({ general: errorMessage });
      setAnnouncement(`Fout bij boeken: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  };

  const formatDateShort = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isPastTime = (date: Date, time: string) => {
    const today = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    return slotTime <= today;
  };

  // Generate days for the current month (only show available dates)
  const days = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month, but only show future dates (hide today and past dates completely)
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDay = new Date(year, month, i);
      const currentDayMidnight = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
      
      // Only add the day if it's in the future (exclude today)
      if (currentDayMidnight > todayDate) {
        days.push(currentDay);
      } else {
        // Add null for today and past dates to maintain calendar structure
        days.push(null);
      }
    }

    return days;
  })();

  // State for available time slots from API
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateString = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;
      
      fetch(`/api/available-slots?date=${dateString}`)
        .then(response => response.json())
        .then(data => {
          if (data.ok) {
            setAvailableTimeSlots(data.availableSlots || []);
          } else {
            // Fallback to default time slots
            const defaultSlots = Array.from({ length: 8 }, (_, i) => i + 9).flatMap(hour => {
              const times = [];
              if (!isPastTime(selectedDate, `${hour.toString().padStart(2, '0')}:00`)) {
                times.push(`${hour.toString().padStart(2, '0')}:00`);
              }
              if (!isPastTime(selectedDate, `${hour.toString().padStart(2, '0')}:30`)) {
                times.push(`${hour.toString().padStart(2, '0')}:30`);
              }
              return times;
            });
            setAvailableTimeSlots(defaultSlots);
          }
        })
        .catch(error => {
          console.error('Error fetching available slots:', error);
          // Fallback to default time slots
          const defaultSlots = Array.from({ length: 8 }, (_, i) => i + 9).flatMap(hour => {
            const times = [];
            if (!isPastTime(selectedDate, `${hour.toString().padStart(2, '0')}:00`)) {
              times.push(`${hour.toString().padStart(2, '0')}:00`);
            }
            if (!isPastTime(selectedDate, `${hour.toString().padStart(2, '0')}:30`)) {
              times.push(`${hour.toString().padStart(2, '0')}:30`);
            }
            return times;
          });
          setAvailableTimeSlots(defaultSlots);
        });
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate]);

  // Generate blocked time slots (1.5 hours after each booking)
  const generateBlockedTimeSlots = (bookedTimes: string[]): string[] => {
    const blockedSlots: string[] = [];
    
    bookedTimes.forEach(bookedTime => {
      const [hours, minutes] = bookedTime.split(':').map(Number);
      const bookedDateTime = new Date();
      bookedDateTime.setHours(hours, minutes, 0, 0);
      
      // Generate 30-minute slots for the 1.5-hour block AFTER the booking
      for (let i = 0; i < 3; i++) {
        const slotDateTime = new Date(bookedDateTime.getTime() + (i * 30 * 60 * 1000));
        const slotHours = slotDateTime.getHours();
        const slotMinutes = slotDateTime.getMinutes();
        const slotTime = `${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;
        
        // Only add if it's not in the past
        if (!isPastTime(selectedDate!, slotTime)) {
          blockedSlots.push(slotTime);
        }
      }
    });
    
    return blockedSlots;
  };

  // Generate available time slots (filter out booked times and blocked times)
  const blockedTimes = selectedDate ? generateBlockedTimeSlots(bookedTimes) : [];
  const availableTimes = selectedDate ? availableTimeSlots.filter(time => 
    !bookedTimes.includes(time) && !blockedTimes.includes(time)
  ) : [];

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      errors.name = 'Uw naam is verplicht';
    }

    if (!formData.email.trim()) {
      errors.email = 'Uw e-mailadres is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Voer een geldig e-mailadres in (bijvoorbeeld: naam@gmail.com)';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Uw telefoonnummer is verplicht';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Voer een geldig telefoonnummer in (bijvoorbeeld: 0612345678)';
    }

    if (!formData.street.trim()) {
      errors.street = 'Uw straatnaam is verplicht';
    }

    if (!formData.houseNumber.trim()) {
      errors.houseNumber = 'Uw huisnummer is verplicht';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Uw postcode is verplicht';
    } else if (!/^[1-9][0-9]{3}\s?[A-Z]{2}$/i.test(formData.postalCode)) {
      errors.postalCode = 'Voer een geldige postcode in (bijvoorbeeld: 1234 AB)';
    }

    if (!formData.city.trim()) {
      errors.city = 'Uw plaats is verplicht';
    }

    if (!selectedDate) {
      errors.date = 'Selecteer een datum voor uw afspraak';
    }

    if (!selectedTime) {
      errors.time = 'Selecteer een tijd voor uw afspraak';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="relative isolate">
      {/* ARIA live region for announcements */}
      <div className="aria-live" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Background effects - only for high-end devices */}
      {!isLowEnd && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F2C90]/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-transparent to-transparent opacity-60 mix-blend-soft-light" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-24 lg:px-8">
        <div className={`mx-auto max-w-2xl rounded-2xl ${isLowEnd ? 'bg-white/5' : 'ring-1 ring-white/10'} lg:mx-0 lg:flex lg:max-w-none`}>
          <div className="p-3 sm:p-8 lg:flex-auto">
            <div className={`w-full max-w-4xl mx-auto ${isLowEnd ? 'bg-white/5' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-3 sm:p-6 shadow-xl`}>
              <AnimatePresence mode="wait">
                {!selectedDate ? (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                    ref={calendarRef}
                    role="application"
                    aria-label="Kalender voor het selecteren van een datum"
                  >
                    <div className="calendar-navigation">
                      <button
                        onClick={handlePrevMonth}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePrevMonth();
                          }
                        }}
                        disabled={!canNavigateToPrevMonth()}
                        className={`calendar-nav-button ${!canNavigateToPrevMonth() ? 'opacity-30 cursor-not-allowed' : ''}`}
                        aria-label="Vorige maand"
                      >
                        ←
                      </button>
                      <h2 className="text-lg sm:text-xl font-semibold text-center" id="calendar-title">
                        {formatMonthYear(currentDate)}
                      </h2>
                      <button
                        onClick={handleNextMonth}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleNextMonth();
                          }
                        }}
                        className="calendar-nav-button"
                        aria-label="Volgende maand"
                      >
                        →
                      </button>
                    </div>

                    <div className="calendar-grid" role="grid" aria-labelledby="calendar-title">
                      {weekDays.map(day => (
                        <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 p-1" role="columnheader">
                          {day}
                        </div>
                      ))}
                      
                      {days.map((day, index) => (
                        <button
                          key={day ? day.toISOString() : `empty-${index}`}
                          onClick={() => handleDateClick(day)}
                          onKeyDown={(e) => handleCalendarKeyDown(e, day)}
                          disabled={!day}
                          tabIndex={day ? 0 : -1}
                          className={`
                            calendar-day
                            ${!day ? 'opacity-0 cursor-default' : ''}
                            ${day && isSelected(day) ? 'bg-[#0066cc] border-[#0066cc] text-white' : ''}
                            ${day && !isSelected(day) ? 'hover:bg-white/10' : ''}
                          `}
                          aria-label={day ? `${day.getDate()} ${formatMonthYear(day)} - Beschikbaar` : 'Lege dag'}
                          aria-selected={day ? isSelected(day) : undefined}
                          role="gridcell"
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-base sm:text-lg font-semibold">{day?.getDate()}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-white/60 text-center">
                      <p>Gebruik Tab om door de kalender te navigeren, pijltjestoetsen om dagen te selecteren, en Enter om een datum te kiezen.</p>
                    </div>
                  </motion.div>
                ) : selectedTime ? (
                  <motion.div
                    key="appointment-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-6">
                      <button
                        onClick={() => setSelectedTime(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                        aria-label="Terug naar tijden selecteren"
                      >
                        ← Terug naar tijden
                      </button>
                      <div className="text-center">
                        <h2 className="text-base sm:text-lg font-semibold">
                          {appointmentType === 'remote' ? 'Remote hulp boeken' : 'Aan huis bezoek boeken'}
                        </h2>
                      </div>
                    </div>

                    <div className={`${isLowEnd ? 'bg-transparent' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-3 sm:p-6 border border-white/10`}>
                      <div className="mb-3 sm:mb-6 p-2 sm:p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-white/60">Geselecteerde tijd</p>
                        <p className="text-base sm:text-lg font-medium">{selectedTime}</p>
                        <p className="text-sm text-white/60">{formatDateShort(selectedDate)}</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" ref={formRef}>
                        {/* Error Summary */}
                        {Object.keys(formErrors).length > 0 && (
                          <div 
                            ref={errorSummaryRef}
                            className="error-summary" 
                            role="alert" 
                            aria-live="assertive"
                            tabIndex={-1}
                          >
                            <h3>Er zijn fouten in het formulier:</h3>
                            <ul>
                              {Object.entries(formErrors).map(([field, error]) => (
                                <li key={field}>
                                  {field === 'name' && 'Naam: '}
                                  {field === 'email' && 'E-mail: '}
                                  {field === 'phone' && 'Telefoon: '}
                                  {field === 'street' && 'Straat: '}
                                  {field === 'houseNumber' && 'Huisnummer: '}
                                  {field === 'postalCode' && 'Postcode: '}
                                  {field === 'city' && 'Plaats: '}
                                  {field === 'date' && 'Datum: '}
                                  {field === 'time' && 'Tijd: '}
                                  {field === 'general' && ''}
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <label htmlFor="name" className="form-label">
                            Naam <span className="text-red-400" aria-label="verplicht veld">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`form-input ${formErrors.name ? 'form-input-error' : ''}`}
                            required
                            aria-required="true"
                            aria-invalid={!!formErrors.name}
                            aria-describedby={formErrors.name ? 'name-error' : undefined}
                            placeholder="Uw voor- en achternaam"
                          />
                          {formErrors.name && (
                            <div id="name-error" className="form-error" role="alert">
                              {formErrors.name}
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="form-label">
                            E-mailadres <span className="text-red-400" aria-label="verplicht veld">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-input ${formErrors.email ? 'form-input-error' : ''}`}
                            required
                            aria-required="true"
                            aria-invalid={!!formErrors.email}
                            aria-describedby={formErrors.email ? 'email-error' : undefined}
                            placeholder="naam@gmail.com"
                          />
                          {formErrors.email && (
                            <div id="email-error" className="form-error" role="alert">
                              {formErrors.email}
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="phone" className="form-label">
                            Telefoonnummer <span className="text-red-400" aria-label="verplicht veld">*</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`form-input ${formErrors.phone ? 'form-input-error' : ''}`}
                            required
                            aria-required="true"
                            aria-invalid={!!formErrors.phone}
                            aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                            placeholder="0612345678"
                          />
                          {formErrors.phone && (
                            <div id="phone-error" className="form-error" role="alert">
                              {formErrors.phone}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label htmlFor="street" className="form-label">
                              Straatnaam <span className="text-red-400" aria-label="verplicht veld">*</span>
                            </label>
                            <input
                              id="street"
                              type="text"
                              name="street"
                              value={formData.street}
                              onChange={handleInputChange}
                              className={`form-input ${formErrors.street ? 'form-input-error' : ''}`}
                              required
                              aria-required="true"
                              aria-invalid={!!formErrors.street}
                              aria-describedby={formErrors.street ? 'street-error' : undefined}
                              placeholder="Hoofdstraat"
                            />
                            {formErrors.street && (
                              <div id="street-error" className="form-error" role="alert">
                                {formErrors.street}
                              </div>
                            )}
                          </div>
                          <div>
                            <label htmlFor="houseNumber" className="form-label">
                              Huisnummer <span className="text-red-400" aria-label="verplicht veld">*</span>
                            </label>
                            <input
                              id="houseNumber"
                              type="text"
                              name="houseNumber"
                              value={formData.houseNumber}
                              onChange={handleInputChange}
                              className={`form-input ${formErrors.houseNumber ? 'form-input-error' : ''}`}
                              required
                              aria-required="true"
                              aria-invalid={!!formErrors.houseNumber}
                              aria-describedby={formErrors.houseNumber ? 'houseNumber-error' : undefined}
                              placeholder="123"
                            />
                            {formErrors.houseNumber && (
                              <div id="houseNumber-error" className="form-error" role="alert">
                                {formErrors.houseNumber}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label htmlFor="postalCode" className="form-label">
                              Postcode <span className="text-red-400" aria-label="verplicht veld">*</span>
                            </label>
                            <input
                              id="postalCode"
                              type="text"
                              name="postalCode"
                              placeholder="1234 AB"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className={`form-input ${formErrors.postalCode ? 'form-input-error' : ''}`}
                              required
                              aria-required="true"
                              aria-invalid={!!formErrors.postalCode}
                              aria-describedby={formErrors.postalCode ? 'postalCode-error' : undefined}
                            />
                            {formErrors.postalCode && (
                              <div id="postalCode-error" className="form-error" role="alert">
                                {formErrors.postalCode}
                              </div>
                            )}
                          </div>
                          <div>
                            <label htmlFor="city" className="form-label">
                              Plaats <span className="text-red-400" aria-label="verplicht veld">*</span>
                            </label>
                            <input
                              id="city"
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={`form-input ${formErrors.city ? 'form-input-error' : ''}`}
                              required
                              aria-required="true"
                              aria-invalid={!!formErrors.city}
                              aria-describedby={formErrors.city ? 'city-error' : undefined}
                              placeholder="Rotterdam"
                            />
                            {formErrors.city && (
                              <div id="city-error" className="form-error" role="alert">
                                {formErrors.city}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="notes" className="form-label">
                            Notities <span className="text-sm text-white/60 font-normal">(optioneel)</span>
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="form-input"
                            placeholder="Beschrijf uw probleem of specifieke wensen voor de afspraak..."
                            aria-describedby="notes-help"
                          />
                          <p id="notes-help" className="form-help">
                            Optioneel: Beschrijf uw probleem of specifieke wensen voor de afspraak. Dit helpt ons om u beter te kunnen helpen.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary w-full text-xl py-5"
                          aria-describedby="submit-status"
                        >
                          {isSubmitting ? 'Bezig met boeken...' : `${appointmentType === 'remote' ? 'Remote hulp' : 'Aan huis bezoek'} bevestigen`}
                        </button>
                        <div id="submit-status" className="sr-only" aria-live="polite">
                          {isSubmitting ? 'Bezig met het boeken van uw afspraak...' : ''}
                        </div>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="time-slots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                        aria-label="Terug naar kalender"
                      >
                        ← Terug
                      </button>
                      <div className="text-center">
                        <h2 className="text-base sm:text-lg font-semibold">
                          {formatDateShort(selectedDate)}
                        </h2>
                      </div>
                    </div>

                    <div className={`${isLowEnd ? 'bg-transparent' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-3 sm:p-6 border border-white/10`}>
                      <h3 className="text-base font-medium mb-3 sm:mb-4 text-[#0066cc]">
                        Beschikbare tijden
                      </h3>

                      {/* Loading state */}
                      {isLoadingBookings && (
                        <div className="flex justify-center mb-4" role="status" aria-live="polite">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0066cc]"></div>
                          <span className="sr-only">Laden van beschikbare tijden...</span>
                        </div>
                      )}

                      {/* Legend */}
                      <div className="flex flex-wrap gap-4 mb-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-900/40 rounded border border-gray-700/40"></div>
                          <span className="text-white/70">Bezet</span>
                        </div>
                      </div>

                      {/* Mobile-optimized time grid */}
                      <div 
                        className="time-grid" 
                        ref={timeGridRef}
                        role="grid" 
                        aria-label="Beschikbare tijden"
                      >
                        {availableTimes.map((time, index) => (
                          <motion.button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            onKeyDown={(e) => handleTimeKeyDown(e, index, time)}
                            tabIndex={0}
                            whileHover={!isLowEnd ? { scale: 1.05 } : {}}
                            whileTap={!isLowEnd ? { scale: 0.95 } : {}}
                            className={`
                              time-slot
                              ${selectedTime === time
                                ? 'bg-[#0066cc] border-[#0066cc] text-white'
                                : 'bg-green-500/60 hover:bg-green-500/80 text-white border-green-500/40 cursor-pointer'}
                            `}
                            aria-label={`${time} - ${selectedTime === time ? 'Geselecteerd' : 'Beschikbaar'}`}
                            aria-selected={selectedTime === time}
                            role="gridcell"
                          >
                            <span className="text-base sm:text-lg font-semibold">
                              {time}
                            </span>
                            {selectedTime === time && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 bg-[#0066cc]/20 animate-pulse pointer-events-none rounded-lg"
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>

                      <div className="mt-4 text-sm text-white/60 text-center">
                        <p>Gebruik Tab om door de tijden te navigeren, pijltjestoetsen om tijden te selecteren, en Enter om een tijd te kiezen.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}