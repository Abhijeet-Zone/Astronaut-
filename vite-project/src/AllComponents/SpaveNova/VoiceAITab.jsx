import React, { useState, useEffect, useRef } from 'react';

// The URL of your new Python backend
const BACKEND_URL = 'http://127.0.0.1:5000/api/ask_gemini';
const GREETING_MESSAGE = "Hi, I am Space Nova, your space friend. How can I help you with your space exploration today?";

function VoiceAITab() {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [statusMessage, setStatusMessage] = useState('Click the mic to activate Space Nova');
    const recognitionRef = useRef(null);

    // --- Core Functions ---

    const speak = (text, onEndCallback) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.1;
            utterance.onend = () => {
                if (onEndCallback) onEndCallback();
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = async (command) => {
        setTranscript(command);
        setStatusMessage('Thinking...');
        setIsProcessing(true);

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: command }),
            });

            if (!response.ok) {
                throw new Error('Failed to get a response from the backend.');
            }

            const data = await response.json();
            const geminiAnswer = data.answer;
            
            setAiResponse(geminiAnswer);
            speak(geminiAnswer, startRecognition); // Speak the answer, then listen again

        } catch (error) {
            console.error("Error communicating with backend:", error);
            const errorMessage = "I'm sorry, I'm having trouble connecting to my knowledge base right now.";
            setAiResponse(errorMessage);
            speak(errorMessage, startRecognition);
        } finally {
            setIsProcessing(false);
        }
    };

    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatusMessage('Speech recognition not supported.');
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setStatusMessage('Listening...');
        };

        recognition.onresult = (event) => {
            const userCommand = event.results[0][0].transcript;
            processCommand(userCommand);
        };
        
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const stopConversation = () => {
        window.speechSynthesis.cancel();
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        setIsProcessing(false);
        setStatusMessage('Click the mic to activate Space Nova');
    };

    const handleMicClick = () => {
        if (isListening || isProcessing) {
            stopConversation();
        } else {
            speak(GREETING_MESSAGE, startRecognition);
        }
    };
    
    useEffect(() => {
        return () => stopConversation();
    }, []);

    return (
        <div id="voice-ai" className="tab-content active">
            <div className="voice-assistant">
                <h2>🎤 Advanced Voice Assistant</h2>
                <p>Click the microphone and ask any question about space!</p>
                
                <button 
                  className={`mic-button ${(isListening || isProcessing) ? 'listening' : ''}`} 
                  onClick={handleMicClick}
                  disabled={isProcessing}
                >
                    🎤
                    {/* Visual effects can remain the same */}
                </button>
                
                <div id="voiceStatus">{statusMessage}</div>

                <div id="voiceTranscript" style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', minHeight: '100px', textAlign: 'left' }}>
                    {transcript && <p><strong>You said:</strong> {transcript}</p>}
                    {aiResponse && <p style={{ marginTop: '10px' }}><strong>Space Nova:</strong> {aiResponse}</p>}
                </div>
            </div>
        </div>
    );
}

export default VoiceAITab;