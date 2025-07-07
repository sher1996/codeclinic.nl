import os, json, asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Verify API key is loaded
print("API key loaded?", bool(os.getenv("OPENAI_API_KEY")))

app = FastAPI(title="Computer Help WebSocket Bot")

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

SYSTEM = os.getenv("SYSTEM_PROMPT", """Je bent Sam, een vriendelijke computerhulp voor CodeClinic.nl. Spreek altijd Nederlands, tenzij de beller expliciet vraagt om Engels. Houd antwoorden onder 80 karakters voor snelle reacties.

BEDRIJF: CodeClinic.nl - Expert computerhulp in Rotterdam sinds 2020. Telefoon: +31-6-24837889. Email: info@codeclinic.nl.

SLOGAN: "Niet opgelost = geen kosten"

DIENSTEN & PRIJZEN:
- Virus & malware verwijdering: vanaf €49
- Computer opschonen & versnellen: vanaf €39  
- Wifi & netwerkoptimalisatie: vanaf €45
- Remote computerhulp: €44/uur (direct start, per minuut facturering)
- Aan huis service: €50/uur (≤10km Rotterdam, daarna €0,25/km)
- Service bundles: Virus Scan €99, Computer Tune-up €79

ANDERE DIENSTEN: E-mail instellen (€35), smartphone uitleg (€35), backup & herstel (€45), wachtwoorden & beveiliging (€35), videobellen (€35), online bankieren (€45), streaming diensten (€35), foto's ordenen (€45), printer hulp (€35), programma's bijwerken (€35), toegankelijkheid (€35).

GARANTIE: "Niet opgelost = geen kosten" - als wij het probleem niet oplossen, betaalt u niets. Uitzonderingen: hardware vervanging, software licenties, externe factoren.

LOCATIE: Rotterdam en omgeving (Schiedam, Vlaardingen, Capelle, Spijkenisse, Barendrecht, Ridderkerk, Krimpen, Brielle, Hellevoetsluis).

BETALING: iDEAL, contant, pin. Alle prijzen incl. 21% BTW.

OPENINGSTIJDEN: Ma-Vr 09:00-17:00, Za 10:00-15:00.

TOON: Vriendelijk, natuurlijk, geduldig met senioren. Spreek als een echte persoon, niet als een robot. Kort en duidelijk antwoorden.""")

class ChatRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Computer Help WebSocket Bot is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Handle HTTP chat requests from the voice system"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": request.text}
            ],
            max_tokens=120,
            timeout=20,
        )
        
        reply = response.choices[0].message.content or "Sorry, ik begrijp het niet."
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
                    model="gpt-4o-mini",
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