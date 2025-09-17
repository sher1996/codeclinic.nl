# GA4 & Google Ads Conversion Setup Guide

This guide will help you set up Google Analytics 4 (GA4) conversion tracking and Google Ads integration for the appointment booking system.

## ✅ What's Already Implemented

### 1. Thank You Page (`/thank-you`)
- Created a professional thank-you page that displays after successful booking
- Shows appointment details (date, time, customer name, booking ID)
- Includes contact information and next steps
- Redirects users from booking form to thank-you page with URL parameters

### 2. GA4 Script Integration
- GA4 script is already loaded site-wide in `app/layout.tsx`
- Uses Google Analytics ID: `G-8VM2Y5JZEM`
- Configured with consent mode for GDPR compliance
- Includes Google Ads conversion tracking setup

### 3. Conversion Event Tracking
- `book_appointment` event is automatically fired when users reach the thank-you page
- Event includes custom parameters: appointment_date, appointment_time, customer_name
- Event is marked as a conversion with value and currency

## 🔧 Manual Setup Required

### Step 1: Configure GA4 Conversion Event

1. **Go to Google Analytics 4**
   - Navigate to [analytics.google.com](https://analytics.google.com)
   - Select your property (should be `G-8VM2Y5JZEM`)

2. **Create Conversion Event**
   - Go to **Admin** → **Events** → **Create event**
   - Event name: `book_appointment`
   - Condition: `page_location` contains `/thank-you`
   - Mark as **Conversion**: ✅ Yes
   - Click **Create**

3. **Verify Event is Working**
   - Go to **Reports** → **Realtime** → **Events**
   - Make a test booking and check if `book_appointment` appears
   - Event should show with conversion value of 1

### Step 2: Link GA4 to Google Ads

1. **In Google Analytics 4**
   - Go to **Admin** → **Product Links** → **Google Ads Links**
   - Click **Link** next to your Google Ads account
   - Follow the linking process

2. **In Google Ads**
   - Go to **Tools & Settings** → **Conversions** → **Import**
   - Select **Google Analytics 4 (Web)**
   - Choose your GA4 property
   - Import the `book_appointment` conversion
   - Set conversion value: **Use different values for each conversion**
   - Set conversion window: **30 days**
   - Set attribution model: **Last click**

### Step 3: Create Google Ads Campaign

1. **Create New Campaign**
   - Go to **Campaigns** → **+** → **New campaign**
   - Campaign type: **Leads**
   - Campaign goal: **Website traffic** or **Leads**

2. **Campaign Settings**
   - Campaign name: `CodeClinic - Appointment Bookings`
   - Bidding strategy: **Maximize conversions**
   - Daily budget: Set your preferred amount
   - Networks: **Search** (recommended for leads)

3. **Ad Group Setup**
   - Ad group name: `Appointment Bookings`
   - Keywords: Target relevant terms like:
     - "computer hulp rotterdam"
     - "computer reparatie rotterdam"
     - "computer ondersteuning thuis"
     - "senioren computerhulp"
     - "remote computer hulp"

4. **Ad Creation**
   - Create responsive search ads
   - Headlines: Focus on "Computer hulp", "Aan huis", "Rotterdam", "Geen voorrijkosten"
   - Descriptions: Highlight "Geen voorrijkosten", "Niet opgelost = geen kosten", "Direct afspraak boeken"

5. **Conversion Tracking**
   - In campaign settings, select the imported `book_appointment` conversion
   - Set conversion value: Use the value from GA4 (currently set to 1 EUR)

## 📊 Monitoring & Optimization

### GA4 Reports to Monitor
1. **Conversions** → **book_appointment**
   - Track conversion rate and value
   - Monitor by traffic source and medium

2. **Acquisition** → **Traffic acquisition**
   - See which channels drive the most conversions
   - Monitor Google Ads performance

### Google Ads Reports to Monitor
1. **Campaigns** → **Conversions**
   - Track cost per conversion
   - Monitor conversion value and ROI

2. **Keywords** → **Search terms**
   - Identify high-performing keywords
   - Add negative keywords for irrelevant traffic

## 🔍 Testing the Setup

### Test the Complete Flow
1. **Make a Test Booking**
   - Go to your website
   - Fill out the appointment form
   - Complete the booking process
   - Verify you're redirected to `/thank-you` page

2. **Verify GA4 Tracking**
   - Check **Realtime** → **Events** in GA4
   - Look for `book_appointment` event
   - Verify conversion is marked

3. **Verify Google Ads Tracking**
   - Check **Conversions** in Google Ads
   - Look for imported conversions from GA4
   - Verify conversion value is recorded

## 🚀 Optimization Tips

### GA4 Optimization
- Set up **Enhanced Ecommerce** if you want more detailed tracking
- Create **Custom Audiences** based on conversion behavior
- Set up **Conversion Paths** to understand user journey

### Google Ads Optimization
- Use **Smart Bidding** strategies like Target CPA or Target ROAS
- Create **Audience Lists** for remarketing
- Set up **Conversion Value Rules** for different appointment types
- Use **Ad Extensions** like call extensions and location extensions

## 📈 Expected Results

With this setup, you should see:
- **GA4**: `book_appointment` events firing on the thank-you page
- **Google Ads**: Conversions being imported from GA4
- **Campaign Performance**: Data on which keywords and ads drive the most bookings
- **ROI Tracking**: Cost per appointment booking

## 🆘 Troubleshooting

### Common Issues
1. **Events not showing in GA4**
   - Check if GA4 script is loading correctly
   - Verify the event name matches exactly: `book_appointment`
   - Check browser console for JavaScript errors

2. **Conversions not importing to Google Ads**
   - Ensure GA4 and Google Ads accounts are properly linked
   - Check if the conversion event is marked as "conversion" in GA4
   - Wait 24-48 hours for data to appear

3. **Thank you page not loading**
   - Check if the redirect URL is correct
   - Verify the thank-you page is accessible at `/thank-you`
   - Check for any JavaScript errors in the booking form

## 📞 Support

If you need help with the setup:
1. Check the browser console for any JavaScript errors
2. Verify all IDs and tracking codes are correct
3. Test in incognito mode to avoid caching issues
4. Contact Google Ads support for account-specific issues

---

**Note**: This setup provides comprehensive tracking for your appointment booking system. The conversion data will help you optimize your Google Ads campaigns and understand which marketing efforts are most effective.
