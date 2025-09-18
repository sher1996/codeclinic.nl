# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for the admin access email system.

## 🔐 **Step 1: Enable 2-Factor Authentication**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Gmail account (`codeclinic.nl@gmail.com`)
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process to enable 2FA

## 🔑 **Step 2: Generate App Password**

1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **App passwords**
3. Select **Mail** as the app
4. Select **Other (custom name)** as the device
5. Enter "CodeClinic Admin" as the name
6. Click **Generate**
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

## ⚙️ **Step 3: Update Environment Variables**

1. Open your `.env.local` file
2. Replace `your_gmail_app_password_here` with the 16-character app password:

```bash
GMAIL_USER=codeclinic.nl@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
ADMIN_EMAIL=codeclinic.nl@gmail.com
```

## 🧪 **Step 4: Test the System**

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3001?admin=true`

3. Request admin access with your email

4. Check `codeclinic.nl@gmail.com` for the approval email

5. Click "Approve Access" to grant access

## ✅ **What This Setup Provides:**

- **Free email service** - No monthly costs
- **Reliable delivery** - Gmail's infrastructure
- **Professional emails** - Beautiful HTML templates
- **No restrictions** - Send to any email address
- **Secure** - Uses Gmail's secure SMTP

## 🔧 **Troubleshooting:**

**"Invalid credentials" error:**
- Make sure 2FA is enabled
- Use the App Password, not your regular Gmail password
- Remove spaces from the App Password

**"Less secure app access" error:**
- This shouldn't happen with App Passwords
- Make sure you're using the App Password, not your regular password

**Emails not arriving:**
- Check spam folder
- Verify the recipient email address
- Check Gmail's "Sent" folder to see if emails were sent

## 🎯 **For Production:**

When you deploy to production, you can:
1. Use the same Gmail account
2. Or create a dedicated Gmail account for your business
3. Or use a custom domain email (like `codeclinic.nl@gmail.com`)

The system will work the same way with any Gmail account!
