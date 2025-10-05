// server.js (ESM)
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // use 5001 to avoid macOS system service on 5000

app.use(cors()); // allow cross-origin requests
app.use(express.json());

app.get("/api/message", (req, res) => {
  // return `text` to match frontend's `data.text` usage
  res.json({ text: "LeafX backend is running!" });
});

// Alternative Text-to-Speech endpoint for testing (doesn't require ConvAI permissions)
app.post("/api/eleven/tts", async (req, res) => {
  const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = req.body; // Default to Rachel voice
  const XI_KEY = process.env.ELEVEN_API_KEY;

  if (!XI_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN_API_KEY" });
  }

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': XI_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    // Convert audio to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    res.json({ audio_base64: base64Audio });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ElevenLabs Text-to-Speech endpoint (works with free tier)
app.post("/api/eleven/text-to-speech", async (req, res) => {
  const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = req.body; // Default to Rachel voice
  const XI_KEY = process.env.ELEVEN_API_KEY;

  if (!XI_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN_API_KEY" });
  }

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': XI_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    // Convert audio to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    res.json({ audio_base64: base64Audio });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available voices (works with free tier)
app.get("/api/eleven/voices", async (req, res) => {
  const XI_KEY = process.env.ELEVEN_API_KEY;

  if (!XI_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN_API_KEY" });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { 'xi-api-key': XI_KEY }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ElevenLabs Text-to-Speech endpoint (Free tier compatible)
app.post("/api/eleven/tts", async (req, res) => {
  const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = req.body; // Default voice: Rachel
  const XI_KEY = process.env.ELEVEN_API_KEY;

  if (!XI_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN_API_KEY" });
  }

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': XI_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // Get the audio buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 for easy transmission
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    res.json({ 
      audio_base64: base64Audio,
      content_type: 'audio/mpeg'
    });

  } catch (error) {
    console.error('Error with ElevenLabs TTS:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Expert Advisor endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Expert AI System Prompt
    const systemPrompt = `You are an expert AI advisor with deep knowledge across all domains. When someone asks you a question:

Respond as if you're the go-to expert consultant in that domain. Be precise on your response`;

    const response = generateExpertResponse(message, systemPrompt);
    res.json({ response });

  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateExpertResponse(userMessage, systemPrompt) {
  // System prompt: You are an expert environment advisor and high intellect advisor who knows sustainable practices in any category. 
  // For example, if someone asks about food waste, you are specific with your answer to their specific question.
  
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Food & Waste
  if (lowerMessage.match(/\b(food|waste|composting|kitchen|leftovers|grocery|organic|spoilage|meal|cooking)\b/)) {
    return `For food waste: Plan meals weekly, store produce properly (bananas separate, greens in damp towels), use FIFO method, compost scraps, and repurpose leftovers within 48 hours. Start tracking what you throw away for one week.`;
  }
  
  // Energy & Carbon
  else if (lowerMessage.match(/\b(energy|electricity|carbon|emissions|solar|renewable|heating|cooling|insulation)\b/)) {
    return `Energy efficiency: LED bulbs, programmable thermostat, seal air leaks, unplug devices when not in use. Switch to renewable energy provider if available. Biggest impact: heating/cooling optimization and appliance upgrades.`;
  }
  
  // Transportation
  else if (lowerMessage.match(/\b(transport|car|driving|commute|travel|fuel|electric|bike|walk|public)\b/)) {
    return `Transportation sustainability: Combine trips, maintain proper tire pressure, remove excess weight from car. Consider carpooling, public transit, or e-bike for short trips. Electric vehicles if purchasing new.`;
  }
  
  // Water Conservation
  else if (lowerMessage.match(/\b(water|shower|irrigation|lawn|garden|rain|conservation|drought)\b/)) {
    return `Water conservation: Fix leaks immediately, install low-flow fixtures, collect rainwater for plants, water gardens early morning. Replace lawn with native plants that require less water.`;
  }
  
  // Shopping & Consumption
  else if (lowerMessage.match(/\b(shopping|buying|plastic|packaging|recycling|clothes|consumer|purchase)\b/)) {
    return `Sustainable consumption: Buy only what you need, choose minimal packaging, bring reusable bags, buy secondhand first. Focus on quality over quantity for longer-lasting items.`;
  }
  
  // Home & Living
  else if (lowerMessage.match(/\b(home|house|cleaning|chemicals|natural|green|eco|sustainable|living)\b/)) {
    return `Green living: Use natural cleaners (vinegar, baking soda), buy in bulk to reduce packaging, choose bamboo/glass over plastic, maintain appliances for efficiency. Start with one room at a time.`;
  }
  
  // General environmental advice
  else {
    return `Environmental approach: Start small with one sustainable habit, measure your impact, focus on the biggest waste sources in your life. The 3 R's: Reduce first, then Reuse, finally Recycle. Consistency beats perfection.`;
  }
}

// ElevenLabs signed WebSocket URL endpoint (requires ConvAI permissions)
app.get("/api/eleven/signed-ws", async (req, res) => {
  const { agent_id } = req.query;
  const XI_KEY = process.env.ELEVEN_API_KEY;

  if (!XI_KEY) {
    return res.status(500).json({ error: "Missing ELEVEN_API_KEY" });
  }

  if (!agent_id || agent_id === 'your_agent_id_here') {
    return res.status(400).json({ 
      error: "Please provide a valid agent_id. Visit https://elevenlabs.io/agents to create an agent and get the ID." 
    });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agent_id}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': XI_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data); // { "signed_url": "wss://...&token=..." }
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});
