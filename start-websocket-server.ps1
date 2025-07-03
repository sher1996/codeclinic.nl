Write-Host "Starting FastAPI WebSocket Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure you have Python and the required packages installed:" -ForegroundColor Yellow
Write-Host "pip install -r requirements.txt" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server on http://localhost:8765" -ForegroundColor Green
Write-Host "WebSocket endpoint: ws://localhost:8765/ws" -ForegroundColor Green
Write-Host ""
python app.py
Read-Host "Press Enter to continue" 