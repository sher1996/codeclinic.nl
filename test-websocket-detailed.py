#!/usr/bin/env python3
"""
Detailed WebSocket Test Script
Tests tunnel WebSocket connection with detailed error reporting
"""

import asyncio
import websockets
import json
import sys
import ssl
import socket

async def test_websocket_detailed(url, name):
    """Test WebSocket connection with detailed error reporting"""
    try:
        print(f"\n🔗 Testing {name}: {url}")
        print("=" * 60)
        
        # Create SSL context for WSS connections
        ssl_context = None
        if url.startswith('wss://'):
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
        
        print(f"🔧 Attempting connection...")
        async with websockets.connect(url, ssl=ssl_context) as websocket:
            print(f"✅ Connected to {name}")
            
            # Send a test message
            test_message = {"message": "Hello from detailed test script!", "test": True}
            await websocket.send(json.dumps(test_message))
            print(f"📤 Sent: {test_message}")
            
            # Wait for response
            response = await websocket.recv()
            print(f"📥 Received: {response}")
            
            print(f"✅ {name} test completed successfully!")
            
    except websockets.exceptions.InvalidURI as e:
        print(f"❌ Invalid URI: {e}")
        return False
    except websockets.exceptions.InvalidHandshake as e:
        print(f"❌ Invalid handshake: {e}")
        return False
    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ Connection closed: {e}")
        return False
    except websockets.exceptions.WebSocketException as e:
        print(f"❌ WebSocket error: {e}")
        return False
    except ConnectionRefusedError as e:
        print(f"❌ Connection refused: {e}")
        return False
    except socket.gaierror as e:
        print(f"❌ DNS resolution error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print(f"Error type: {type(e).__name__}")
        return False
    
    return True

async def main():
    """Run detailed WebSocket tests"""
    print("🚀 Detailed WebSocket Connection Tests")
    print("=" * 60)
    
    # Test tunnel connection with detailed error reporting
    tunnel_success = await test_websocket_detailed("wss://ws.codeclinic.nl/ws", "Tunnel WebSocket")
    
    print("\n" + "=" * 60)
    print("📊 Test Results:")
    print(f"Tunnel: {'✅ PASS' if tunnel_success else '❌ FAIL'}")
    
    if not tunnel_success:
        print("\n💡 Troubleshooting Steps:")
        print("1. Check if tunnel is running: cloudflared tunnel list")
        print("2. Check tunnel logs: cloudflared tunnel --config cloudflared-config.yml run")
        print("3. Verify DNS: nslookup ws.codeclinic.nl")
        print("4. Check Cloudflare SSL/TLS settings")
        print("5. Test HTTP endpoint: curl https://ws.codeclinic.nl/")

if __name__ == "__main__":
    asyncio.run(main()) 