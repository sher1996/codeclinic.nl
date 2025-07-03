Write-Host "Starting Computer Help servers..." -ForegroundColor Green
Write-Host ""

# Install Python dependencies
Write-Host "[1/3] Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host ""
Write-Host "[2/3] Building Next.js project..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "[3/3] Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Start Next.js server
Write-Host "Starting Next.js server on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start" -WindowStyle Normal

# Start WebSocket bot
Write-Host "Starting WebSocket bot on port 8765..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "uvicorn app:app --port 8765 --reload" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "- Next.js site: http://localhost:3000" -ForegroundColor White
Write-Host "- WebSocket bot: http://localhost:8765" -ForegroundColor White
Write-Host "- WebSocket endpoint: ws://localhost:8765/ws" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "Stopping servers..." -ForegroundColor Red
    Get-Process | Where-Object {$_.ProcessName -eq "node" -or $_.ProcessName -eq "python"} | Stop-Process -Force
} 