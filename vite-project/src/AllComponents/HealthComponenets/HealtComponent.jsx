import React, { useState } from "react";
import HealthDashboard from "./HealthDashboard.jsx";
import HealthChatbot from "./HealthChatbot.jsx";
import EyeScanner from "./EyeScanner.jsx";
import "./HealthComponent.css"

function HealthComponent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App w-screen min-h-screen bg-[#001f3f] ">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full ">
        <header>
          <h1>🩺Astronaut Health </h1>
          <nav className="nav-tabs text-white gap-x-10 ">
            <button 

              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''} mr-10`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Health Data
            </button>
            <button 
              className={`nav-tab ${activeTab === 'chatbot' ? 'active' : ''} mr-10`}
              onClick={() => setActiveTab('chatbot')}
            >
              🤖 AI Assistant
            </button>
            <button 
              className={`nav-tab ${activeTab === 'eyescanner' ? 'active' : ''}`}
              onClick={() => setActiveTab('eyescanner')}
            >
              👁️ Eye Scanner
            </button>
          </nav>
        </header>
        
        <main className="main-content text-white">
          {activeTab === 'dashboard' && <HealthDashboard />}
          {activeTab === 'chatbot' && <HealthChatbot />}
          {activeTab === 'eyescanner' && <EyeScanner />}
        </main>
      </div>
    </div>
  );
}

export default HealthComponent;
