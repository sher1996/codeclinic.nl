# Environment Setup

This project requires the following environment variables to be configured:

## Required Environment Variables

### 1. Resend Email Service
- **RESEND_API_KEY**: Your Resend API key for sending emails
- Get it from: https://resend.com/api-keys

### 2. Upstash Redis Database
- **UPSTASH_REDIS_REST_URL**: Your Upstash Redis REST URL
- **UPSTASH_REDIS_REST_TOKEN**: Your Upstash Redis REST token
- Get them from: https://console.upstash.com/

### 3. Admin Notifications
- **ADMIN_EMAIL**: Email address where you want to receive notifications when new appointments are booked
- This can be any email address you control

## Setup Instructions

### For Local Development
1. Create a `.env.local` file in the root directory
2. Add the following variables:
```env
RESEND_API_KEY=your_resend_api_key_here
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here
ADMIN_EMAIL=your_email@example.com
```

### For Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value

## Testing the Setup

After setting up the environment variables, you can test them:

1. **Test Environment Variables**: Visit `/api/test-env`
2. **Test Email Service**: Visit `/api/test-resend`
3. **Test Admin Email Notifications**: Visit `/api/test-admin-email`
4. **Test Database**: The calendar booking will test the database connection

## Email Notifications

The system sends two types of emails:

1. **Customer Confirmation**: Sent to the customer when they book an appointment
2. **Admin Notification**: Sent to the admin email when a new appointment is booked

Both emails are sent automatically when someone reserves an appointment through the calendar.

## Troubleshooting

### 502 Bad Gateway Error
- Check if all environment variables are properly set
- Verify your Resend API key is valid
- Ensure your Upstash Redis credentials are correct

### Mail Service Failed Error
- Verify RESEND_API_KEY is set and valid
- Check if you're using a verified domain in Resend
- For testing, the code uses `onboarding@resend.dev` which should work with any Resend account

### Database Connection Issues
- Verify UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are correct
- Check if your Upstash Redis instance is active

### Admin Notifications Not Working
- Verify ADMIN_EMAIL is set to a valid email address
- Check that RESEND_API_KEY is properly configured
- Admin notifications are optional - if they fail, the booking will still succeed 