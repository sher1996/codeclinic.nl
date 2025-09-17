# Email-Based Admin Access System

This document explains the new email-based admin access system that replaces the simple password-based authentication.

## 🔐 How It Works

1. **User requests admin access** by entering their email address
2. **System sends approval request** to `codeclinic.nl@gmail.com`
3. **Admin approves/denies** via secure email links
4. **User gets notified** and can access admin panel if approved

## 🚀 Setup Instructions

### 1. Environment Configuration

Make sure your `.env.local` file contains:

```bash
# Email Configuration (Gmail)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=codeclinic.nl@gmail.com

# Database Configuration (Supabase)
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Database Setup

Run the setup script to create the required database table:

```bash
node scripts/setup-admin-access.js
```

Or manually run the SQL in your Supabase dashboard:

```sql
-- See database/admin_access_requests.sql for the complete SQL
```

### 3. Test the System

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Access the admin login:
   - Visit: `http://localhost:3000?admin=true`
   - Or use keyboard shortcut: `Ctrl + Alt + A`

3. Request admin access with your email

4. Check `codeclinic.nl@gmail.com` for approval email

5. Click the approval link to grant access

## 📧 Email Templates

The system sends two types of emails:

### Admin Approval Request
- **To:** `codeclinic.nl@gmail.com`
- **Contains:** User details, secure approval/denial links
- **Security:** Tokens expire after use

### User Notification
- **To:** User's email address
- **Contains:** Approval/denial status
- **Sent:** After admin action

## 🔒 Security Features

- **Email-based authentication** - No passwords to remember
- **Secure approval tokens** - Links expire after use
- **Admin email notifications** - All requests go to admin
- **Request tracking** - Full audit trail in database
- **Status management** - Pending, approved, denied states

## 🗄️ Database Schema

The `admin_access_requests` table stores:

```sql
- id: UUID (primary key)
- email: VARCHAR(255) - User's email
- name: VARCHAR(255) - User's full name
- reason: TEXT - Optional reason for access
- status: VARCHAR(20) - pending/approved/denied
- approve_token: VARCHAR(255) - Secure approval token
- deny_token: VARCHAR(255) - Secure denial token
- created_at: TIMESTAMP - When requested
- updated_at: TIMESTAMP - Last modified
- processed_at: TIMESTAMP - When approved/denied
```

## 🛠️ API Endpoints

### POST `/api/admin-access`
Request admin access
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "reason": "Need to manage bookings"
}
```

### GET `/api/admin-access?email=user@example.com`
Check admin access status

### GET `/api/admin-access/action?token=...&action=approve&requestId=...`
Handle admin approval/denial (called via email links)

## 🎯 Usage

### For Users
1. Go to your website with `?admin=true` parameter
2. Enter your email address
3. Fill out the access request form
4. Wait for email notification
5. Access admin panel once approved

### For Admins
1. Check `codeclinic.nl@gmail.com` for approval requests
2. Click "Approve Access" or "Deny Access" in the email
3. User will be automatically notified
4. Approved users can now access the admin panel

## 🔧 Troubleshooting

### Common Issues

**"Email service not configured"**
- Check `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local`

**"Database not configured"**
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**"Request not found"**
- Token may have expired or already been used

**"You already have a pending request"**
- Wait for current request to be processed

### Manual Database Operations

If you need to manually manage requests:

```sql
-- View all requests
SELECT * FROM admin_access_requests ORDER BY created_at DESC;

-- Approve a request
UPDATE admin_access_requests 
SET status = 'approved', processed_at = NOW() 
WHERE email = 'user@example.com';

-- Deny a request
UPDATE admin_access_requests 
SET status = 'denied', processed_at = NOW() 
WHERE email = 'user@example.com';
```

## 🔄 Migration from Old System

The old password-based system (`HiddenAdminAccess.tsx`) has been replaced with `EmailAdminAccess.tsx`. The new system:

- ✅ More secure (email-based)
- ✅ Better audit trail
- ✅ Admin approval workflow
- ✅ No hardcoded passwords
- ✅ Professional email notifications

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are set
3. Check Supabase dashboard for database issues
4. Verify Resend email service is working
5. Check email spam folder for notifications

The system is designed to be robust and will fall back gracefully if services are unavailable.
