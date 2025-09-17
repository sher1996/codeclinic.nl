import os, json, asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pydantic import BaseModel
import time

# Load environment variables from .env file
load_dotenv()

# Verify API key is loaded
print("API key loaded?", bool(os.getenv("OPENAI_API_KEY")))

app = FastAPI(title="Code Clinic VIP WebSocket Bot")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://codeclinic.nl",
        "https://www.codeclinic.nl",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Use a faster model for short HTTP replies
FAST_MODEL = os.getenv("FAST_OPENAI_MODEL", "gpt-3.5-turbo-0125")
STREAM_MODEL = os.getenv("STREAM_OPENAI_MODEL", "gpt-4o-mini")

SYSTEM = os.getenv("SYSTEM_PROMPT", """Je bent Sam – een vriendelijke computerhulp met >15 jaar ervaring. Spreek altijd Nederlands.

=== DIENSTEN & PRIJZEN ===
• Virus- & malware-verwijdering – €49
• Computer opschonen & versnellen – €39  
• Wifi / netwerk optimalisatie – €45
• Back-ups & data-herstel – €45
• Printer / scanner instellen – €35
• Software & updates – €35
• Remote hulp – €44/uur
• Aan-huis hulp – €50/uur

=== HOE TE HELPEN ===
• Geef concrete, praktische oplossingen voor computerproblemen
• Leg uit wat er aan de hand is en hoe je het kunt oplossen
• Bied directe hulp zonder constant contactgegevens te noemen
• Als je een probleem niet kunt oplossen, zeg dan eerlijk "Dat weet ik niet zeker"
• Focus op het probleem oplossen, niet op verkoop

=== TONE OF VOICE ===
• Vriendelijk, geduldig, en behulpzaam
• Geef korte, duidelijke antwoorden (max 2-3 zinnen)
• Help de gebruiker direct met hun computerprobleem
• Noem alleen prijzen als de gebruiker erom vraagt
• Verzín nooit bedragen of diensten die niet bestaan
""")

class ChatRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Code Clinic VIP WebSocket Bot is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Handle HTTP chat requests from the voice system"""
    try:
        print(f"📞 CHAT REQUEST: {request.text}")
        start_time = time.time()

        response = await client.chat.completions.create(
            model=FAST_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": request.text}
            ],
            max_tokens=120,
            timeout=20,
        )

        reply = response.choices[0].message.content or "Sorry, ik begrijp het niet."
        end_time = time.time()
        response_time = end_time - start_time

        print(f"🤖 BOT REPLY: {reply}")
        print(f"⏱️  RESPONSE TIME: {response_time:.2f}s")

        return {"reply": reply}

    except Exception as e:
        print(f"⚠️ OpenAI error in /chat: {e}")
        return {"reply": "Sorry, er ging iets mis."}

@app.websocket("/ws")
async def relay(ws: WebSocket):
    await ws.accept()
    print("📞  Caller connected!")
    try:
        while True:
            raw = await ws.receive_text()
            event = json.loads(raw)

            # NEW: show the keys Twilio actually uses
            print("← RAW:", raw)
            print("   keys:", list(event.keys()))

            # Handle Twilio voice input - they send "voicePrompt" not "text"
            if not isinstance(event, dict):
                continue
                
            # Check for voicePrompt (Twilio format) or text (fallback)
            user = None
            if "voicePrompt" in event:
                user = event["voicePrompt"]
            elif "text" in event:
                user = event["text"]
            else:
                continue
            print("← USER:", user)

            # ---------- call OpenAI ----------------
            reply_accum = ""
            try:
                stream = await client.chat.completions.create(
                    model=STREAM_MODEL,
                    stream=True,
                    messages=[
                        {"role":"system","content":SYSTEM},
                        {"role":"user","content":user}
                    ],
                    max_tokens=120,
                    timeout=20,
                )
                async for chunk in stream:
                    delta = chunk.choices[0].delta.content or ""
                    if delta:
                        reply_accum += delta

                # Send complete response at once
                if reply_accum:
                    response_frame = {
                        "type": "text",
                        "token": reply_accum,
                        "last": True
                    }
                    await ws.send_json(response_frame)
                    print("→ BOT frame sent")
                print("→ BOT:", reply_accum)
            except Exception as e:
                # send a very short apology if OpenAI fails
                await ws.send_json({
                    "type": "text",
                    "token": "Sorry, er ging iets mis.",
                    "last": True
                })
                print("⚠️ OpenAI error:", e)

    except WebSocketDisconnect:
        print("Caller hung up")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765) 