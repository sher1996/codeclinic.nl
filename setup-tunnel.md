# Manual Cloudflare Tunnel Setup

Since the automated setup had some issues, here's how to set up the tunnel manually:

## Step 1: Install Cloudflare CLI

### Option A: Download from GitHub
1. Go to: https://github.com/cloudflare/cloudflared/releases/latest
2. Download `cloudflared-windows-amd64.exe`
3. Rename it to `cloudflared.exe` and place it in your project root
4. Or add it to your system PATH

### Option B: Using Chocolatey (if installed)
```powershell
choco install cloudflared
```

### Option C: Using Scoop (if installed)
```powershell
scoop install cloudflared
```

## Step 2: Login to Cloudflare
```bash
cloudflared tunnel login
```

This will:
1. Open your browser to authenticate with Cloudflare
2. Download a certificate to `~/.cloudflared/cert.pem`

## Step 3: Create the Tunnel
```bash
cloudflared tunnel create codeclinic-ws
```

This will:
1. Create a tunnel named `codeclinic-ws`
2. Generate credentials file at `~/.cloudflared/codeclinic-ws.json`

## Step 4: Configure DNS
```bash
cloudflared tunnel route dns codeclinic-ws ws.codeclinic.nl
```

## Step 5: Update Configuration
Make sure your `cloudflared-config.yml` points to the correct credentials file:

```yaml
tunnel: codeclinic-ws
credentials-file: ~/.cloudflared/codeclinic-ws.json

ingress:
  - hostname: ws.codeclinic.nl
    service: http://localhost:8765
  - service: http_status:404
```

## Step 6: Test the Setup

1. **Start FastAPI server** (in one terminal):
   ```bash
   python app.py
   ```

2. **Start tunnel** (in another terminal):
   ```bash
   cloudflared tunnel --config cloudflared-config.yml run
   ```

3. **Test connection** (in a third terminal):
   ```bash
   python test-websocket.py
   ```

## Expected Output

### Tunnel startup:
```
2025-07-03T14:12:01Z INF Starting tunnel codeclinic-ws (UUID …)
2025-07-03T14:12:03Z INF Route propagating, OK  ✓  https://ws.codeclinic.nl
```

### Test results:
```
🚀 WebSocket Connection Tests
==================================================
🔗 Testing Local WebSocket: ws://localhost:8765/ws
==================================================
✅ Connected to Local WebSocket
✅ Local WebSocket test completed successfully!

🔗 Testing Tunnel WebSocket: wss://ws.codeclinic.nl/ws
==================================================
✅ Connected to Tunnel WebSocket
✅ Tunnel WebSocket test completed successfully!

📊 Test Results:
Local: ✅ PASS
Tunnel: ✅ PASS
```

## Troubleshooting

### If tunnel creation fails:
- Make sure you're logged in: `cloudflared tunnel login`
- Check your Cloudflare account has tunnel permissions
- Try a different tunnel name if `codeclinic-ws` is taken

### If DNS setup fails:
- Make sure you own the domain `codeclinic.nl`
- Check that the domain is added to your Cloudflare account
- Verify you have DNS management permissions

### If tunnel won't start:
- Check the credentials file path in `cloudflared-config.yml`
- Verify the FastAPI server is running on port 8765
- Check firewall settings for port 8765

### If WebSocket connection fails:
- Ensure SSL/TLS mode is set to "Full" in Cloudflare dashboard
- Check that the tunnel is running and shows "Route propagating, OK"
- Verify the DNS record `ws.codeclinic.nl` points to the tunnel 