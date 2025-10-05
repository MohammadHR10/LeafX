import { useState } from "react";

export default function SimpleTTS() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  async function generateSpeech() {
    if (!text.trim()) {
      alert("Please enter some text to convert to speech");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/eleven/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice_id: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      const { audio_base64 } = await response.json();
      
      // Convert base64 to audio URL
      const bytes = Uint8Array.from(atob(audio_base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      
      // Auto-play the audio
      const audio = new Audio(url);
      audio.play().catch(console.error);

    } catch (error) {
      console.error("Error generating speech:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <h2>ElevenLabs Text-to-Speech Demo</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Enter text below and click "Generate Speech" to hear it spoken using ElevenLabs TTS.
      </p>
      
      <div style={{ marginBottom: '16px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          style={{
            width: '100%',
            height: '120px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={generateSpeech}
          disabled={isLoading || !text.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Speech'}
        </button>
      </div>

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Audio:</h3>
          <audio controls src={audioUrl} style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Audio generated using ElevenLabs Text-to-Speech API
          </p>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
        <h4>🔧 To Enable Full Voice AI:</h4>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Upgrade your ElevenLabs plan to include ConvAI features</li>
          <li>Or generate a new API key with ConvAI permissions</li>
          <li>Visit: <a href="https://elevenlabs.io/app/subscription" target="_blank" rel="noopener noreferrer">
            ElevenLabs Subscription
          </a></li>
        </ol>
      </div>
    </div>
  );
}
