import React, { useState } from 'react';

function ChatTab() {
  const initialMessages = [
    { sender: 'ai', text: "Hello! I'm your aerospace engineering expert. Ask me anything about space missions, planetary science, rocket technology, or the cosmos!" }
  ];
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: 'user', text: inputValue }]);
      setInputValue('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Simulated AI response to: "' + inputValue + '"' }]);
      }, 1000);
    }
  };
  
  return (
    <div id="chat" className="tab-content active">
        <div className="chat-interface">
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🤖 AI Space Expert Chat</h2>
            
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}-message`}>
                  <strong>{msg.sender === 'ai' ? 'SPACE NOVA:' : 'You:'}</strong> {msg.text}
                </div>
              ))}
            </div>
            
            <div className="input-area">
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder="Ask about space missions..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-btn" onClick={handleSendMessage}>Send 🚀</button>
            </div>
        </div>
    </div>
  );
}

export default ChatTab;