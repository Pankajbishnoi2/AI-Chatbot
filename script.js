

class ChatBot {
    constructor() {
        this.messages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-btn');
        
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });

        // Welcome message focused on course recommendations
        this.addMessage('bot', '👋 Welcome to your AI Home Energy Audit Assistant! I can help you understand your home’s energy usage, reduce energy waste, and find ways to lower your utility bills.\n\n' +
            'How can I assist you with your home energy questions today?');
        
            
    }

    addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // Convert newlines to <br> tags and preserve emojis
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<div class="message-content">${formattedText}</div>`;
        
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    async handleUserInput() {
        const userText = this.userInput.value.trim();
        if (!userText) return;

        this.addMessage('user', userText);
        this.userInput.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = '<div class="message-content typing-indicator">Thinking...</div>';
        this.messages.appendChild(typingDiv);
        this.messages.scrollTop = this.messages.scrollHeight;

        try {
            const response = await this.sendMessageToAPI(userText);
            // Remove typing indicator
            this.messages.removeChild(typingDiv);
            this.addMessage('bot', response);
        } catch (error) {
            // Remove typing indicator
            this.messages.removeChild(typingDiv);
            this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
            console.error('Error:', error);
        }
    }

    async sendMessageToAPI(message) {
        try {
            const response = await fetch('http://localhost:5000/api/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// Profile dropdown functionality
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');

profileIcon.addEventListener('click', () => {
    profileDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
});