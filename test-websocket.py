#!/usr/bin/env python3
"""
Test script for the WebSocket bot
Simulates Twilio ConversationRelay messages
"""

import asyncio
import websockets
import json
import sys

async def test_websocket():
    """Test the WebSocket connection and simulate Twilio messages"""
    uri = "ws://localhost:8765/ws"
    
    try:
        print("🔗 Connecting to WebSocket server...")
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to WebSocket server")
            
            # Test message 1: "Tell me about CodeClinic"
            test_message = {"text": "Tell me about CodeClinic"}
            print(f"\n📤 Sending: {json.dumps(test_message)}")
            await websocket.send(json.dumps(test_message))
            
            # Wait for response
            response = await websocket.recv()
            print(f"📥 Received: {response}")
            
            # Test message 2: "What services do you offer?"
            test_message2 = {"text": "What services do you offer?"}
            print(f"\n📤 Sending: {json.dumps(test_message2)}")
            await websocket.send(json.dumps(test_message2))
            
            # Wait for response
            response2 = await websocket.recv()
            print(f"📥 Received: {response2}")
            
            print("\n✅ WebSocket test completed successfully!")
            
    except websockets.exceptions.ConnectionRefused:
        print("❌ Connection refused. Make sure the WebSocket server is running on port 8765")
        print("   Run: uvicorn app:app --port 8765 --reload")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 WebSocket Bot Test")
    print("=" * 50)
    asyncio.run(test_websocket()) 