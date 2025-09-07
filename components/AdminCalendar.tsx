'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStats from './AdminStats';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminCalendarProps {
  isVisible: boolean;
  onClose: () => void;
  currentUser?: {
    id: string;
    email: string;
    name: string;
    reason?: string;
    status: 'pending' | 'approved' | 'denied';
    created_at: string;
    updated_at: string;
  } | null;
}

export default function AdminCalendar({ isVisible, onClose, currentUser }: AdminCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'stats'>('bookings');

  // Fetch all bookings
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calendar');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchBookings();
    }
  }, [isVisible]);

  // Clear all bookings
  const clearAllBookings = async () => {
    if (!confirm('Are you sure you want to clear ALL bookings? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/calendar/clear', { method: 'POST' });
      if (response.ok) {
        setBookings([]);
        alert('All bookings cleared successfully');
      }
    } catch (error) {
      console.error('Failed to clear bookings:', error);
      alert('Failed to clear bookings');
    }
  };

  // Delete individual booking
  const deleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/calendar/${bookingId}`, { method: 'DELETE' });
      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== bookingId));
        setShowDeleteConfirm(null);
        alert('Booking deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking');
    }
  };

  // Update booking
  const updateBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(`/api/calendar/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(bookings.map(b => b.id === selectedBooking.id ? updatedBooking.booking : b));
        setIsEditing(false);
        setSelectedBooking(null);
        alert('Booking updated successfully');
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking');
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterDate && booking.date !== filterDate) return false;

    switch (filterStatus) {
      case 'today':
        return bookingDate.getTime() === today.getTime();
      case 'upcoming':
        return bookingDate > today;
      case 'past':
        return bookingDate < today;
      default:
        return true;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Start editing a booking
  const startEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      notes: booking.notes || ''
    });
    setIsEditing(true);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-calendar-title"
      aria-describedby="admin-calendar-description"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden relative z-[100000]"
      >
        {/* Header */}
        <div id="admin-calendar-description" className="sr-only">Admin dashboard voor het beheren van afspraken en statistieken</div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 id="admin-calendar-title" className="text-2xl font-bold">Admin Kalender Dashboard</h2>
              {currentUser && (
                <p className="text-blue-100 text-sm mt-1">
                  👤 Logged in as: {currentUser.name} ({currentUser.email})
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none"
              aria-label="Sluit admin dashboard"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'bookings' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label="Bekijk alle boekingen"
            >
              Boekingen
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'stats' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label="Bekijk statistieken"
            >
              Statistieken
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          {activeTab === 'stats' ? (
            <AdminStats bookings={bookings} />
          ) : (
            <>
              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label htmlFor="filter-date" className="block text-sm font-medium text-gray-300 mb-1">
                      Filter op datum
                    </label>
                    <input
                      id="filter-date"
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="filter-status" className="block text-sm font-medium text-gray-300 mb-1">
                      Filter op status
                    </label>
                    <select
                      id="filter-status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'today' | 'upcoming' | 'past')}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="all">Alle afspraken</option>
                      <option value="today">Vandaag</option>
                      <option value="upcoming">Aankomend</option>
                      <option value="past">Verstreken</option>
                    </select>
                  </div>

                  <button
                    onClick={fetchBookings}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                <button
                  onClick={clearAllBookings}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                  aria-label="Verwijder alle boekingen - deze actie kan niet ongedaan worden gemaakt"
                >
                  Alle boekingen verwijderen
                </button>
              </div>

              {/* Bookings List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-32" role="status" aria-live="polite">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="sr-only">Laden van boekingen...</span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-lg">Geen boekingen gevonden</p>
                  <p className="text-sm mt-2">Er zijn momenteel geen afspraken geboekt.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-white">{booking.name}</h3>
                            <span className="text-sm text-gray-400">{booking.email}</span>
                            <span className="text-sm text-gray-400">{booking.phone}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span><span role="img" aria-label="Kalender icoon">📅</span> {formatDate(booking.date)}</span>
                            <span><span role="img" aria-label="Klok icoon">🕐</span> {formatTime(booking.time)}</span>
                            <span><span role="img" aria-label="Notitie icoon">📝</span> {booking.notes || 'No notes'}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(booking)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            aria-label={`Bewerk afspraak van ${booking.name} op ${formatDate(booking.date)} om ${formatTime(booking.time)}`}
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(booking.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                            aria-label={`Verwijder afspraak van ${booking.name} op ${formatDate(booking.date)} om ${formatTime(booking.time)}`}
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === booking.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg"
                          role="alert"
                          aria-live="assertive"
                        >
                          <p className="text-red-300 mb-2">Weet u zeker dat u deze afspraak wilt verwijderen?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                              aria-label="Bevestig verwijdering van deze afspraak"
                            >
                              Verwijderen bevestigen
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
                              aria-label="Annuleer verwijdering van deze afspraak"
                            >
                              Annuleren
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100001] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-booking-title"
              aria-describedby="edit-booking-description"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative z-[100002]"
              >
                <h3 id="edit-booking-title" className="text-xl font-bold text-white mb-4">Edit Booking</h3>
                
                <div id="edit-booking-description" className="sr-only">Formulier voor het bewerken van een afspraak</div>
                <form onSubmit={(e) => { e.preventDefault(); updateBooking(); }} className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-1">
                      Naam <span className="text-red-400" aria-label="verplicht veld">*</span>
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      aria-required="true"
                      placeholder="Voor- en achternaam"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-300 mb-1">
                      E-mailadres <span className="text-red-400" aria-label="verplicht veld">*</span>
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      aria-required="true"
                      placeholder="naam@gmail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Telefoonnummer <span className="text-red-400" aria-label="verplicht veld">*</span>
                    </label>
                    <input
                      id="edit-phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      aria-required="true"
                      placeholder="0612345678"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-300 mb-1">
                      Datum <span className="text-red-400" aria-label="verplicht veld">*</span>
                    </label>
                    <input
                      id="edit-date"
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      aria-required="true"
                      aria-describedby="date-help"
                    />
                    <p id="date-help" className="text-xs text-gray-400 mt-1">
                      Kies een datum in het formaat DD-MM-YYYY
                    </p>
                  </div>

                  <div>
                    <label htmlFor="edit-time" className="block text-sm font-medium text-gray-300 mb-1">
                      Tijd <span className="text-red-400" aria-label="verplicht veld">*</span>
                    </label>
                    <select
                      id="edit-time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      aria-required="true"
                    >
                      <option value="">Selecteer een tijd</option>
                      {Array.from({ length: 8 }, (_, i) => i + 9).map((hour) => (
                        <React.Fragment key={hour}>
                          <option value={`${hour.toString().padStart(2, '0')}:00`}>
                            {hour}:00
                          </option>
                          <option value={`${hour.toString().padStart(2, '0')}:30`}>
                            {hour}:30
                          </option>
                        </React.Fragment>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-300 mb-1">
                      Notities <span className="text-sm text-gray-400 font-normal">(optioneel)</span>
                    </label>
                    <textarea
                      id="edit-notes"
                      value={editForm.notes}
                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={3}
                      placeholder="Optionele notities over de afspraak..."
                      aria-describedby="notes-help"
                    />
                    <p id="notes-help" className="text-xs text-gray-400 mt-1">
                      Optioneel: Beschrijf het probleem of specifieke wensen
                    </p>
                  </div>
                </form>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={updateBooking}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label="Boeking bijwerken"
                  >
                    Boeking bijwerken
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedBooking(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    aria-label="Annuleren"
                  >
                    Annuleren
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 