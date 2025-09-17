/**
 * Generate a random booking number
 * Format: CC-XXXXXX (where X is a random alphanumeric character)
 */
export function generateRandomBookingNumber(): string {
  const prefix = 'CC-';
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return prefix + result;
}

/**
 * Generate a unique booking number by checking against existing bookings
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateUniqueBookingNumber(supabase: any): Promise<string> {
  let bookingNumber = generateRandomBookingNumber();
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    bookingNumber = generateRandomBookingNumber();
    
    try {
      const { data: existingBooking, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_number', bookingNumber)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // No existing booking found with this number - it's unique
        isUnique = true;
      } else if (existingBooking) {
        // Booking number already exists, try again
        attempts++;
      } else {
        // Some other error occurred
        console.error('Error checking booking number uniqueness:', error);
        isUnique = true; // Use this number anyway to avoid infinite loop
      }
    } catch (error) {
      console.error('Error checking booking number uniqueness:', error);
      isUnique = true; // Use this number anyway to avoid infinite loop
    }
  }
  
  if (attempts >= maxAttempts) {
    // Fallback: add timestamp to make it unique
    const timestamp = Date.now().toString().slice(-4);
    bookingNumber = generateRandomBookingNumber() + '-' + timestamp;
  }
  
  return bookingNumber;
}
