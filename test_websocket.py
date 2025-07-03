import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8765/ws"
    
    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket server")
        
        # Test 1: Send a setup message (should be ignored)
        setup_msg = {
            "type": "setup",
            "sessionId": "test123",
            "callSid": "CA123456",
            "from": "+1234567890",
            "to": "+0987654321"
        }
        print(f"\n1. Sending setup message: {json.dumps(setup_msg)}")
        await websocket.send(json.dumps(setup_msg))
        
        # Wait a bit to see if there's any response
        try:
            response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
            print(f"❌ Got unexpected response: {response}")
        except asyncio.TimeoutError:
            print("✅ Correctly ignored setup message (no response)")
        
        # Test 2: Send an error message (should be ignored)
        error_msg = {
            "type": "error",
            "description": "Test error message"
        }
        print(f"\n2. Sending error message: {json.dumps(error_msg)}")
        await websocket.send(json.dumps(error_msg))
        
        try:
            response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
            print(f"❌ Got unexpected response: {response}")
        except asyncio.TimeoutError:
            print("✅ Correctly ignored error message (no response)")
        
        # Test 3: Send actual user text (should get AI response)
        text_msg = {
            "text": "Hallo, ik heb een probleem met mijn computer"
        }
        print(f"\n3. Sending user text: {json.dumps(text_msg)}")
        await websocket.send(json.dumps(text_msg))
        
        # Collect streaming response
        full_response = ""
        try:
            while True:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                if "text" in response_data:
                    full_response += response_data["text"]
                    print(f"← Received chunk: {response_data['text']}")
                else:
                    print(f"← Received non-text: {response}")
        except asyncio.TimeoutError:
            print(f"✅ Got complete AI response: {full_response}")
        
        # Test 4: Send another user message
        text_msg2 = {
            "text": "Wat zijn jullie tarieven?"
        }
        print(f"\n4. Sending second user text: {json.dumps(text_msg2)}")
        await websocket.send(json.dumps(text_msg2))
        
        # Collect streaming response
        full_response2 = ""
        try:
            while True:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                if "text" in response_data:
                    full_response2 += response_data["text"]
                    print(f"← Received chunk: {response_data['text']}")
                else:
                    print(f"← Received non-text: {response}")
        except asyncio.TimeoutError:
            print(f"✅ Got complete AI response: {full_response2}")

if __name__ == "__main__":
    asyncio.run(test_websocket()) 