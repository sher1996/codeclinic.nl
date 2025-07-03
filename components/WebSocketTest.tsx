'use client';

import { useState, useEffect } from 'react';
import { websocketClient } from '@/lib/websocket';

export default function WebSocketTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
    
    // Set up WebSocket event handlers
    websocketClient.onConnect(() => {
      setIsConnected(true);
      setMessages(prev => [...prev, 'Connected to WebSocket server']);
    });

    websocketClient.onDisconnect(() => {
      setIsConnected(false);
      setMessages(prev => [...prev, 'Disconnected from WebSocket server']);
    });

    websocketClient.onMessage((data) => {
      setMessages(prev => [...prev, `Received: ${JSON.stringify(data)}`]);
    });

    // Connect to WebSocket
    websocketClient.connect();

    // Cleanup on unmount
    return () => {
      websocketClient.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      websocketClient.send({
        type: 'message',
        message: inputMessage,
        timestamp: Date.now()
      });
      setMessages(prev => [...prev, `Sent: ${inputMessage}`]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">WebSocket Test</h2>
      
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      <div className="h-64 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
        <div className="space-y-1">
          {messages.map((message, index) => (
            <div key={index} className="text-sm text-gray-700">
              {message}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Environment: {isClient && window.location.hostname === 'localhost' ? 'Development' : 'Production'}</p>
        <p>WebSocket URL: {isClient && window.location.hostname === 'localhost' ? 'ws://localhost:8765/ws' : 'wss://ws.codeclinic.nl/ws'}</p>
      </div>
    </div>
  );
} 