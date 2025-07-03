from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from typing import List

app = FastAPI(title="Computer Help WebSocket Bot")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
                print(f"Received message: {message}")
                
                # Echo back the message for now
                response = {
                    "type": "response",
                    "message": f"Bot received: {message.get('message', 'Hello!')}",
                    "timestamp": asyncio.get_event_loop().time()
                }
                
                await manager.send_personal_message(json.dumps(response), websocket)
                
            except json.JSONDecodeError:
                # Handle plain text messages
                response = {
                    "type": "response", 
                    "message": f"Bot received: {data}",
                    "timestamp": asyncio.get_event_loop().time()
                }
                await manager.send_personal_message(json.dumps(response), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765) 