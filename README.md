# Computer Help Bot

A FastAPI-based computer help bot deployed on Fly.io.

## Deployment

This project is deployed on Fly.io at: https://computer-help.fly.dev/

## Endpoints

- **Health Check**: `https://computer-help.fly.dev/health`
- **Chat API**: `https://computer-help.fly.dev/chat`
- **WebSocket**: `wss://computer-help.fly.dev/ws`

## Local Development

```bash
pip install -r requirements.txt
python app.py
```

## Architecture

- **Backend**: FastAPI with WebSocket support
- **AI**: OpenAI GPT-4 integration
- **Voice**: ElevenLabs TTS integration
- **Deployment**: Fly.io

## Note

This repository contains a Python FastAPI application. The Next.js frontend has been moved to `nextjs-backup/` directory.
