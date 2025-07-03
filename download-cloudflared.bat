@echo off
echo Downloading cloudflared for Windows...
powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile 'cloudflared.exe'}"
echo Download complete!
pause 