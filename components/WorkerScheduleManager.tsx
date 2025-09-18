'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Worker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  worker_availability: Availability[];
  worker_time_off: TimeOff[];
  worker_specific_availability: SpecificAvailability[];
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

interface SpecificAvailability {
  id: string;
  worker_id: string;
  availability_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  reason?: string;
  created_at: string;
  updated_at: string;
}

const DAYS_OF_WEEK = [
  'Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'
];

export default function WorkerScheduleManager() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'availability' | 'timeoff' | 'specific'>('availability');

  // Form states
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    phone: '',
    is_active: true
  });

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

  const [newSpecificAvailability, setNewSpecificAvailability] = useState({
    availability_date: '',
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
    reason: ''
  });

  const fetchWorkers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/worker-schedule');
      const data = await response.json();
      
      if (data.ok) {
        setWorkers(data.workers);
        if (data.workers.length > 0 && !selectedWorker) {
          setSelectedWorker(data.workers[0]);
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
  }, [selectedWorker]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const createWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_worker',
          ...newWorker
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Werknemer succesvol aangemaakt');
        setNewWorker({ name: '', email: '', phone: '', is_active: true });
        fetchWorkers();
      } else {
        setMessage('Fout bij aanmaken werknemer: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating worker:', error);
      setMessage('Fout bij aanmaken werknemer');
    } finally {
      setIsSaving(false);
    }
  };

  const addAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_availability',
          worker_id: selectedWorker.id,
          ...newAvailability
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Beschikbaarheid toegevoegd');
        setNewAvailability({ day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true });
        fetchWorkers();
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
    if (!selectedWorker) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_time_off',
          worker_id: selectedWorker.id,
          ...newTimeOff
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Vrije tijd toegevoegd');
        setNewTimeOff({ start_date: '', end_date: '', start_time: '', end_time: '', reason: '', is_full_day: true });
        fetchWorkers();
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

    setIsSaving(true);
    
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
        fetchWorkers();
      } else {
        setMessage('Fout bij verwijderen beschikbaarheid: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      setMessage('Fout bij verwijderen beschikbaarheid: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTimeOff = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze vrije tijd wilt verwijderen?')) return;

    setIsSaving(true);
    
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
        fetchWorkers();
      } else {
        setMessage('Fout bij verwijderen vrije tijd: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting time off:', error);
      setMessage('Fout bij verwijderen vrije tijd: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecificAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_specific_availability',
          worker_id: selectedWorker.id,
          ...newSpecificAvailability
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Specifieke beschikbaarheid toegevoegd');
        setNewSpecificAvailability({ 
          availability_date: '', 
          start_time: '09:00', 
          end_time: '17:00', 
          is_available: true, 
          reason: '' 
        });
        fetchWorkers();
      } else {
        setMessage('Fout bij toevoegen specifieke beschikbaarheid: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding specific availability:', error);
      setMessage('Fout bij toevoegen specifieke beschikbaarheid');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSpecificAvailability = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze specifieke beschikbaarheid wilt verwijderen?')) return;

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/worker-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_specific_availability',
          id
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('Specifieke beschikbaarheid verwijderd');
        fetchWorkers();
      } else {
        setMessage('Fout bij verwijderen specifieke beschikbaarheid: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting specific availability:', error);
      setMessage('Fout bij verwijderen specifieke beschikbaarheid: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Werknemer Roosters Beheren</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Werknemers</h2>
          
          {/* Add New Worker Form */}
          <form onSubmit={createWorker} className="mb-6 space-y-4">
            <h3 className="text-lg font-medium text-white/80">Nieuwe Werknemer</h3>
            <input
              type="text"
              placeholder="Naam"
              value={newWorker.name}
              onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={newWorker.email}
              onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
              required
            />
            <input
              type="tel"
              placeholder="Telefoon (optioneel)"
              value={newWorker.phone}
              onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Aanmaken...' : 'Werknemer Aanmaken'}
            </button>
          </form>

          {/* Workers List */}
          <div className="space-y-2">
            {workers.map((worker) => (
              <button
                key={worker.id}
                onClick={() => setSelectedWorker(worker)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedWorker?.id === worker.id
                    ? 'bg-blue-500/30 border border-blue-500/50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="text-white font-medium">{worker.name}</div>
                <div className="text-white/60 text-sm">{worker.email}</div>
                <div className={`text-xs ${worker.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {worker.is_active ? 'Actief' : 'Inactief'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Worker Details */}
        {selectedWorker && (
          <div className="lg:col-span-2 space-y-6">
            {/* Worker Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                {selectedWorker.name}
              </h2>
              <div className="text-white/60 space-y-1">
                <div>E-mail: {selectedWorker.email}</div>
                {selectedWorker.phone && <div>Telefoon: {selectedWorker.phone}</div>}
                <div>Status: {selectedWorker.is_active ? 'Actief' : 'Inactief'}</div>
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
                  Wekelijkse Beschikbaarheid
                </button>
                <button
                  onClick={() => setActiveTab('specific')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'specific'
                      ? 'bg-blue-500 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Specifieke Datums
                </button>
                <button
                  onClick={() => setActiveTab('timeoff')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'timeoff'
                      ? 'bg-blue-500 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Vrije Tijd
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
                      <h3 className="text-lg font-medium text-white">Nieuwe Beschikbaarheid</h3>
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
                      <h3 className="text-lg font-medium text-white mb-4">Huidige Beschikbaarheid</h3>
                    <div className="space-y-2">
                      {selectedWorker.worker_availability.map((av) => (
                        <div
                          key={av.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="text-white">
                            <div className="font-medium">
                              Elke {DAYS_OF_WEEK[av.day_of_week].toLowerCase()}
                            </div>
                            <div className="text-white/60 text-sm">
                              {av.start_time} - {av.end_time}
                            </div>
                            <div className="text-white/40 text-xs">
                              {av.is_available ? 'Wekelijks beschikbaar' : 'Wekelijks niet beschikbaar'}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteAvailability(av.id)}
                            disabled={isSaving}
                            className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? 'Verwijderen...' : 'Verwijderen'}
                          </button>
                        </div>
                      ))}
                    </div>
                    </div>
                  </motion.div>
                ) : activeTab === 'specific' ? (
                  <motion.div
                    key="specific"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Add Specific Availability Form */}
                    <form onSubmit={addSpecificAvailability} className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Nieuwe Specifieke Beschikbaarheid</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={newSpecificAvailability.availability_date}
                          onChange={(e) => setNewSpecificAvailability({ ...newSpecificAvailability, availability_date: e.target.value })}
                          className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                          required
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={newSpecificAvailability.start_time}
                            onChange={(e) => setNewSpecificAvailability({ ...newSpecificAvailability, start_time: e.target.value })}
                            className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                          <span className="text-white/60">tot</span>
                          <input
                            type="time"
                            value={newSpecificAvailability.end_time}
                            onChange={(e) => setNewSpecificAvailability({ ...newSpecificAvailability, end_time: e.target.value })}
                            className="p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center text-white">
                          <input
                            type="checkbox"
                            checked={newSpecificAvailability.is_available}
                            onChange={(e) => setNewSpecificAvailability({ ...newSpecificAvailability, is_available: e.target.checked })}
                            className="mr-2"
                          />
                          Beschikbaar
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Reden (optioneel)"
                        value={newSpecificAvailability.reason}
                        onChange={(e) => setNewSpecificAvailability({ ...newSpecificAvailability, reason: e.target.value })}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
                      />
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Toevoegen...' : 'Specifieke Beschikbaarheid Toevoegen'}
                      </button>
                    </form>

                    {/* Current Specific Availability */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Huidige Specifieke Beschikbaarheid</h3>
                      <div className="space-y-2">
                        {selectedWorker.worker_specific_availability.map((sa) => {
                          const availabilityDate = new Date(sa.availability_date);
                          
                          return (
                            <div
                              key={sa.id}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <div className="text-white">
                                <div className="font-medium">
                                  {availabilityDate.toLocaleDateString('nl-NL', { 
                                    weekday: 'long', 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                                <div className="text-white/60 text-sm">
                                  {sa.start_time} - {sa.end_time}
                                </div>
                                <div className="text-white/40 text-xs">
                                  {sa.is_available ? 'Beschikbaar' : 'Niet beschikbaar'}
                                </div>
                                {sa.reason && (
                                  <div className="text-white/60 text-sm">{sa.reason}</div>
                                )}
                              </div>
                              <button
                                onClick={() => deleteSpecificAvailability(sa.id)}
                                disabled={isSaving}
                                className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSaving ? 'Verwijderen...' : 'Verwijderen'}
                              </button>
                            </div>
                          );
                        })}
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
                      <h3 className="text-lg font-medium text-white">Nieuwe Vrije Tijd</h3>
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
                        {isSaving ? 'Toevoegen...' : 'Vrije Tijd Toevoegen'}
                      </button>
                    </form>

                    {/* Current Time Off */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Huidige Vrije Tijd</h3>
                    <div className="space-y-2">
                      {selectedWorker.worker_time_off.map((to) => {
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
                              disabled={isSaving}
                              className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? 'Verwijderen...' : 'Verwijderen'}
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
        )}
      </div>
    </div>
  );
}
