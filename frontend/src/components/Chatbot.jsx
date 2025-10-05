import React, { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const prompt = `You are LeafX, an AI sustainability assistant. 
Provide concise, friendly, actionable sustainability advice for this: ${input}`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gemini API error");
      }
      const aiText = data.text || "⚠️ Sorry, I couldn’t generate a response.";
      const botMessage = { sender: "bot", text: aiText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Gemini request failed. Check your API key or model access.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={styles.container}>
      <h3>🌱 Talk to LeafX</h3>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#d4edda" : "#e8f4fa",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, backgroundColor: "#f0f0f0" }}>
            ⏳ LeafX is thinking...
          </div>
        )}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask LeafX something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
  },
  chatBox: {
    width: "80%",
    maxWidth: "600px",
    height: "400px",
    margin: "20px auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#fff",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "10px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  inputArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #aaa",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
};

///////////////////////////////////ealier without api in the backend
// import React, { useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export default function Chatbot() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Load Gemini key from .env
//   const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       // ✅ Use Gemini 1.5 Flash via v1beta API
//       const model = genAI.getGenerativeModel(
//         { model: "gemini-1.5-flash-latest" },
//         { apiVersion: "v1beta" }
//       );

//       const prompt = `You are LeafX, an AI sustainability assistant. 
// Provide concise, friendly, actionable sustainability advice for this: ${input}`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const aiText = response.text();

//       const botMessage = { sender: "bot", text: aiText };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Gemini error:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "bot",
//           text: "⚠️ Gemini request failed. Check your API key or model access.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div style={styles.container}>
//       <h3>🌱 Talk to LeafX</h3>

//       <div style={styles.chatBox}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               ...styles.message,
//               alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
//               backgroundColor: msg.sender === "user" ? "#d4edda" : "#e8f4fa",
//             }}
//           >
//             {msg.text}
//           </div>
//         ))}

//         {loading && (
//           <div style={{ ...styles.message, backgroundColor: "#f0f0f0" }}>
//             ⏳ LeafX is thinking...
//           </div>
//         )}
//       </div>

//       <div style={styles.inputArea}>
//         <input
//           type="text"
//           placeholder="Ask LeafX something..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           style={styles.input}
//         />
//         <button onClick={handleSend} style={styles.button} disabled={loading}>
//           {loading ? "..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     textAlign: "center",
//     marginTop: "20px",
//   },
//   chatBox: {
//     width: "80%",
//     maxWidth: "600px",
//     height: "400px",
//     margin: "20px auto",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     padding: "10px",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     background: "#fff",
//   },
//   message: {
//     padding: "10px 15px",
//     borderRadius: "10px",
//     maxWidth: "80%",
//     wordWrap: "break-word",
//   },
//   inputArea: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "10px",
//     marginTop: "10px",
//   },
//   input: {
//     width: "70%",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #aaa",
//   },
//   button: {
//     padding: "10px 15px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#28a745",
//     color: "white",
//     cursor: "pointer",
//   },
// };





















//////////////not needed code below: ////////

// import React, { useState } from "react";

// export default function Chatbot() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Make sure your .env file (frontend/.env) has:
//   // REACT_APP_GEMINI_API_KEY=your_key_here
//   const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       // ✅ Use gemini-pro (guaranteed to work with MakerSuite key)
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 role: "user",
//                 parts: [
//                   {
//                     text: `You are LeafX, an AI sustainability assistant. Give concise, friendly sustainability advice for this: ${input}`,
//                   },
//                 ],
//               },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log("Gemini API Response:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.error?.message ||
//             "Gemini API error – check your API key or endpoint."
//         );
//       }

//       // ✅ Extract text safely
//       const aiResponse =
//         data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "⚠️ Sorry, I couldn’t generate a response.";

//       setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
//     } catch (error) {
//       console.error("Gemini API Error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Connection error with Gemini API." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div style={styles.container}>
//       <h3>🌱 Talk to LeafX</h3>
//       <div style={styles.chatBox}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               ...styles.message,
//               alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
//               backgroundColor: msg.sender === "user" ? "#d4edda" : "#e8f4fa",
//             }}
//           >
//             {msg.text}
//           </div>
//         ))}
//         {loading && (
//           <div style={{ ...styles.message, backgroundColor: "#f0f0f0" }}>
//             ⏳ LeafX is thinking...
//           </div>
//         )}
//       </div>

//       <div style={styles.inputArea}>
//         <input
//           type="text"
//           placeholder="Ask LeafX something..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           style={styles.input}
//         />
//         <button onClick={handleSend} style={styles.button} disabled={loading}>
//           {loading ? "..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     textAlign: "center",
//     marginTop: "20px",
//   },
//   chatBox: {
//     width: "80%",
//     maxWidth: "600px",
//     height: "400px",
//     margin: "20px auto",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     padding: "10px",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     background: "#fff",
//   },
//   message: {
//     padding: "10px 15px",
//     borderRadius: "10px",
//     maxWidth: "80%",
//   },
//   inputArea: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "10px",
//     marginTop: "10px",
//   },
//   input: {
//     width: "70%",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #aaa",
//   },
//   button: {
//     padding: "10px 15px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#28a745",
//     color: "white",
//     cursor: "pointer",
//   },
// };




// import React, { useState } from "react";

// export default function Chatbot() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     // --- Gemini API call (Replace YOUR_API_KEY below) ---
//     const res = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: `Give sustainability advice: ${input}` }] }]
//         })
//       }
//     );
//     const data = await res.json();
//     const aiResponse =
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "Sorry, I couldn’t generate a response right now.";
//     const botMessage = { sender: "bot", text: aiResponse };
//     setMessages((prev) => [...prev, botMessage]);
//   };

//   return (
//     <div style={styles.chatContainer}>
//       <div style={styles.chatBox}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               ...styles.message,
//               alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
//               backgroundColor: msg.sender === "user" ? "#c8e6c9" : "#e0f7fa"
//             }}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       <div style={styles.inputArea}>
//         <input
//           type="text"
//           placeholder="Ask LeafX something..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           style={styles.input}
//         />
//         <button onClick={handleSend} style={styles.sendBtn}>Send</button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   chatContainer: {
//     marginTop: "2rem",
//     width: "100%",
//     maxWidth: "600px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center"
//   },
//   chatBox: {
//     width: "100%",
//     height: "350px",
//     background: "#f9f9f9",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     padding: "1rem",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px"
//   },
//   message: {
//     padding: "10px 14px",
//     borderRadius: "12px",
//     maxWidth: "80%"
//   },
//   inputArea: {
//     display: "flex",
//     marginTop: "1rem",
//     width: "100%"
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ccc"
//   },
//   sendBtn: {
//     marginLeft: "10px",
//     padding: "10px 18px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#2e7d32",
//     color: "white",
//     cursor: "pointer"
//   }
// };
