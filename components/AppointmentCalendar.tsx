import React, { useState } from 'react';
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

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ onDateSelect }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl min-h-[600px]">
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

            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                  <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
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
                        className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                        className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                        className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                        className="w-full p-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
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
                            className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-lg"
                          >
                            <div className="text-center">
                              <p className="text-green-400 font-medium">{submitStatus.message}</p>
                            </div>
                          </motion.div>
                        )}

                        {!submitStatus.ok && (
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
                  </motion.form>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentCalendar; 