import fetch from 'node-fetch';

// Helper to get tomorrow's date in YYYY-MM-DD (UTC)
function getTomorrowDateString() {
  const now = new Date();
  // Add one day in UTC
  now.setUTCDate(now.getUTCDate() + 1);
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Test configuration
const BASE_URL = 'http://localhost:3003';
const TEST_DATE = getTomorrowDateString();
const TEST_TIME = '10:00';
const NUM_CONCURRENT_REQUESTS = 5;

// Test booking data
const testBooking = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '0612345678',
  date: TEST_DATE,
  time: TEST_TIME,
  notes: 'Race condition test'
};

async function makeBooking(bookingId) {
  const startTime = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/calendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testBooking,
        name: `${testBooking.name} ${bookingId}`,
        email: `test${bookingId}@example.com`
      })
    });

    const result = await response.json();
    const duration = Date.now() - startTime;

    return {
      bookingId,
      success: response.ok,
      status: response.status,
      result,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      bookingId,
      success: false,
      error: error.message,
      duration
    };
  }
}

async function testRaceCondition() {
  console.log('🚀 Starting race condition test...');
  console.log(`📅 Testing bookings for ${TEST_DATE} at ${TEST_TIME}`);
  console.log(`👥 Making ${NUM_CONCURRENT_REQUESTS} concurrent requests\n`);

  // First, clear existing bookings to start fresh
  console.log('🧹 Clearing existing bookings...');
  try {
    const clearResponse = await fetch(`${BASE_URL}/api/calendar/clear`, {
      method: 'POST'
    });
    if (clearResponse.ok) {
      console.log('✅ Bookings cleared successfully\n');
    } else {
      console.log('⚠️  Failed to clear bookings, continuing anyway\n');
    }
  } catch (error) {
    console.log('⚠️  Could not clear bookings, continuing anyway\n');
  }

  // Make all requests simultaneously
  const promises = [];
  for (let i = 1; i <= NUM_CONCURRENT_REQUESTS; i++) {
    promises.push(makeBooking(i));
  }

  console.log('⚡ Sending concurrent requests...');
  const results = await Promise.all(promises);

  // Analyze results
  console.log('\n📊 Results:');
  console.log('='.repeat(60));

  let successfulBookings = 0;
  let failedBookings = 0;
  let totalDuration = 0;

  results.forEach((result, index) => {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    const duration = `${result.duration}ms`;
    
    console.log(`${status} | Booking ${result.bookingId} | ${duration}`);
    
    if (result.success) {
      successfulBookings++;
      console.log(`   └─ ID: ${result.result.booking?.id}`);
    } else {
      failedBookings++;
      if (result.result?.error) {
        console.log(`   └─ Error: ${result.result.error}`);
      } else if (result.error) {
        console.log(`   └─ Error: ${result.error}`);
      }
    }
    console.log('');

    totalDuration += result.duration;
  });

  // Summary
  console.log('📈 Summary:');
  console.log('='.repeat(60));
  console.log(`Total requests: ${NUM_CONCURRENT_REQUESTS}`);
  console.log(`Successful bookings: ${successfulBookings}`);
  console.log(`Failed bookings: ${failedBookings}`);
  console.log(`Average response time: ${Math.round(totalDuration / NUM_CONCURRENT_REQUESTS)}ms`);
  
  if (successfulBookings === 1) {
    console.log('\n🎉 SUCCESS: Race condition prevention working correctly!');
    console.log('   Only one booking was successful, preventing double bookings.');
  } else if (successfulBookings === 0) {
    console.log('\n⚠️  WARNING: All bookings failed. Check server logs.');
  } else {
    console.log('\n❌ FAILURE: Race condition detected!');
    console.log(`   ${successfulBookings} bookings were created for the same slot.`);
  }

  // Show final state
  console.log('\n📋 Final booking state:');
  try {
    const finalResponse = await fetch(`${BASE_URL}/api/calendar`);
    const finalData = await finalResponse.json();
    
    const bookingsForTestSlot = finalData.bookings.filter(
      booking => booking.date === TEST_DATE && booking.time === TEST_TIME
    );
    
    console.log(`Bookings for ${TEST_DATE} at ${TEST_TIME}: ${bookingsForTestSlot.length}`);
    bookingsForTestSlot.forEach((booking, index) => {
      console.log(`  ${index + 1}. ${booking.name} (${booking.email})`);
    });
  } catch (error) {
    console.log('Could not fetch final booking state');
  }
}

// Run the test
testRaceCondition().catch(console.error); 