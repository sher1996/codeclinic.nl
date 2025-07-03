@echo off
echo Testing Cloudflare Tunnel WebSocket Connection
echo ==============================================
echo.

echo Step 1: Testing local WebSocket server...
python test-websocket.py

echo.
echo Step 2: If you have wscat installed, you can test manually:
echo wscat -c wss://ws.codeclinic.nl/ws
echo.

echo Step 3: Or use the Python test script again after starting the tunnel:
echo python test-websocket.py
echo.

echo Tunnel Status Check:
echo - Make sure FastAPI server is running: python app.py
echo - Make sure tunnel is running: cloudflared tunnel --config cloudflared-config.yml run
echo - Check DNS: nslookup ws.codeclinic.nl
echo.

pause 