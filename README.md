# Computer Help - CodeClinic Website

A comprehensive computer help service website built with Next.js, featuring appointment booking, AI-powered chat support, and voice integration. The project consists of a Next.js frontend deployed on Vercel and a FastAPI WebSocket bot deployed on Fly.io.

## 🏗️ Project Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS with custom components
- **Deployment**: Vercel (automatic deployment on git push)
- **Port**: 3000 (development)

### Backend (FastAPI)
- **Framework**: FastAPI with WebSocket support
- **AI Integration**: OpenAI GPT models for chat responses
- **TTS**: ElevenLabs for text-to-speech
- **Deployment**: Fly.io (always-on service)
- **Port**: 8765

### Database & Services
- **Database**: Upstash Redis (appointment storage)
- **Email**: Resend (appointment confirmations)
- **Voice**: Twilio integration for phone calls

## 📁 Project Structure

```
computer-help/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── calendar/             # Appointment booking API
│   │   ├── voice/                # Twilio voice webhook
│   │   ├── ws/                   # WebSocket proxy
│   │   └── tts/                  # Text-to-speech streaming
│   ├── animations/               # Animation components
│   ├── faq/                      # FAQ page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout with critical CSS
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── AppointmentCalendar.tsx   # Main calendar component
│   ├── Contact.tsx               # Contact form
│   ├── Hero.tsx                  # Hero section
│   ├── Services.tsx              # Services showcase
│   └── ...                       # Other components
├── lib/                          # Utility libraries
│   ├── utils.ts                  # Common utilities
│   ├── websocket.ts              # WebSocket client
│   └── colorThemes.ts            # Theme configuration
├── types/                        # TypeScript definitions
├── scripts/                      # Build and optimization scripts
├── app.py                        # FastAPI WebSocket server
├── fly.toml                      # Fly.io deployment config
├── next.config.mjs               # Next.js configuration
├── package.json                  # Node.js dependencies
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd computer-help
npm install
pip install -r requirements.txt
```

### 2. Environment Setup
Create `.env.local` file in the root directory:

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
SYSTEM_PROMPT="Je bent Sam, een vriendelijke en behulpzame computerhulp assistent van CodeClinic..."
```

### 3. Start Development Servers

#### Option A: Using Scripts (Recommended)
```bash
# Windows
start-servers.bat

# PowerShell
.\start-servers.ps1
```

#### Option B: Manual Start
```bash
# Terminal 1 - Next.js frontend
npm run dev

# Terminal 2 - FastAPI WebSocket server
python app.py
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **WebSocket API**: http://localhost:8765
- **Health Check**: http://localhost:8765/health

## 🔧 Development Commands

### Frontend (Next.js)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run optimize-css # Optimize CSS files
```

### Backend (FastAPI)
```bash
python app.py                    # Start WebSocket server
uvicorn app:app --port 8765     # Alternative start command
```

### Testing
```bash
# Test calendar API
curl http://localhost:3000/api/calendar

# Test WebSocket connection
python test-websocket.py

# Test voice API
curl http://localhost:3000/api/voice
```

## 🌐 Deployment

### Frontend (Vercel)
The frontend automatically deploys to Vercel when you push to the main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Backend (Fly.io)
Deploy the WebSocket server to Fly.io:
```bash
# Set environment variables
flyctl secrets set OPENAI_API_KEY=your_key
flyctl secrets set ELEVEN_API_KEY=your_key
flyctl secrets set ELEVEN_VOICE_ID=XJa38TJgDqYhj5mYbSJA

# Deploy
flyctl deploy --app codeclinic-bot --port 8765 --yes
```

## 🎯 Key Features

### 1. Appointment Booking System
- Interactive calendar with available time slots
- Form validation and error handling
- Email confirmations via Resend
- Redis-based storage for appointments

### 2. AI-Powered Chat Support
- OpenAI GPT integration for intelligent responses
- Dutch language support
- Context-aware assistance
- Service pricing and information

### 3. Voice Integration
- Twilio phone system integration
- Text-to-speech with ElevenLabs
- WebSocket-based real-time communication
- TwiML response generation

### 4. Performance Optimizations
- Critical CSS inlining for faster LCP
- Dynamic CSS loading for non-critical styles
- Bundle splitting and code optimization
- Resource hints and preloading

## 🛠️ API Endpoints

### Frontend API Routes
- `GET/POST /api/calendar` - Appointment management
- `POST /api/send-email` - Email notifications
- `GET /api/voice` - Twilio voice webhook
- `GET /api/ws` - WebSocket proxy
- `POST /api/tts/stream` - Text-to-speech streaming

### Backend WebSocket
- `ws://localhost:8765/ws` - Main chat WebSocket
- `POST /chat` - HTTP chat endpoint
- `GET /health` - Health check

## 🎨 Styling & Theming

### CSS Architecture
- **Critical CSS**: Inlined in `layout.tsx` for immediate rendering
- **Component CSS**: Scoped styles in component files
- **Global CSS**: `globals.css` for base styles
- **Calendar CSS**: Dynamically loaded when needed

### Color Themes
- Primary: Blue (#0000FF) - User's preferred color
- Secondary: Green (#047857)
- Customizable through `lib/colorThemes.ts`

### Performance Features
- CSS optimization and minification
- Critical path optimization
- Bundle splitting for better caching
- Resource hints for external assets

## 🔍 Monitoring & Debugging

### Performance Monitoring
- Lighthouse audits for Core Web Vitals
- Performance audit scripts in `scripts/`
- CSS optimization reports
- Bundle size analysis

### Debug Tools
- Browser console logging
- WebSocket connection testing
- API endpoint testing scripts
- Health check endpoints

## 📚 Additional Documentation

- [Environment Setup Guide](ENVIRONMENT-SETUP.md) - Detailed API key setup
- [Server Setup Instructions](SERVER-SETUP.md) - Server configuration
- [WebSocket Setup Guide](WEBSOCKET-SETUP.md) - WebSocket and tunnel setup
- [Performance Optimization](PERFORMANCE-OPTIMIZATION.md) - Performance improvements

## 🤝 Contributing

### Development Workflow
1. Create a feature branch from `main`
2. Make your changes
3. Test locally with both servers running
4. Run `npm run lint` to check code quality
5. Submit a pull request

### Code Standards
- Use TypeScript for type safety
- Follow Next.js App Router patterns
- Implement proper error handling
- Add comments for complex logic
- Test API endpoints before committing

## 🐛 Troubleshooting

### Common Issues

#### Calendar API Errors (500/409)
- Check environment variables are set correctly
- Verify Redis connection
- Ensure all required API keys are configured

#### WebSocket Connection Issues
- Verify FastAPI server is running on port 8765
- Check firewall settings
- Test local connection first

#### Performance Issues
- Run `npm run optimize-css` to optimize stylesheets
- Check bundle size with `npm run build`
- Monitor Core Web Vitals in browser dev tools

### Getting Help
1. Check the browser console for error messages
2. Review server logs for backend issues
3. Test individual components in isolation
4. Verify all environment variables are set

## 📄 License

This project is private and proprietary to CodeClinic.

## 🔗 External Services

### Required API Keys
- **Upstash Redis**: Database storage
- **Resend**: Email service
- **OpenAI**: AI chat responses
- **ElevenLabs**: Text-to-speech
- **Twilio**: Voice calls (optional)

### Service URLs
- **Production Frontend**: https://codeclinic.nl
- **Production WebSocket**: wss://ws.codeclinic.nl/ws
- **Development Frontend**: http://localhost:3000
- **Development WebSocket**: ws://localhost:8765/ws

---

**Last Updated**: January 2025  
**Version**: 0.1.0  
**Maintainer**: CodeClinic Development Team