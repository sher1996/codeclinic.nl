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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({
        ok: true,
        message: 'Afspraak succesvol ingepland!'
      });
      
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
    } catch (error) {
      setSubmitStatus({
        ok: false,
        message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
      });
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

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className={`mx-auto max-w-2xl rounded-2xl ${isLowEnd ? 'bg-white/5' : 'ring-1 ring-white/10'} lg:mx-0 lg:flex lg:max-w-none`}>
          <div className="p-8 sm:p-10 lg:flex-auto">
            <div className={`w-full max-w-4xl mx-auto ${isLowEnd ? 'bg-white/5' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-6 shadow-xl min-h-[600px]`}>
              <AnimatePresence>
                {!selectedDate ? (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        ←
                      </button>
                      <h2 className="text-xl font-semibold">
                        {formatMonthYear(currentDate)}
                      </h2>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {days.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day)}
                          className={`
                            p-2 rounded-lg text-center transition-colors relative
                            ${!day ? 'opacity-0' : ''}
                            ${day && isSelected(day) ? 'bg-blue-500 text-white' : ''}
                            ${day && isToday(day) && !isSelected(day) ? 'bg-blue-500/20' : ''}
                            ${day && !isSelected(day) && !isToday(day) ? 'hover:bg-white/10' : ''}
                          `}
                        >
                          <div className="flex flex-col items-center">
                            <span>{day?.getDate()}</span>
                            {day && isToday(day) && (
                              <span className="text-xs text-[#00d4ff] font-medium mt-1">Vandaag</span>
                            )}
                          </div>
                          {day && isToday(day) && (
                            <div className="absolute inset-0 rounded-lg bg-[#00d4ff]/20 animate-pulse pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="time-slots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                      >
                        ← Terug naar kalender
                      </button>
                      <h2 className="text-xl font-semibold">
                        {formatDate(selectedDate)}
                      </h2>
                    </div>

                    <div className={`${isLowEnd ? 'bg-transparent' : 'bg-white/5 backdrop-blur-sm'} rounded-xl p-6 border border-white/10`}>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <span className="text-[#00d4ff]">Dagplanning</span>
                        <span className="text-white/60">voor {formatDate(selectedDate)}</span>
                      </h3>

                      <div className="relative">
                        {/* Time markers */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col">
                          {Array.from({ length: 8 }, (_, i) => i + 9).map(hour => (
                            <div key={hour} className="h-24 flex items-center justify-end pr-4 text-sm text-white/40">
                              {hour}:00
                            </div>
                          ))}
                        </div>

                        {/* Time slots grid */}
                        <div className="ml-16 border-l border-white/10">
                          {Array.from({ length: 8 }, (_, i) => i + 9).map(hour => (
                            <div key={hour} className="h-24 border-b border-white/10 relative">
                              {/* Hour marker line */}
                              <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />
                              
                              {/* Time slots for this hour */}
                              <div className="absolute inset-0 flex">
                                <motion.button
                                  onClick={() => handleTimeSelect(`${hour.toString().padStart(2, '0')}:00`)}
                                  whileHover={!isLowEnd ? { scale: 1.02 } : {}}
                                  whileTap={!isLowEnd ? { scale: 0.98 } : {}}
                                  className={`
                                    flex-1 h-full transition-all duration-200 relative
                                    ${selectedTime === `${hour.toString().padStart(2, '0')}:00`
                                      ? 'bg-[#00d4ff] text-white'
                                      : 'hover:bg-white/5'}
                                  `}
                                >
                                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                                    {hour}:00
                                  </span>
                                  {selectedTime === `${hour.toString().padStart(2, '0')}:00` && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse pointer-events-none"
                                    />
                                  )}
                                </motion.button>
                                <motion.button
                                  onClick={() => handleTimeSelect(`${hour.toString().padStart(2, '0')}:30`)}
                                  whileHover={!isLowEnd ? { scale: 1.02 } : {}}
                                  whileTap={!isLowEnd ? { scale: 0.98 } : {}}
                                  className={`
                                    flex-1 h-full transition-all duration-200 relative
                                    ${selectedTime === `${hour.toString().padStart(2, '0')}:30`
                                      ? 'bg-[#00d4ff] text-white'
                                      : 'hover:bg-white/5'}
                                  `}
                                >
                                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                                    {hour}:30
                                  </span>
                                  {selectedTime === `${hour.toString().padStart(2, '0')}:30` && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse pointer-events-none"
                                    />
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Current time indicator */}
                        {selectedDate && isToday(selectedDate) && (
                          <div 
                            className="absolute left-0 right-0 h-px bg-[#00d4ff] pointer-events-none"
                            style={{
                              top: `${((new Date().getHours() - 9 + new Date().getMinutes() / 60) / 8) * 100}%`
                            }}
                          >
                            <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-[#00d4ff]" />
                          </div>
                        )}
                      </div>

                      {selectedTime && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-6"
                        >
                          <div className={`${isLowEnd ? 'bg-transparent' : 'bg-white/5'} rounded-lg p-4 mb-6 border border-white/10`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white/60">Geselecteerde tijd</p>
                                <p className="text-lg font-medium">{selectedTime}</p>
                              </div>
                              <button
                                onClick={() => setSelectedTime(null)}
                                className="text-white/60 hover:text-white transition-colors"
                              >
                                Wijzigen
                              </button>
                            </div>
                          </div>

                          <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium mb-1">Naam</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Email</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Telefoon</label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Straat</label>
                                <input
                                  type="text"
                                  name="street"
                                  value={formData.street}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Huisnummer</label>
                                <input
                                  type="text"
                                  name="houseNumber"
                                  value={formData.houseNumber}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Postcode</label>
                                <input
                                  type="text"
                                  name="postalCode"
                                  value={formData.postalCode}
                                  onChange={handleInputChange}
                                  placeholder="1234 AB"
                                  className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Plaats</label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Opmerkingen</label>
                              <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${isLowEnd ? 'bg-transparent' : 'bg-white/5'} border border-white/10 focus:border-blue-500 focus:outline-none`}
                                rows={3}
                              />
                            </div>
                            <div className="relative">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`
                                  w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
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
                                    className={`absolute inset-0 flex items-center justify-center ${isLowEnd ? 'bg-green-500/10' : 'bg-green-500/20 backdrop-blur-sm'} rounded-lg`}
                                  >
                                    <div className="text-center">
                                      <p className="text-green-400 font-medium">{submitStatus.message}</p>
                                    </div>
                                  </motion.div>
                                )}

                                {!submitStatus.ok && submitStatus.message && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`absolute inset-0 flex items-center justify-center ${isLowEnd ? 'bg-red-500/10' : 'bg-red-500/20 backdrop-blur-sm'} rounded-lg`}
                                  >
                                    <div className="text-center">
                                      <p className="text-red-400 font-medium">{submitStatus.message}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.form>
                        </motion.div>
                      )}
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