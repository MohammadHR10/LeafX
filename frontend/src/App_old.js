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
        <h2>Choose Your Voice AI Experience</h2>
        
        <div style={{ margin: "20px 0" }}>
          <button 
            onClick={() => {
              setShowSimpleChat(!showSimpleChat);
              setShowVoiceChat(false);
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
              marginBottom: "10px"
            }}
          >
            {showSimpleChat ? "Hide" : "Show"} Simple Voice Chat (Free Tier ✅)
          </button>
          
          <button 
            onClick={() => {
              setShowVoiceChat(!showVoiceChat);
              setShowSimpleChat(false);
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            {showVoiceChat ? "Hide" : "Show"} Advanced Voice Chat (Requires Paid Plan ❌)
          </button>
        </div>

        <div style={{ fontSize: "14px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
          <p><strong>Simple Voice Chat:</strong> Works with ElevenLabs free tier. Uses browser speech recognition + TTS API.</p>
          <p><strong>Advanced Voice Chat:</strong> Requires ElevenLabs paid plan with ConvAI features for real-time conversation.</p>
        </div>
      </div>

      {showSimpleChat && (
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          <SimpleVoiceChat />
        </div>
      )}

      {showVoiceChat && (
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          <div style={{ padding: "16px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "4px", marginBottom: "20px" }}>
            <strong>⚠️ Note:</strong> This feature requires a paid ElevenLabs plan with ConvAI access.
          </div>
          <VoicePage />
        </div>
      )}
    </div>
  );
}

export default App;

// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch("api/message")
//       .then((res) => res.json())
//       .then((data) => setMessage(data.text));
//   }, []);

//   return (
//     <div>
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;


// // import logo from './logo.svg';
// // import './App.css';

// // // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;
