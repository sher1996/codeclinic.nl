# Environment Setup Guide

## Required Environment Variables

To fix the calendar API errors (500 and 409), you need to set up the following environment variables:

### 1. Create `.env.local` file in your project root:

```bash
# Database Configuration (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your_admin_email@example.com

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
FAST_OPENAI_MODEL=gpt-3.5-turbo-0125
STREAM_OPENAI_MODEL=gpt-4o-mini

# ElevenLabs TTS
ELEVEN_API_KEY=your_elevenlabs_api_key_here
ELEVEN_VOICE_ID=XJa38TJgDqYhj5mYbSJA

# WebSocket Configuration
WS_URL=ws://localhost:8765/ws
FASTAPI_URL=http://localhost:8765

# Environment
NODE_ENV=development

# System Prompt (optional)
SYSTEM_PROMPT="Je bent Sam, een vriendelijke en behulpzame computerhulp assistent van CodeClinic. Je helpt klanten met computerproblemen en plant afspraken. Wees altijd vriendelijk, geduldig en professioneel."
```

## How to Get These API Keys

### 1. **Upstash Redis** (Database)
- Go to [upstash.com](https://upstash.com)
- Create a free account
- Create a new Redis database
- Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 2. **Resend** (Email Service)
- Go to [resend.com](https://resend.com)
- Create a free account
- Get your API key from the dashboard
- Set your admin email address

### 3. **OpenAI** (AI Bot)
- Go to [platform.openai.com](https://platform.openai.com)
- Create an account and get your API key
- The free tier includes $5 credit

### 4. **ElevenLabs** (Text-to-Speech)
- Go to [elevenlabs.io](https://elevenlabs.io)
- Create a free account
- Get your API key
- The voice ID is already set to a Dutch voice

## Setting Environment Variables

### Option 1: Local Development (.env.local)
1. Create `.env.local` file in your project root
2. Add all the variables above
3. Restart your development server

### Option 2: Production (Fly.io)
```bash
# Set secrets for your Fly.io app
flyctl secrets set UPSTASH_REDIS_REST_URL=your_url
flyctl secrets set UPSTASH_REDIS_REST_TOKEN=your_token
flyctl secrets set RESEND_API_KEY=your_key
flyctl secrets set ADMIN_EMAIL=your_email
flyctl secrets set OPENAI_API_KEY=your_key
flyctl secrets set ELEVEN_API_KEY=your_key
flyctl secrets set ELEVEN_VOICE_ID=XJa38TJgDqYhj5mYbSJA

# Deploy with the new secrets
flyctl deploy --app computer-help --port 8765 --yes
```

### Option 3: PowerShell Script
Run the provided `setup-env.ps1` script:
```powershell
.\setup-env.ps1
```

## Testing the Setup

### 1. Test Calendar API
```bash
# Test GET endpoint
curl http://localhost:3000/api/calendar

# Test POST endpoint
curl -X POST http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "0612345678",
    "date": "2024-12-20",
    "time": "10:00",
    "notes": "Test booking",
    "appointmentType": "onsite"
  }'
```

### 2. Test WebSocket Connection
```bash
# Start the FastAPI server
python app.py

# Test WebSocket connection
python test-websocket.py
```

## Common Issues and Solutions

### 1. **500 Error (Internal Server Error)**
- Check if all environment variables are set
- Verify Redis connection
- Check console logs for specific error messages

### 2. **409 Error (Conflict)**
- This is normal - it means the time slot is already booked
- The system prevents double-booking

### 3. **Message Channel Error**
- This is fixed by the WebSocket improvements
- Restart your development server

### 4. **Link Preload Warning**
- This is fixed by commenting out the unused preload
- The logo will still load normally

## Security Notes

- Never commit `.env.local` to git
- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor API usage to avoid unexpected charges

## Next Steps

1. Set up all environment variables
2. Test the calendar API endpoints
3. Test the WebSocket connection
4. Deploy to production if everything works
5. Monitor for any remaining errors

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs
3. Verify all environment variables are set correctly
4. Test each service individually
