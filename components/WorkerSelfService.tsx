'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Worker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  worker_availability: Availability[];
  worker_time_off: TimeOff[];
}

interface Availability {
  id: string;
  worker_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface TimeOff {
  id: string;
  worker_id: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
  is_full_day: boolean;
  created_at: string;
  updated_at: string;
}

const DAYS_OF_WEEK = [
  'Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'
];

export default function WorkerSelfService() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'availability' | 'timeoff'>('availability');
  const [workerEmail, setWorkerEmail] = useState('');

  // Form states
  const [newAvailability, setNewAvailability] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    is_available: true
  });

  const [newTimeOff, setNewTimeOff] = useState({
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    reason: '',
    is_full_day: true
  });

  const findWorkerByEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/worker-schedule');
      const data = await response.json();
      
      if (data.ok) {
        const foundWorker = data.workers.find((w: Worker) => w.email.toLowerCase() === email.toLowerCase());
        if (foundWorker) {
          setWorker(foundWorker);
          setMessage('');
        } else {
          setMessage('Geen werknemer gevonden met dit e-mailadres');
        }
      } else {
        setMessage('Fout bij het laden van werknemers: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      setMessage('Fout bij het laden van werknemers');
    } finally {
      setIsLoading(false);
    }
  };

  const addAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_availability',
          worker_id: worker.id,
          ...newAvailability
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Beschikbaarheid toegevoegd');
        setNewAvailability({ day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true });
        findWorkerByEmail(worker.email);
      } else {
        setMessage('Fout bij toevoegen beschikbaarheid: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding availability:', error);
      setMessage('Fout bij toevoegen beschikbaarheid');
    } finally {
      setIsSaving(false);
    }
  };

  const addTimeOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_time_off',
          worker_id: worker.id,
          ...newTimeOff
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Vrije tijd toegevoegd');
        setNewTimeOff({ start_date: '', end_date: '', start_time: '', end_time: '', reason: '', is_full_day: true });
        findWorkerByEmail(worker.email);
      } else {
        setMessage('Fout bij toevoegen vrije tijd: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding time off:', error);
      setMessage('Fout bij toevoegen vrije tijd');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAvailability = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze beschikbaarheid wilt verwijderen?')) return;

    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_availability',
          id
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Beschikbaarheid verwijderd');
        if (worker) {
          findWorkerByEmail(worker.email);
        }
      } else {
        setMessage('Fout bij verwijderen beschikbaarheid: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      setMessage('Fout bij verwijderen beschikbaarheid');
    }
  };

  const deleteTimeOff = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze vrije tijd wilt verwijderen?')) return;

    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_time_off',
          id
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Vrije tijd verwijderd');
        if (worker) {
          findWorkerByEmail(worker.email);
        }
      } else {
        setMessage('Fout bij verwijderen vrije tijd: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting time off:', error);
      setMessage('Fout bij verwijderen vrije tijd');
    }
  };

  if (!worker) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Werknemer Login</h1>
          
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); findWorkerByEmail(workerEmail); }} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-white/80 mb-2">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
                placeholder="jouw@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Zoeken...' : 'Inloggen'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Mijn Rooster</h1>
        <button
          onClick={() => setWorker(null)}
          className="text-white/60 hover:text-white transition-colors"
        >
          Uitloggen
        </button>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-white"
        >
          {message}
        </motion.div>
      )}

      {/* Worker Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Welkom, {worker.name}
        </h2>
        <div className="text-white/60 space-y-1">
          <div>E-mail: {worker.email}</div>
          {worker.phone && <div>Telefoon: {worker.phone}</div>}
          <div>Status: {worker.is_active ? 'Actief' : 'Inactief'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'availability'
                ? 'bg-blue-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Mijn Beschikbaarheid
          </button>
          <button
            onClick={() => setActiveTab('timeoff')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'timeoff'
                ? 'bg-blue-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Vrije Tijd Aanvragen
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'availability' ? (
            <motion.div
              key="availability"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Add Availability Form */}
              <form onSubmit={addAvailability} className="space-y-4">
                <h3 className="text-lg font-medium text-white">Nieuwe Beschikbaarheid Toevoegen</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={newAvailability.day_of_week}
                    onChange={(e) => setNewAvailability({ ...newAvailability, day_of_week: parseInt(e.target.value) })}
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {DAYS_OF_WEEK.map((day, index) => (
                      <option key={index} value={index} className="bg-gray-800">
                        {day}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={newAvailability.start_time}
                    onChange={(e) => setNewAvailability({ ...newAvailability, start_time: e.target.value })}
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                  <input
                    type="time"
                    value={newAvailability.end_time}
                    onChange={(e) => setNewAvailability({ ...newAvailability, end_time: e.target.value })}
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Toevoegen...' : 'Toevoegen'}
                  </button>
                </div>
              </form>

              {/* Current Availability */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Mijn Huidige Beschikbaarheid</h3>
                <div className="space-y-2">
                  {worker.worker_availability.map((av) => (
                    <div
                      key={av.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="text-white">
                        <div className="font-medium">{DAYS_OF_WEEK[av.day_of_week]}</div>
                        <div className="text-white/60 text-sm">
                          {av.start_time} - {av.end_time}
                        </div>
                        <div className="text-white/40 text-xs">
                          {av.is_available ? 'Beschikbaar' : 'Niet beschikbaar'}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAvailability(av.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Verwijderen
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="timeoff"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Add Time Off Form */}
              <form onSubmit={addTimeOff} className="space-y-4">
                <h3 className="text-lg font-medium text-white">Vrije Tijd Aanvragen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newTimeOff.start_date}
                    onChange={(e) => setNewTimeOff({ ...newTimeOff, start_date: e.target.value })}
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                  <input
                    type="date"
                    value={newTimeOff.end_date}
                    onChange={(e) => setNewTimeOff({ ...newTimeOff, end_date: e.target.value })}
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={newTimeOff.is_full_day}
                      onChange={(e) => setNewTimeOff({ ...newTimeOff, is_full_day: e.target.checked })}
                      className="mr-2"
                    />
                    Hele dag
                  </label>
                </div>
                {!newTimeOff.is_full_day && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="time"
                      value={newTimeOff.start_time}
                      onChange={(e) => setNewTimeOff({ ...newTimeOff, start_time: e.target.value })}
                      className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                    <input
                      type="time"
                      value={newTimeOff.end_time}
                      onChange={(e) => setNewTimeOff({ ...newTimeOff, end_time: e.target.value })}
                      className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Reden (optioneel)"
                  value={newTimeOff.reason}
                  onChange={(e) => setNewTimeOff({ ...newTimeOff, reason: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Aanvragen...' : 'Vrije Tijd Aanvragen'}
                </button>
              </form>

              {/* Current Time Off */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Mijn Vrije Tijd</h3>
                <div className="space-y-2">
                  {worker.worker_time_off.map((to) => {
                    const startDate = new Date(to.start_date);
                    const endDate = new Date(to.end_date);
                    const isSameDay = startDate.getTime() === endDate.getTime();
                    
                    return (
                      <div
                        key={to.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="text-white">
                          <div className="font-medium">
                            {isSameDay 
                              ? startDate.toLocaleDateString('nl-NL', { 
                                  weekday: 'long', 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })
                              : `${startDate.toLocaleDateString('nl-NL', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })} - ${endDate.toLocaleDateString('nl-NL', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}`
                            }
                          </div>
                          {!to.is_full_day && to.start_time && to.end_time && (
                            <div className="text-white/60 text-sm">
                              {to.start_time} - {to.end_time}
                            </div>
                          )}
                          {to.is_full_day && (
                            <div className="text-white/40 text-xs">Hele dag</div>
                          )}
                          {to.reason && (
                            <div className="text-white/60 text-sm">{to.reason}</div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTimeOff(to.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
