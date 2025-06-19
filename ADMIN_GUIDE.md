# Admin Calendar Guide

## Overview
The admin calendar system allows you to manage all bookings, view statistics, and control the calendar from an admin interface. The admin access is hidden and can be triggered through secret methods.

## How to Access Admin Panel

### Method 1: Keyboard Shortcut
1. **Navigate to any page** on your website
2. **Press the secret key combination**: `Ctrl + Alt + A`
3. **Enter Password**: Use the password: `admin123`
4. **Access Dashboard**: Once authenticated, you'll see the admin dashboard

### Method 2: Type "admin"
1. **Navigate to any page** on your website
2. **Type the word "admin"** anywhere on the page (while focused on the page)
3. **Enter Password**: Use the password: `admin123`
4. **Access Dashboard**: Once authenticated, you'll see the admin dashboard

### Method 3: URL Parameter
1. **Add admin parameter** to any URL: `?admin=true`
   - Example: `http://localhost:3000?admin=true`
2. **Enter Password**: Use the password: `admin123`
3. **Access Dashboard**: Once authenticated, you'll see the admin dashboard

## Admin Features

### 📊 Statistics Tab
- **Total Bookings**: Shows the total number of all bookings
- **Today's Bookings**: Shows bookings scheduled for today
- **Upcoming Bookings**: Shows future bookings
- **Past Bookings**: Shows completed bookings
- **Popular Time Slots**: Shows which times are most frequently booked
- **Recent Bookings**: Shows the last 5 bookings made

### 📅 Bookings Tab
- **View All Bookings**: See all bookings in a list format
- **Filter Options**:
  - All Bookings
  - Today
  - Upcoming
  - Past
  - By specific date
- **Edit Bookings**: Click "Edit" to modify any booking details
- **Delete Bookings**: Click "Delete" to remove individual bookings
- **Clear All**: Remove all bookings at once (use with caution!)

## Managing Bookings

### Editing a Booking
1. Click the "Edit" button next to any booking
2. Modify the details in the popup form:
   - Name
   - Email
   - Phone
   - Date
   - Time
   - Notes
3. Click "Update Booking" to save changes

### Deleting a Booking
1. Click the "Delete" button next to any booking
2. Confirm the deletion in the popup
3. The booking will be permanently removed

### Clearing All Bookings
1. Click the "Clear All Bookings" button
2. Confirm the action (this cannot be undone)
3. All bookings will be permanently deleted

## Security

- **Hidden Access**: No visible admin button - only secret methods
- **Password Protection**: The admin panel is protected with a password
- **Default Password**: `admin123`
- **Change Password**: To change the password, edit the `ADMIN_PASSWORD` constant in `components/HiddenAdminAccess.tsx`

## API Endpoints

The admin system uses these API endpoints:

- `GET /api/calendar` - Get all bookings
- `PUT /api/calendar/[id]` - Update a specific booking
- `DELETE /api/calendar/[id]` - Delete a specific booking
- `POST /api/calendar/clear` - Clear all bookings

## Tips for Administrators

1. **Remember the Shortcuts**: Keep the keyboard shortcut (`Ctrl + Alt + A`) handy
2. **Regular Monitoring**: Check the Statistics tab regularly to monitor booking patterns
3. **Backup**: Consider backing up booking data before major operations
4. **Communication**: When editing bookings, consider notifying customers of changes
5. **Time Slots**: Popular time slots can help you optimize your schedule
6. **Notes**: Use the notes field to add important information about bookings

## Troubleshooting

### Can't Access Admin Panel?
- Try all three access methods (keyboard shortcut, typing "admin", URL parameter)
- Make sure you're typing "admin" while the page is focused
- Verify you're using the correct password
- Check that JavaScript is enabled in your browser

### Bookings Not Loading?
- Check your internet connection
- Refresh the page and try again
- Check the browser console for error messages

### Can't Edit/Delete Bookings?
- Make sure you're logged in as admin
- Check that the booking exists
- Try refreshing the page

## Customization

### Changing the Admin Password
Edit the `ADMIN_PASSWORD` constant in `components/HiddenAdminAccess.tsx`:
```typescript
const ADMIN_PASSWORD = 'your-new-password';
```

### Changing the Keyboard Shortcut
Edit the keyboard event handler in `components/HiddenAdminAccess.tsx`:
```typescript
// Change from Ctrl + Alt + A to your preferred combination
if (event.ctrlKey && event.altKey && event.key === 'a') {
  // Your custom shortcut
}
```

### Modifying Time Slots
Edit the time slot generation in `app/api/calendar/route.ts`:
```typescript
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 16; h++) { // Change 9 and 16 to adjust hours
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}
```

### Styling Changes
The admin interface uses Tailwind CSS classes. You can modify the styling in the respective component files.

## Security Notes

- The admin access is completely hidden from regular users
- Only those who know the secret methods can access the admin panel
- Consider changing the default password for production use
- The keyboard shortcut and typing method work on any page of the website

## Support

If you encounter any issues with the admin system, check:
1. Browser console for error messages
2. Network tab for failed API requests
3. Server logs for backend errors

For additional help, refer to the main application documentation or contact your development team. 