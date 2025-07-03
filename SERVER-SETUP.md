# Server Setup Instructions

This project requires two servers to run simultaneously:

## Environment Configuration

Create a `.env` file in the root directory with the following content:

```bash
# WebSocket URL for voice API
# Development (local)
WS_URL=ws://localhost:8765/ws

# Production (uncomment and update when deploying)
# WS_URL=wss://codeclinic.nl/ws
```

## Option 1: Using the provided scripts (Recommended)

### Windows Batch Script
```bash
start-servers.bat
```

### Windows PowerShell Script
```powershell
.\start-servers.ps1
```

## Option 2: Manual setup

### 1. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Build Next.js project
```bash
npm run build
```

### 3. Start both servers

#### Terminal 1 - Next.js site (port 3000)
```bash
npm run start
```

#### Terminal 2 - Bot WebSocket (port 8765)
```bash
uvicorn app:app --port 8765 --reload
```

## Server URLs

- **Next.js site**: http://localhost:3000
- **WebSocket bot**: http://localhost:8765
- **WebSocket endpoint**: ws://localhost:8765/ws
- **Voice API**: http://localhost:3000/api/voice

## Health Checks

- Next.js: http://localhost:3000
- WebSocket bot: http://localhost:8765/health
- Voice API: http://localhost:3000/api/voice

## Testing the WebSocket

You can test the WebSocket connection using a browser console:

```javascript
const ws = new WebSocket('ws://localhost:8765/ws');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (event) => console.log('Received:', JSON.parse(event.data));
ws.send(JSON.stringify({message: 'Hello bot!'}));
```

## Testing the Voice API

The voice API returns TwiML XML that can be used with Twilio:

```bash
curl http://localhost:3000/api/voice
```

This should return XML with the WebSocket URL configured for your environment. 