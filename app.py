from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import os
from typing import List
import openai
from datetime import datetime
from dotenv import load_dotenv

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
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

async def get_ai_response(user_message: str) -> str:
    """Get response from OpenAI for user message"""
    try:
        if not os.getenv("OPENAI_API_KEY"):
            return "I'm sorry, but I'm not properly configured to respond right now. Please contact CodeClinic support."
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are the helpful voice agent for CodeClinic.nl. Answer in Dutch unless the caller speaks English. Keep replies under 80 characters for low latency.

COMPANY: CodeClinic.nl - Expert computerhulp in Rotterdam sinds 2020. Telefoon: +31-6-24837889. Email: info@codeclinic.nl.

SLOGAN: "Niet opgelost = geen kosten" (Not solved = no costs).

SERVICES & PRICING:
- Virus & malware verwijdering: vanaf €49
- Computer opschonen & versnellen: vanaf €39  
- Wifi & netwerkoptimalisatie: vanaf €45
- Remote computerhulp: €44/uur (direct start, per minuut facturering)
- Aan huis service: €50/uur (≤10km Rotterdam, daarna €0,25/km)
- Service bundles: Virus Scan €99, Computer Tune-up €79

OTHER SERVICES: E-mail instellen (€35), smartphone uitleg (€35), backup & herstel (€45), wachtwoorden & beveiliging (€35), videobellen (€35), online bankieren (€45), streaming diensten (€35), foto's ordenen (€45), printer hulp (€35), programma's bijwerken (€35), toegankelijkheid (€35).

GUARANTEE: "Niet opgelost = geen kosten" - als wij het probleem niet oplossen, betaalt u niets. Uitzonderingen: hardware vervanging, software licenties, externe factoren.

LOCATION: Rotterdam en omgeving (Schiedam, Vlaardingen, Capelle, Spijkenisse, Barendrecht, Ridderkerk, Krimpen, Brielle, Hellevoetsluis).

PAYMENT: iDEAL, contant, pin. Alle prijzen incl. 21% BTW.

HOURS: Ma-Vr 09:00-17:00, Za 10:00-15:00.

TONE: Vriendelijk, professioneel, geduldig met senioren. Kort en duidelijk antwoorden."""
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return "I'm sorry, I'm having trouble processing your request right now. Please try again or contact CodeClinic directly."

@app.get("/")
async def root():
    return {"message": "Computer Help WebSocket Bot is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "connections": len(manager.active_connections)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                # Log incoming message from Twilio
                print(f"← {json.dumps(message)}")
                
                # Handle Twilio ConversationRelay messages
                if "text" in message:
                    user_text = message["text"]
                    
                    # Get AI response
                    ai_response = await get_ai_response(user_text)
                    
                    # Prepare response for Twilio
                    response = {
                        "text": ai_response
                    }
                    
                    # Log outgoing response to Twilio
                    print(f"→ {json.dumps(response)}")
                    
                    # Send response back to Twilio
                    await manager.send_personal_message(json.dumps(response), websocket)
                    
                else:
                    # Handle other message types
                    print(f"Received non-text message: {message}")
                    response = {
                        "text": "I received your message but I'm not sure how to process it. Could you please try speaking again?"
                    }
                    await manager.send_personal_message(json.dumps(response), websocket)
                
            except json.JSONDecodeError:
                # Handle plain text messages (fallback)
                print(f"Received non-JSON message: {data}")
                response = {
                    "text": "I received your message but I'm not sure how to process it. Could you please try speaking again?"
                }
                await manager.send_personal_message(json.dumps(response), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765) 