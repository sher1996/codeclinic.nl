# WebSocket Tunnel Setup Guide

This guide will help you set up and test your WebSocket service through Cloudflare Tunnel.

## Prerequisites

1. **Python Dependencies**: Install required packages
   ```bash
   pip install -r requirements.txt
   ```

2. **Cloudflare Tunnel**: Make sure `cloudflared` is installed and configured
3. **DNS**: Ensure `ws.codeclinic.nl` points to your Cloudflare tunnel

## Step 1: Start the FastAPI WebSocket Server

### Option A: Using the provided script
```bash
# Windows
start-websocket-server.bat

# PowerShell
.\start-websocket-server.ps1
```

### Option B: Manual start
```bash
python app.py
```

**Expected output:**
```
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8765 (Press CTRL+C to quit)
```

## Step 2: Test Local WebSocket Connection

Run the test script to verify local connectivity:
```bash
python test-websocket.py
```

**Expected output:**
```
🚀 WebSocket Connection Tests
==================================================
🔗 Testing Local WebSocket: ws://localhost:8765/ws
==================================================
✅ Connected to Local WebSocket
📤 Sent: {'message': 'Hello from test script!', 'test': True}
📥 Received: {"type":"response","message":"Bot received: Hello from test script!","timestamp":...}
📤 Sent: hello
📥 Received: {"type":"response","message":"Bot received: hello","timestamp":...}
✅ Local WebSocket test completed successfully!
```

## Step 3: Start Cloudflare Tunnel

### Quick Test (Terminal 1)
```bash
cloudflared tunnel --config cloudflared-config.yml run
```

**Expected output:**
```
2025-07-03T14:12:01Z INF Starting tunnel codeclinic-ws (UUID …)
2025-07-03T14:12:03Z INF Route propagating, OK  ✓  https://ws.codeclinic.nl
```

### Test Tunnel Connection (Terminal 2)
```bash
# Using wscat (if installed)
wscat -c wss://ws.codeclinic.nl/ws

# Or using the test script
python test-websocket.py
```

**Expected wscat output:**
```
connected (press CTRL+C to quit)
> hello
< {"type":"response","message":"Bot received: hello", ...}
```

## Step 4: Run Tunnel as Service (Optional)

### Windows Service
Create a Windows service using NSSM or Task Scheduler to run the tunnel automatically.

### Linux Systemd Service
Create `/etc/systemd/system/cloudflared-ws.service`:
```ini
[Unit]
Description=Cloudflare Tunnel for CodeClinic WebSocket
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=YOUR_USER
ExecStart=/usr/local/bin/cloudflared tunnel --config /path/to/cloudflared-config.yml run
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now cloudflared-ws
sudo systemctl status cloudflared-ws
```

## Troubleshooting

### Common Issues

| Error | Likely Cause | Solution |
|-------|-------------|----------|
| `ENOTFOUND ws.codeclinic.nl` | DNS not propagated | Wait 1-5 minutes or lower TTL |
| `502/504` | FastAPI not running | Start `python app.py` |
| `TLS/handshake error` | SSL not configured | Set SSL mode to "Full" in Cloudflare |
| `Connection refused` | Port 8765 blocked | Check firewall settings |

### Verification Steps

1. **Check FastAPI server**: `curl http://localhost:8765/health`
2. **Check tunnel status**: Look for "Route propagating, OK" in tunnel logs
3. **Check DNS**: `nslookup ws.codeclinic.nl`
4. **Test local WebSocket**: `python test-websocket.py`

### Debug Commands

```bash
# Check if port 8765 is listening
netstat -an | findstr 8765

# Test local HTTP endpoint
curl http://localhost:8765/

# Check tunnel logs
cloudflared tunnel info codeclinic-ws

# Test DNS resolution
nslookup ws.codeclinic.nl
```

## Integration with Next.js

Your Next.js app can connect to the WebSocket using:
```javascript
const ws = new WebSocket('wss://ws.codeclinic.nl/ws');
```

The tunnel provides:
- ✅ Automatic SSL/TLS termination
- ✅ Global CDN distribution
- ✅ DDoS protection
- ✅ No need to expose your local server

## Security Notes

1. The tunnel only exposes the WebSocket service, not your entire local network
2. All traffic is encrypted through Cloudflare's infrastructure
3. Consider implementing authentication for production use
4. Monitor tunnel logs for unusual activity 