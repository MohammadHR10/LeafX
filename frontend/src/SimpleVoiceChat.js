import { useRef, useState } from "react";

export default function SimpleVoiceChat() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM"); // Rachel voice
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);

      // If we have a final result, process it
      if (finalTranscript) {
        processUserInput(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  // Load available voices from ElevenLabs
  const loadVoices = async () => {
    try {
      const response = await fetch('/api/eleven/voices');
      if (response.ok) {
        const data = await response.json();
        setAvailableVoices(data.voices || []);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  // Simple AI response generation (you can enhance this)
  const generateAIResponse = (userText) => {
    const responses = [
      "That's interesting! Tell me more about that.",
      "I understand what you're saying. How does that make you feel?",
      "Thanks for sharing that with me. What would you like to discuss next?",
      "That's a great point! I'd love to hear your thoughts on this topic.",
      "I see! Can you elaborate on that a bit more?",
      "Fascinating! I'm learning so much from our conversation.",
      "That makes sense. What's your perspective on this matter?",
      "I appreciate you explaining that. Is there anything else you'd like to add?"
    ];

    // Simple keyword-based responses
    const lowerText = userText.toLowerCase();
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return "Hello! It's great to chat with you today. How are you doing?";
    }
    if (lowerText.includes('how are you')) {
      return "I'm doing well, thank you for asking! I'm here and ready to chat. How about you?";
    }
    if (lowerText.includes('weather')) {
      return "I wish I could check the weather for you! What's it like where you are?";
    }
    if (lowerText.includes('bye') || lowerText.includes('goodbye')) {
      return "Goodbye! It was wonderful talking with you. Take care!";
    }

    // Random response
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Process user input and generate AI response
  const processUserInput = async (userText) => {
    if (!userText.trim()) return;

    setIsProcessing(true);
    
    try {
      // Generate AI response
      const aiResponse = generateAIResponse(userText);
      
      // Convert AI response to speech using ElevenLabs
      const response = await fetch('/api/eleven/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: aiResponse,
          voice_id: selectedVoice
        })
      });

      if (response.ok) {
        const data = await response.json();
        playAudioFromBase64(data.audio_base64);
        
        // Update transcript with AI response
        setTranscript(prev => prev + `\n\nAI: ${aiResponse}\n\nYou: `);
      } else {
        const error = await response.json();
        console.error('TTS Error:', error);
        alert('Error generating speech: ' + error.error);
      }
    } catch (error) {
      console.error('Error processing input:', error);
      alert('Error processing your input');
    } finally {
      setIsProcessing(false);
    }
  };

  // Play audio from base64
  const playAudioFromBase64 = (base64Audio) => {
    try {
      const audioBlob = new Blob([
        Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      setTranscript("You: ");
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Load voices on component mount
  useState(() => {
    loadVoices();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Simple Voice AI Chat (Free Tier)</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This version works with ElevenLabs free tier using Text-to-Speech API
      </p>

      {/* Voice Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="voice-select" style={{ marginRight: '10px' }}>
          Choose Voice:
        </label>
        <select 
          id="voice-select"
          value={selectedVoice} 
          onChange={(e) => setSelectedVoice(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px' }}
        >
          <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Default)</option>
          <option value="AZnzlk1XvdvUeBnXmlld">Domi</option>
          <option value="EXAVITQu4vr4xnSDxMaL">Bella</option>
          <option value="ErXwobaYiN019PkySvjV">Antoni</option>
          <option value="MF3mGyEYCl7XYWbV9V6O">Elli</option>
          <option value="TxGEqnHWrfWFTfGW9XjX">Josh</option>
          <option value="VR6AewLTigWG4xSOukaG">Arnold</option>
          <option value="pNInz6obpgDQGcFmaJgB">Adam</option>
          <option value="yoZ06aMxZJJ28mfd3POQ">Sam</option>
        </select>
      </div>

      {/* Control Buttons */}
      <div style={{ marginBottom: '16px' }}>
        {!isListening ? (
          <button 
            onClick={startListening}
            disabled={isProcessing}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🎤 Start Talking
          </button>
        ) : (
          <button 
            onClick={stopListening}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            ⏹️ Stop Listening
          </button>
        )}

        <button
          onClick={() => setTranscript("")}
          style={{
            padding: '12px 24px',
            backgroundColor: '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Chat
        </button>
      </div>

      {/* Status */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ 
          color: isListening ? 'green' : isProcessing ? 'orange' : 'gray',
          fontWeight: 'bold'
        }}>
          Status: {
            isListening ? '🎤 Listening...' : 
            isProcessing ? '🤖 AI Thinking...' : 
            '💤 Ready'
          }
        </span>
      </div>

      {/* Conversation Display */}
      <div>
        <h3>Conversation:</h3>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '4px',
          minHeight: '200px',
          maxHeight: '400px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {transcript || 'Start a conversation by clicking "Start Talking"...'}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>How to use:</h4>
        <ol>
          <li>Click "Start Talking" and speak</li>
          <li>The AI will respond with speech and text</li>
          <li>Continue the conversation naturally</li>
          <li>Click "Stop Listening" when done</li>
        </ol>
        <p><strong>Note:</strong> This uses the browser's speech recognition and ElevenLabs free tier TTS.</p>
      </div>
    </div>
  );
}
