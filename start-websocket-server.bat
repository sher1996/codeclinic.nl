@echo off
echo Starting FastAPI WebSocket Server...
echo.
echo Make sure you have Python and the required packages installed:
echo pip install -r requirements.txt
echo.
echo Starting server on http://localhost:8765
echo WebSocket endpoint: ws://localhost:8765/ws
echo.
python app.py
pause 