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
}

export default function AdminCalendar({ isVisible, onClose }: AdminCalendarProps) {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden relative z-[100000]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Admin Calendar Dashboard</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Statistics
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
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'today' | 'upcoming' | 'past')}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="all">All Bookings</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>

                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    placeholder="Filter by date"
                  />

                  <button
                    onClick={fetchBookings}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                <button
                  onClick={clearAllBookings}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Clear All Bookings
                </button>
              </div>

              {/* Bookings List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-lg">No bookings found</p>
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
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(booking.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === booking.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg"
                        >
                          <p className="text-red-300 mb-2">Are you sure you want to delete this booking?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
                            >
                              Cancel
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
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative z-[100002]"
              >
                <h3 className="text-xl font-bold text-white mb-4">Edit Booking</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                    <select
                      value={editForm.time}
                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    >
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={updateBooking}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  >
                    Update Booking
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedBooking(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    Cancel
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