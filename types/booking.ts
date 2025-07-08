export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
  appointmentType?: 'onsite' | 'remote';
  createdAt: string;
  updatedAt: string;
}

export interface BookingUpdateData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
  appointmentType?: 'onsite' | 'remote';
}

export interface AtomicBookingResult {
  success: boolean;
  error?: string;
  booking?: Booking;
} 