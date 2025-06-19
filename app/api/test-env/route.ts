import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tomorrowString = tomorrow.toISOString().split('T')[0];
  
  // Test the validation logic
  const [year, month, day] = tomorrowString.split('-').map(Number);
  const bookingDate = new Date(year, month - 1, day);
  
  return NextResponse.json({
    currentTime: now.toISOString(),
    today: today.toISOString(),
    tomorrow: tomorrow.toISOString(),
    tomorrowString,
    bookingDate: bookingDate.toISOString(),
    isValid: bookingDate >= tomorrow,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
} 