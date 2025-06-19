'use client';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ ok: boolean; message: string }>({ ok: false, message: '' });
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

  const weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Debug: Check if we have a selected date
      console.log('[AppointmentCalendar] Selected date:', selectedDate);
      console.log('[AppointmentCalendar] Selected time:', selectedTime);
      
      if (!selectedDate) {
        throw new Error('Geen datum geselecteerd');
      }

      // 1. Create / confirm booking in DB
      const dateString = selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd format
      console.log('[AppointmentCalendar] Formatted date string:', dateString);
      
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: dateString,
        time: selectedTime || '',
        notes: formData.notes
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

      // 2. Fire off e-mail
      const emailData = {
        name: formData.name,
        email: formData.email,
        date: dateString,
        time: selectedTime || '',
        address: `${formData.street} ${formData.houseNumber}, ${formData.postalCode} ${formData.city}`,
        bookingId: bookingResult.booking.id
      };

      console.log('[AppointmentCalendar] Sending email:', emailData);

      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (!emailRes.ok) {
        const errorData = await emailRes.json();
        console.error('[AppointmentCalendar] Email failed:', errorData);
        const errorMessage = errorData.error || 'Mail service failed';
        const details = errorData.details ? ` (${errorData.details})` : '';
        throw new Error(`${errorMessage}${details}`);
      }

      const emailResult = await emailRes.json();
      console.log('[AppointmentCalendar] Email sent:', emailResult);

      setSubmitStatus({ ok: true, message: 'Afspraak succesvol ingepland!' });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          street: '',
          houseNumber: '',
          postalCode: '',
          city: '',
          notes: ''
        });
        setSelectedDate(null);
        setSelectedTime(null);
        setSubmitStatus({ ok: false, message: '' });
      }, 2000);
    } catch (err: any) {
      console.error('[AppointmentCalendar] Error:', err);
      setSubmitStatus({ ok: false, message: err.message || 'Er is een fout opgetreden.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDateCompact = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    });
  };

  const formatDateShort = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  // Generate days for the current month
  const days = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  })();

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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24 lg:px-8">
        <div className={`mx-auto max-w-2xl rounded-2xl ${isLowEnd ? 'bg-white/5' : 'ring-1 ring-white/10'} lg:mx-0 lg:flex lg:max-w-none`}>
          <div className="p-4 sm:p-8 lg:flex-auto">
            <div className={`w-full max-w-4xl mx-auto ${isLowEnd ? 'bg-white/5' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-4 sm:p-6 shadow-xl`}>
              <AnimatePresence mode="wait">
                {!selectedDate ? (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-colors text-lg sm:text-xl"
                      >
                        ←
                      </button>
                      <h2 className="text-lg sm:text-xl font-semibold text-center">
                        {formatMonthYear(currentDate)}
                      </h2>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 sm:p-3 hover:bg-white/10 rounded-lg transition-colors text-lg sm:text-xl"
                      >
                        →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {weekDays.map(day => (
                        <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 p-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {days.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day)}
                          className={`
                            aspect-square p-1 sm:p-2 rounded-lg text-center transition-colors relative min-h-[40px] sm:min-h-[50px]
                            ${!day ? 'opacity-0' : ''}
                            ${day && isSelected(day) ? 'bg-blue-500 text-white' : ''}
                            ${day && isToday(day) && !isSelected(day) ? 'bg-blue-500/20' : ''}
                            ${day && !isSelected(day) && !isToday(day) ? 'hover:bg-white/10' : ''}
                          `}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-sm sm:text-base font-medium">{day?.getDate()}</span>
                            {day && isToday(day) && (
                              <span className="text-xs text-[#00d4ff] font-medium mt-0.5">Vandaag</span>
                            )}
                          </div>
                          {day && isToday(day) && (
                            <div className="absolute inset-0 rounded-lg bg-[#00d4ff]/20 animate-pulse pointer-events-none" />
                          )}
                        </button>
                      ))}
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
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <button
                        onClick={() => setSelectedTime(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                      >
                        ← Terug naar tijden
                      </button>
                      <div className="text-center">
                        <h2 className="text-base sm:text-lg font-semibold">Afspraak maken</h2>
                      </div>
                    </div>

                    <div className={`${isLowEnd ? 'bg-transparent' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-4 sm:p-6 border border-white/10`}>
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-white/60">Geselecteerde tijd</p>
                        <p className="text-base sm:text-lg font-medium">{selectedTime}</p>
                        <p className="text-sm text-white/60">{formatDateShort(selectedDate)}</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Naam</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Telefoon</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Straat</label>
                            <input
                              type="text"
                              name="street"
                              value={formData.street}
                              onChange={handleInputChange}
                              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Huisnummer</label>
                            <input
                              type="text"
                              name="houseNumber"
                              value={formData.houseNumber}
                              onChange={handleInputChange}
                              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Postcode</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="1234 AB"
                              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Plaats</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#00d4ff]">Opmerkingen</label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-base"
                            rows={3}
                          />
                        </div>
                        
                        <div className="relative">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                              w-full py-4 px-4 rounded-lg font-medium transition-all duration-200 text-base
                              ${isSubmitting 
                                ? 'bg-white/20 cursor-not-allowed' 
                                : 'bg-[#00d4ff] hover:bg-[#00b8e6] text-white'}
                            `}
                          >
                            {isSubmitting ? 'Bezig met verwerken...' : 'Afspraak maken'}
                          </button>

                          <AnimatePresence>
                            {submitStatus.ok && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-lg"
                              >
                                <div className="text-center">
                                  <p className="text-green-400 font-medium">{submitStatus.message}</p>
                                </div>
                              </motion.div>
                            )}

                            {submitStatus.message && !submitStatus.ok && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-lg"
                              >
                                <div className="text-center">
                                  <p className="text-red-400 font-medium">{submitStatus.message}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                      >
                        ← Terug
                      </button>
                      <div className="text-center">
                        <h2 className="text-base sm:text-lg font-semibold">
                          {formatDateShort(selectedDate)}
                        </h2>
                      </div>
                    </div>

                    <div className={`${isLowEnd ? 'bg-transparent' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-4 sm:p-6 border border-white/10`}>
                      <h3 className="text-base font-medium mb-4 text-[#00d4ff]">
                        Beschikbare tijden
                      </h3>

                      {/* Mobile-optimized time grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {Array.from({ length: 8 }, (_, i) => i + 9).map((hour, index) => (
                          <React.Fragment key={hour}>
                            <motion.button
                              onClick={() => handleTimeSelect(`${hour.toString().padStart(2, '0')}:00`)}
                              whileHover={!isLowEnd ? { scale: 1.02 } : {}}
                              whileTap={!isLowEnd ? { scale: 0.98 } : {}}
                              className={`
                                p-3 sm:p-4 rounded-lg transition-all duration-200 relative text-center
                                ${selectedTime === `${hour.toString().padStart(2, '0')}:00`
                                  ? 'bg-[#00d4ff] text-white'
                                  : 'bg-white/5 hover:bg-white/10 text-white'}
                              `}
                            >
                              <span className="text-sm sm:text-base font-medium">
                                {hour}:00
                              </span>
                              {selectedTime === `${hour.toString().padStart(2, '0')}:00` && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse pointer-events-none rounded-lg"
                                />
                              )}
                            </motion.button>
                            
                            <motion.button
                              onClick={() => handleTimeSelect(`${hour.toString().padStart(2, '0')}:30`)}
                              whileHover={!isLowEnd ? { scale: 1.02 } : {}}
                              whileTap={!isLowEnd ? { scale: 0.98 } : {}}
                              className={`
                                p-3 sm:p-4 rounded-lg transition-all duration-200 relative text-center
                                ${selectedTime === `${hour.toString().padStart(2, '0')}:30`
                                  ? 'bg-[#00d4ff] text-white'
                                  : 'bg-white/5 hover:bg-white/10 text-white'}
                              `}
                            >
                              <span className="text-sm sm:text-base font-medium">
                                {hour}:30
                              </span>
                              {selectedTime === `${hour.toString().padStart(2, '0')}:30` && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse pointer-events-none rounded-lg"
                                />
                              )}
                            </motion.button>
                          </React.Fragment>
                        ))}
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