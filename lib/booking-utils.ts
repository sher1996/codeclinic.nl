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
 * Generate a unique booking number (simplified version without database check)
 * Since booking_number column doesn't exist in database yet, we'll just generate random numbers
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export async function generateUniqueBookingNumber(supabase: any): Promise<string> {
  // For now, just generate a random booking number with timestamp to ensure uniqueness
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = generateRandomBookingNumber();
  return `${randomPart}-${timestamp}`;
}
