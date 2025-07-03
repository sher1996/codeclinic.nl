@echo off
echo Testing WebSocket server with curl...

echo.
echo 1. Testing HTTP endpoint (should work):
curl -s http://localhost:8765/

echo.
echo 2. Testing health endpoint:
curl -s http://localhost:8765/health

echo.
echo Note: WebSocket testing requires a WebSocket client.
echo Use the Python script: python test_websocket.py
echo Or open websocket_test.html in your browser
echo.
pause 