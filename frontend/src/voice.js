import { useRef, useState } from "react";

// You'll need to set this in your .env file as REACT_APP_ELEVEN_AGENT_ID
const AGENT_ID = process.env.REACT_APP_ELEVEN_AGENT_ID;

export default function VoicePage() {
  const [transcript, setTranscript] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  async function start() {
    try {
      if (!AGENT_ID) {
        alert("Please set REACT_APP_ELEVEN_AGENT_ID in your .env file");
        return;
      }

      // 1) get signed URL from your backend route
      const r = await fetch(`/api/eleven/signed-ws?agent_id=${AGENT_ID}`);
      
      if (!r.ok) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      
      const { signed_url } = await r.json();

      // 2) open websocket
      const ws = new WebSocket(signed_url);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        ws.send(JSON.stringify({ type: "conversation_initiation_client_data" }));
        startStreamingMic(ws);
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "user_transcript") {
          const text = msg.user_transcription_event?.user_transcript;
          if (text) setTranscript(text);
        }
        if (msg.type === "audio") {
          const b64 = msg.audio_event?.audio_base64;
          if (b64) playBase64(b64);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error("Error starting voice chat:", error);
      alert("Error starting voice chat. Check console for details.");
    }
  }

  function stop() {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsConnected(false);
    setTranscript("");
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2>Voice Chat with ElevenLabs</h2>
      
      <div style={{ marginBottom: '16px' }}>
        {!isConnected ? (
          <button onClick={start} style={{ 
            padding: '12px 24px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Start Voice Chat
          </button>
        ) : (
          <button onClick={stop} style={{ 
            padding: '12px 24px', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Stop Voice Chat
          </button>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        Status: <span style={{ 
          color: isConnected ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div>
        <h3>Live Transcript:</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '4px',
          minHeight: '100px',
          whiteSpace: 'pre-wrap'
        }}>
          {transcript || 'Transcript will appear here...'}
        </pre>
      </div>
    </div>
  );
}

/** ---- helpers ---- */
function playBase64(b64) {
  try {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play().catch(console.error);
    
    // Clean up the object URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}

async function startStreamingMic(ws) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    src.connect(proc);
    proc.connect(ctx.destination);

    proc.onaudioprocess = (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        const f32 = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
          const s = Math.max(-1, Math.min(1, f32[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
        ws.send(JSON.stringify({ type: "user_audio_chunk", audio: b64 }));
      }
    };
  } catch (error) {
    console.error("Error accessing microphone:", error);
    alert("Error accessing microphone. Please ensure microphone permissions are granted.");
  }
}
