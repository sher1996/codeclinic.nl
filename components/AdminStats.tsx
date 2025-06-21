'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

interface AdminStatsProps {
  bookings: Booking[];
}

export default function AdminStats({ bookings }: AdminStatsProps) {
  // Calculate statistics
  const totalBookings = bookings.length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getTime() === today.getTime();
  }).length;
  
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate > today;
  }).length;
  
  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate < today;
  }).length;

  // Get most popular time slots
  const timeSlotCounts = bookings.reduce((acc, booking) => {
    acc[booking.time] = (acc[booking.time] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularTimeSlots = Object.entries(timeSlotCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Get recent bookings (last 5)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      color: 'from-blue-500 to-blue-600',
      icon: '📊'
    },
    {
      title: 'Today',
      value: todayBookings,
      color: 'from-green-500 to-green-600',
      icon: '📅'
    },
    {
      title: 'Upcoming',
      value: upcomingBookings,
      color: 'from-yellow-500 to-yellow-600',
      icon: '⏰'
    },
    {
      title: 'Past',
      value: pastBookings,
      color: 'from-gray-500 to-gray-600',
      icon: '📝'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-gradient-to-r ${stat.color} rounded-lg p-4 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popular Time Slots */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Most Popular Time Slots</h3>
        <div className="space-y-2">
          {popularTimeSlots.length > 0 ? (
            popularTimeSlots.map(([time, count]) => (
              <div key={time} className="flex justify-between items-center">
                <span className="text-gray-300">{time}</span>
                <span className="text-blue-400 font-medium">{count} bookings</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No bookings yet</p>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Bookings</h3>
        <div className="space-y-2">
          {recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-white font-medium">{booking.name}</span>
                  <span className="text-gray-400 ml-2">{booking.date} {booking.time}</span>
                </div>
                <span className="text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
} 