import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Check if API key exists
api_key = os.getenv("OPENAI_API_KEY")
print(f"API Key exists: {bool(api_key)}")
if api_key:
    print(f"API Key starts with: {api_key[:10]}...")

# Test OpenAI client
try:
    client = openai.OpenAI(api_key=api_key)
    print("OpenAI client created successfully")
    
    # Test a simple API call
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Say hello in Dutch"}
        ],
        max_tokens=10
    )
    print(f"API Response: {response.choices[0].message.content}")
    
except Exception as e:
    print(f"Error: {e}") 