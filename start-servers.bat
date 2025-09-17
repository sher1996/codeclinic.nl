@echo off
echo Starting Code Clinic VIP servers...
echo.

echo [1/2] Installing Python dependencies...
pip install -r requirements.txt

echo.
echo [2/2] Starting servers...
echo.

echo Starting Next.js server on port 3000...
start "Next.js Server" cmd /k "npm run start"

echo Starting WebSocket bot on port 8765...
start "WebSocket Bot" cmd /k "uvicorn app:app --port 8765 --reload"

echo.
echo Both servers are starting...
echo - Next.js site: http://localhost:3000
echo - WebSocket bot: http://localhost:8765
echo - WebSocket endpoint: ws://localhost:8765/ws
echo.
echo Press any key to close this window...
pause > nul 