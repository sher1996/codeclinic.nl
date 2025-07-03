@echo off
echo Starting WebSocket Test Environment...
echo.

echo Starting FastAPI WebSocket Server on port 8765...
start "FastAPI WebSocket Server" cmd /k "python -m uvicorn app:app --port 8765 --reload"

echo Waiting 3 seconds for FastAPI server to start...
timeout /t 3 /nobreak > nul

echo Starting Next.js Development Server on port 3000...
start "Next.js Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo - FastAPI WebSocket Server: http://localhost:8765
echo - Next.js Dev Server: http://localhost:3000
echo.
echo Test the WebSocket connection at: http://localhost:3000
echo.
pause 