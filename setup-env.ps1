# Setup Environment Variables for Computer Help Bot
Write-Host "🔧 Setting up environment variables for Computer Help Bot" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    
    # Create .env file with template
    $envContent = @"
# WebSocket URL for voice API
WS_URL=ws://localhost:8765/ws

# OpenAI API Key (required for bot responses)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Other environment variables
NODE_ENV=development
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit the .env file and add your actual OpenAI API key!" -ForegroundColor Red
    Write-Host "   Get your API key from: https://platform.openai.com/api-keys" -ForegroundColor Cyan
    Write-Host ""
}

# Load environment variables from .env file
if (Test-Path ".env") {
    Write-Host "📖 Loading environment variables from .env file..." -ForegroundColor Yellow
    
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Set environment variable
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "   Set $name" -ForegroundColor Gray
        }
    }
    
    Write-Host "✅ Environment variables loaded" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file and add your OpenAI API key" -ForegroundColor White
Write-Host "2. Run: uvicorn app:app --port 8765 --reload" -ForegroundColor White
Write-Host "3. Test with: python test-websocket.py" -ForegroundColor White
Write-Host "4. Make a call to test the voice bot" -ForegroundColor White
Write-Host "" 