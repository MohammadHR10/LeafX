import { useRef, useState, useEffect } from "react";

export default function FreeTierVoiceChat() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        processMessage(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // processMessage is intentionally excluded to avoid recreation loop

  const processMessage = async (message) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Get AI response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!chatResponse.ok) {
        throw new Error(`HTTP error! status: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      setAiResponse(chatData.response);

      // Try ElevenLabs TTS first, fallback to browser TTS
      try {
        const ttsResponse = await fetch('/api/eleven/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: chatData.response,
            voice_id: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
          }),
        });

        if (ttsResponse.ok) {
          const ttsData = await ttsResponse.json();
          await playAudioFromBase64(ttsData.audio_base64);
        } else {
          console.log('ElevenLabs TTS not available, using browser TTS');
          await playWithBrowserTTS(chatData.response);
        }
      } catch (ttsError) {
        console.log('ElevenLabs TTS failed, using browser TTS:', ttsError);
        await playWithBrowserTTS(chatData.response);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = 'Sorry, I encountered an error processing your message.';
      setAiResponse(errorMessage);
      await playWithBrowserTTS(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const playWithBrowserTTS = async (text) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsPlaying(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      } else {
        console.log('Browser TTS not supported');
        resolve();
      }
    });
  };

  const playAudioFromBase64 = async (base64Audio) => {
    try {
      setIsPlaying(true);
      
      // Convert base64 to blob
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (error) => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        
        audio.play().catch(reject);
      });
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setAiResponse("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleTextInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const message = e.target.value.trim();
      setTranscript(message);
      processMessage(message);
      e.target.value = '';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🎤 AI Expert Advisor - Voice Chat</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Your personal expert consultant across all domains - from tech & business to health & creativity
        <br />
        <small>Powered by advanced AI reasoning + Browser Speech Recognition + Text-to-Speech</small>
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={startListening}
            disabled={isListening || isProcessing}
            style={{
              padding: '12px 24px',
              backgroundColor: isListening ? '#ff6b6b' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isListening || isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {isListening ? '🔴 Listening...' : '🎤 Start Speaking'}
          </button>
          
          <button
            onClick={stopListening}
            disabled={!isListening}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: !isListening ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            ⏹️ Stop
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Or type your message and press Enter..."
          onKeyPress={handleTextInput}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            marginTop: '10px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* User Speech */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#2196F3' }}>📝 You said:</h3>
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '16px',
            borderRadius: '8px',
            minHeight: '100px',
            border: '2px solid #e3f2fd',
            fontSize: '16px'
          }}>
            {transcript || 'Your speech will appear here...'}
          </div>
        </div>

        {/* AI Response */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#4CAF50' }}>🤖 AI Response:</h3>
          <div style={{
            backgroundColor: '#f8fff8',
            padding: '16px',
            borderRadius: '8px',
            minHeight: '100px',
            border: '2px solid #e8f5e8',
            fontSize: '16px'
          }}>
            {isProcessing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #4CAF50',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Processing...
              </div>
            ) : aiResponse || 'AI response will appear here...'}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', fontSize: '14px' }}>
        <div style={{ color: isListening ? 'green' : 'gray' }}>
          🎤 Microphone: {isListening ? 'Active' : 'Inactive'}
        </div>
        <div style={{ color: isProcessing ? 'orange' : 'gray' }}>
          🧠 AI: {isProcessing ? 'Processing' : 'Ready'}
        </div>
        <div style={{ color: isPlaying ? 'blue' : 'gray' }}>
          🔊 Voice: {isPlaying ? 'Speaking' : 'Silent'}
        </div>
      </div>

      {/* CSS for spinning animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}
