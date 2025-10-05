import { useEffect, useState } from "react";
import FreeTierVoiceChat from "./FreeTierVoiceChat";

function App() {
  const [message, setMessage] = useState("");
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  useEffect(() => {
    // ✅ Always start with a leading slash for proxy to work
    fetch("/api/message")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMessage(data.text))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Failed to load message from backend 😢");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message || "Loading..."}</h1>
      
      <div style={{ margin: "20px" }}>
        <button 
          onClick={() => setShowVoiceChat(!showVoiceChat)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "16px"
          }}
        >
          {showVoiceChat ? "Hide Voice Chat" : "🎤 Try ElevenLabs Free Tier Voice AI"}
        </button>
      </div>

      {showVoiceChat && (
        <div style={{ textAlign: "left" }}>
          <FreeTierVoiceChat />
        </div>
      )}
    </div>
  );
}

export default App;
