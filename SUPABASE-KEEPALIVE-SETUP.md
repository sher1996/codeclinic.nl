# Supabase Keep-Alive Setup Guide

This guide explains how to prevent your Supabase project from pausing due to inactivity by implementing a keep-alive system.

## 🚨 Problem

Supabase free tier projects pause after 7 days of inactivity. This can cause your application to become unavailable until manually resumed.

## ✅ Solution

We've implemented a comprehensive keep-alive system that:
- Pings Supabase every few hours to keep it active
- Provides health check endpoints
- Works with external cron services
- Includes fallback mechanisms

## 📁 Files Added

### API Endpoints
- `app/api/keepalive/route.ts` - Main keep-alive endpoint
- `app/api/health/route.ts` - Health check endpoint
- `backend/api/keepalive/route.ts` - Backend keep-alive endpoint

### Scripts
- `.github/workflows/simple-keepalive.yml` - GitHub Actions workflow

### Documentation
- `SUPABASE-KEEPALIVE-SETUP.md` - This guide

## 🚀 Setup (GitHub Actions - Like Your Previous Project)

This is exactly what you used in your [jozef-markt repository](https://github.com/jozefmarkt/jozef-markt)!

### **Quick Setup (3 steps):**

1. **Update the Vercel URL** in `.github/workflows/simple-keepalive.yml`
2. **Push to GitHub** - the workflow will start automatically  
3. **Monitor in Actions tab** - see all runs and status

**Benefits:**
- ✅ Free for public repositories
- ✅ Reliable GitHub infrastructure  
- ✅ Easy to monitor and debug
- ✅ No external accounts needed
- ✅ Integrated with your existing workflow

See `GITHUB-ACTIONS-KEEPALIVE-SETUP.md` for detailed instructions.

## 🔧 Configuration

### Environment Variables

Make sure your `.env.local` contains:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Optional: Custom keep-alive settings
KEEPALIVE_INTERVAL=14400  # 4 hours in seconds
KEEPALIVE_TIMEOUT=10000   # 10 seconds timeout
```

### Production URLs

Update the production URLs in `scripts/keepalive-cron.js`:

```javascript
const PRODUCTION_URLS = [
  'https://your-app.vercel.app/api/keepalive',
  'https://your-app.vercel.app/api/health'
];
```

## 🧪 Testing

### Test Keep-Alive Endpoint

```bash
# Test locally
curl http://localhost:3000/api/keepalive

# Test production
curl https://your-app.vercel.app/api/keepalive
```

### Test Health Check

```bash
# Test locally
curl http://localhost:3000/api/health

# Test production
curl https://your-app.vercel.app/api/health
```


## 📊 Monitoring

### Response Format

The keep-alive endpoint returns:

```json
{
  "ok": true,
  "message": "Supabase keep-alive successful",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "supabase_configured": true,
  "bookings_count": 5
}
```

### Health Check Format

The health endpoint returns:

```json
{
  "ok": true,
  "message": "Service is healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "services": {
    "supabase": {
      "configured": true,
      "url": "Set"
    },
    "gmail": {
      "configured": true,
      "user": "Set"
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Supabase not configured**
   - Check environment variables
   - Verify Supabase URL and service role key

2. **Keep-alive failing**
   - Check network connectivity
   - Verify endpoint URLs
   - Check Supabase project status

3. **Cron job not running**
   - Verify cron service configuration
   - Check URL accessibility
   - Review service logs

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env.SUPABASE_URL ? 'Set' : 'Not set')"

# Test Supabase connection
node test-supabase-local.js

# Run keep-alive with verbose output
DEBUG=* npm run keepalive
```

## 📈 Best Practices

1. **Use external cron services** for production
2. **Set appropriate intervals** (every 4-6 hours)
3. **Monitor the logs** regularly
4. **Test after deployment** to ensure it works
5. **Keep backup endpoints** in case one fails

## 🔄 Maintenance

- **Weekly**: Check cron service status
- **Monthly**: Review keep-alive logs
- **Quarterly**: Test Supabase connection
- **As needed**: Update production URLs

## 📞 Support

If you encounter issues:

1. Check the logs in your cron service
2. Test the endpoints manually
3. Verify environment variables
4. Check Supabase project status

The keep-alive system is designed to be robust and self-healing, but regular monitoring ensures it continues to work effectively.
