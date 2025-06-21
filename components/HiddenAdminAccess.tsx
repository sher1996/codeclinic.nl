'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminCalendar from './AdminCalendar';

export default function HiddenAdminAccess() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [keySequence, setKeySequence] = useState('');

  // Simple admin password - in production, this should be more secure
  const ADMIN_PASSWORD = 'admin123'; // You can change this password

  // Check for admin access via URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    if (adminParam === 'true') {
      setShowPasswordModal(true);
    }
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Secret key sequence: Ctrl + Alt + A
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        if (isAuthenticated) {
          setShowAdmin(true);
        } else {
          setShowPasswordModal(true);
        }
      }

      // Alternative: Type "admin" to trigger
      setKeySequence(prev => {
        const newSequence = prev + (event.key?.toLowerCase() || '');
        if (newSequence.includes('admin')) {
          if (isAuthenticated) {
            setShowAdmin(true);
          } else {
            setShowPasswordModal(true);
          }
          return '';
        }
        // Keep only last 5 characters to prevent memory buildup
        return newSequence.slice(-5);
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setShowAdmin(true);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdmin(false);
  };

  return (
    <>
      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700 relative z-[100000]"
            >
              <h3 className="text-xl font-bold text-white mb-4">Admin Access</h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter admin password"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Calendar Dashboard */}
      <AdminCalendar 
        isVisible={showAdmin} 
        onClose={() => {
          setShowAdmin(false);
          handleLogout();
        }} 
      />
    </>
  );
} 