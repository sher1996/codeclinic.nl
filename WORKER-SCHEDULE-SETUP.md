# Worker Schedule System Setup

This document explains how to set up and use the new worker hours system that automatically updates the calendar based on worker availability.

## Overview

The worker schedule system allows you to:
- Manage worker information and availability
- Set weekly recurring schedules for workers
- Handle time-off requests and vacation days
- Automatically filter calendar time slots based on worker availability
- Provide self-service interface for workers to manage their own schedules

## Database Setup

### 1. Run the Database Setup Script

```bash
node scripts/setup-worker-schedule.js
```

This will create the following tables:
- `workers` - Worker information
- `worker_availability` - Weekly recurring availability
- `worker_time_off` - Specific dates when workers are unavailable

### 2. Manual Database Setup (Alternative)

If the script doesn't work, you can manually run the SQL in `database/worker_schedule.sql` in your Supabase dashboard.

## Features

### Admin Interface (`/admin/schedule`)

- **Worker Management**: Add, edit, and manage worker information
- **Availability Management**: Set weekly recurring schedules for each worker
- **Time-off Management**: Handle vacation days and time-off requests
- **Real-time Updates**: Changes immediately affect calendar availability

### Worker Self-Service (`/worker`)

- **Login**: Workers can log in using their email address
- **Availability Management**: Workers can set their own weekly schedules
- **Time-off Requests**: Workers can request time off
- **Schedule Viewing**: Workers can view their current schedule

### Calendar Integration

- **Automatic Filtering**: Calendar only shows time slots when workers are available
- **Real-time Updates**: Changes to worker schedules immediately affect booking availability
- **Fallback Support**: If no workers are available, falls back to default time slots

## API Endpoints

### Worker Schedule Management (`/api/worker-schedule`)

**GET**: Fetch all workers and their schedules
**POST**: Create/update workers, availability, and time-off

Actions:
- `create_worker` - Add new worker
- `update_worker` - Update worker information
- `set_availability` - Set weekly availability
- `set_time_off` - Add time-off period
- `delete_availability` - Remove availability slot
- `delete_time_off` - Remove time-off period

### Available Slots (`/api/available-slots`)

**GET**: Get available time slots for a specific date
- Query parameter: `date` (YYYY-MM-DD format)
- Returns: Array of available time slots based on worker schedules

## Usage Examples

### Adding a New Worker

1. Go to `/admin/schedule`
2. Fill in worker details (name, email, phone)
3. Click "Werknemer Aanmaken"
4. Select the worker and add their availability

### Setting Weekly Availability

1. Select a worker in the admin interface
2. Go to "Beschikbaarheid" tab
3. Choose day of week, start time, and end time
4. Click "Toevoegen"

### Requesting Time Off (Worker)

1. Go to `/worker`
2. Enter your email address
3. Go to "Vrije Tijd Aanvragen" tab
4. Select dates and optionally specific times
5. Add reason and submit

### How Calendar Filtering Works

1. When a user selects a date, the system:
   - Fetches all active workers
   - Checks their weekly availability for that day of week
   - Excludes any time-off periods for that date
   - Generates available time slots
   - Filters out already booked appointments
   - Shows only available slots to the user

## Configuration

### Environment Variables

Make sure these are set in your `.env.local`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Getting Started

1. Create your first worker through the admin interface
2. Set their weekly availability schedule
3. The calendar will automatically show only available time slots

## Troubleshooting

### Calendar Not Showing Available Slots

1. Check if workers are marked as active
2. Verify worker availability is set for the selected day
3. Check for conflicting time-off periods
4. Ensure database tables are created properly

### Workers Can't Log In

1. Verify worker email exists in the database
2. Check if worker is marked as active
3. Ensure email addresses match exactly (case-sensitive)

### API Errors

1. Check Supabase connection
2. Verify environment variables are set
3. Check database permissions
4. Review server logs for detailed error messages

## Security Considerations

- Worker self-service uses email-based authentication
- Admin interface should be protected with proper authentication
- Consider adding role-based access control
- Validate all input data on both client and server side

## Future Enhancements

- Email notifications for schedule changes
- Shift swapping between workers
- Integration with external calendar systems
- Mobile app for workers
- Advanced reporting and analytics
- Multi-location support
