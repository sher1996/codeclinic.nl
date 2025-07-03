import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8765/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket server")
            
            # Send a test message
            test_message = {"text": "hallo"}
            print(f"Sending: {test_message}")
            await websocket.send(json.dumps(test_message))
            
            # Wait for response
            response = await websocket.recv()
            print(f"Received: {response}")
            
            # Parse the response
            try:
                response_data = json.loads(response)
                print(f"AI Response: {response_data.get('text', 'No text in response')}")
            except json.JSONDecodeError:
                print(f"Raw response: {response}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket()) 