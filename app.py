from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel('gemini-2.0-flash')



def get_gemini_response(query):
    # Create a focused home energy audit tool prompt
    prompt = f"""
You are a smart AI assistant specialized in Home Energy Audits. Your goal is to help users improve their home energy efficiency, reduce energy bills, and adopt sustainable living practices.

User Query: "{query}"

Please respond with:
1. Practical advice on improving home energy usage
2. Suggestions for energy-efficient appliances or insulation
3. Information on solar, HVAC, lighting, or thermostat optimization
4. Any applicable tips on government rebates or energy audits
5. Clear, friendly tone with bullet points or emojis when helpful

If the user asks something unrelated, try to relate it back to energy use, sustainability, or environmental impact.
"""
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "I apologize, but I encountered an error processing your request. Please try again."



@app.route('/api/send_message', methods=['POST'])
def send_message():
    data = request.json
    user_message = data.get('message', '')
    
    # Get AI-generated response for any query
    response_message = get_gemini_response(user_message)
    
    return jsonify({'response': response_message})

if __name__ == '__main__':
    app.run(debug=True)