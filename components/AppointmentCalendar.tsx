'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentCalendarProps {
  onDateSelect?: (date: Date) => void;
  appointmentType?: 'onsite' | 'remote';
}

export default function AppointmentCalendar({ onDateSelect, appointmentType = 'onsite' }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
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

  // Fetch booked times when a date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchBookedTimes(selectedDate);
    } else {
      setBookedTimes([]);
    }
  }, [selectedDate]);

  const fetchBookedTimes = async (date: Date) => {
    setIsLoadingBookings(true);
    try {
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      const response = await fetch('/api/calendar');
      if (response.ok) {
        const data = await response.json();
        const bookedForDate = data.bookings
          .filter((booking: { date: string; time: string }) => booking.date === dateString)
          .map((booking: { date: string; time: string }) => booking.time);
        setBookedTimes(bookedForDate);
      }
    } catch (error) {
      console.error('Failed to fetch booked times:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

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
      setSelectedTime(null); // Reset time selection when date changes
      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    // Don't allow selection of booked times
    if (bookedTimes.includes(time)) {
      return;
    }
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

      // 2. Fire off e-mail
      const emailData = {
        name: formData.name,
        email: formData.email,
        date: dateString,
        time: selectedTime || '',
        address: `${formData.street} ${formData.houseNumber}, ${formData.postalCode} ${formData.city}`,
        bookingId: bookingResult.booking.id,
        appointmentType: appointmentType
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
      
      // Refresh booked times to show the new booking
      if (selectedDate) {
        await fetchBookedTimes(selectedDate);
      }
      
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
      }, 2000);
    } catch (err: unknown) {
      console.error('[AppointmentCalendar] Error:', err);
      // You could add a toast notification here if needed
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

  const isPastDate = (date: Date) => {
    // Get today's date at midnight (start of day)
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Set input date to midnight for proper comparison
    const inputDateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // A date is past if it's before or equal to today (including today)
    return inputDateMidnight <= todayDate;
  };

  const isPastTime = (date: Date, time: string) => {
    const today = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    return slotTime <= today;
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
                  >
                    <div className="flex justify-between items-center mb-3 sm:mb-6">
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

                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                      {days.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day)}
                          disabled={day ? isPastDate(day) : false}
                          className={`
                            calendar-day
                            ${!day ? 'opacity-0' : ''}
                            ${day && isPastDate(day) ? 'opacity-30 cursor-not-allowed bg-gray-600/20' : ''}
                            ${day && !isPastDate(day) && isSelected(day) ? 'bg-[#00d4ff] text-white' : ''}
                            ${day && !isPastDate(day) && !isSelected(day) ? 'hover:bg-white/10' : ''}
                          `}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-base sm:text-lg font-semibold">{day?.getDate()}</span>
                          </div>
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
                    <div className="flex items-center justify-between mb-3 sm:mb-6">
                      <button
                        onClick={() => setSelectedTime(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
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

                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="form-label">Naam</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Telefoon</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="form-label">Straat</label>
                            <input
                              type="text"
                              name="street"
                              value={formData.street}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label">Huisnummer</label>
                            <input
                              type="text"
                              name="houseNumber"
                              value={formData.houseNumber}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="form-label">Postcode</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="1234 AB"
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label">Plaats</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Notities (optioneel)</label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="form-input"
                            placeholder="Beschrijf uw probleem of specifieke wensen..."
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary w-full text-xl py-5"
                        >
                          {isSubmitting ? 'Bezig met boeken...' : `${appointmentType === 'remote' ? 'Remote hulp' : 'Aan huis bezoek'} bevestigen`}
                        </button>
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
                      <h3 className="text-base font-medium mb-3 sm:mb-4 text-[#00d4ff]">
                        Beschikbare tijden
                      </h3>

                      {/* Loading state */}
                      {isLoadingBookings && (
                        <div className="flex justify-center mb-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00d4ff]"></div>
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
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {Array.from({ length: 8 }, (_, i) => i + 9).map((hour) => (
                          <React.Fragment key={hour}>
                            {!isPastTime(selectedDate!, `${hour.toString().padStart(2, '0')}:00`) && (
                              <motion.button
                                onClick={() => handleTimeSelect(`${hour.toString().padStart(2, '0')}:00`)}
                                disabled={bookedTimes.includes(`${hour.toString().padStart(2, '0')}:00`)}
                                whileHover={!isLowEnd && !bookedTimes.includes(`${hour.toString().padStart(2, '0')}:00`) ? { scale: 1.05 } : {}}
                                whileTap={!isLowEnd && !bookedTimes.includes(`${hour.toString().padStart(2, '0')}:00`) ? { scale: 0.95 } : {}}
                                className={`
                                  time-slot
                                  ${bookedTimes.includes(`${hour.toString().padStart(2, '0')}:00`)
                                    ? 'bg-gray-900/40 border-gray-700/40 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500/60 hover:bg-green-500/80 text-white border-green-500/40 cursor-pointer'}
                                `}
                              >
                                <span className="text-base sm:text-lg font-semibold">
                                  {hour}:00
                                </span>
                                {selectedTime === `${hour.toString().padStart(2, '0')}:00` && !bookedTimes.includes(`${hour.toString().padStart(2, '0')}:00`) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse pointer-events-none rounded-lg"
                                  />
                                )}
                              </motion.button>
                            )}
                            
                            {!isPastTime(selectedDate!, `${hour.toString().padStart(2, '0')}:30`) && (
                              <motion.button
                                onClick={() => handleTimeSelect(`${hour.toString().padStart(2, '0')}:30`)}
                                disabled={bookedTimes.includes(`${hour.toString().padStart(2, '0')}:30`)}
                                whileHover={!isLowEnd && !bookedTimes.includes(`${hour.toString().padStart(2, '0')}:30`) ? { scale: 1.05 } : {}}
                                whileTap={!isLowEnd && !bookedTimes.includes(`${hour.toString().padStart(2, '0')}:30`) ? { scale: 0.95 } : {}}
                                className={`
                                  time-slot
                                  ${bookedTimes.includes(`${hour.toString().padStart(2, '0')}:30`)
                                    ? 'bg-gray-900/40 border-gray-700/40 text-gray-500 cursor-not-allowed'
                                    : selectedTime === `${hour.toString().padStart(2, '0')}:30`
                                    ? 'bg-[#00d4ff] border-[#00d4ff] text-white'
                                    : 'bg-green-500/60 hover:bg-green-500/80 text-white border-green-500/40'}
                                `}
                              >
                                <span className="text-base sm:text-lg font-semibold">
                                  {hour}:30
                                </span>
                                {selectedTime === `${hour.toString().padStart(2, '0')}:30` && !bookedTimes.includes(`${hour.toString().padStart(2, '0')}:30`) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse pointer-events-none rounded-lg"
                                  />
                                )}
                              </motion.button>
                            )}
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