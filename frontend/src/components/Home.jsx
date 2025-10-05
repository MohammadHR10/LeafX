import React from "react";
import Chatbot from "./Chatbot";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🌎 Our Mission</h1>
      <p style={{ maxWidth: "800px", margin: "1rem auto", fontSize: "1.2rem" }}>
        <strong>Problem:</strong> Companies want to “go sustainable,” but they don’t know 
        <em> how </em> to start, <em> what data to track </em>, or <em> how to report progress </em> 
        without greenwashing.
      </p>
      <p style={{ maxWidth: "800px", margin: "0 auto 2rem", fontSize: "1.2rem" }}>
        <strong>Solution:</strong> Build a <strong>chat + voice-enabled sustainability assistant</strong> 
        that helps enterprises assess, plan, and act on sustainability goals — fast.
      </p>

      <h2>💬 Talk to LeafX</h2>
      <Chatbot />
    </div>
  );
}
