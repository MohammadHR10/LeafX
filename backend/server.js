// server.js (ESM)
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // use 5001 to avoid macOS system service on 5000

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

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

// Gemini AI endpoint for chat functionality
app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    if (genAI) {
      // Use real Gemini AI
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const enhancedPrompt = `You are LeafX, an expert environmental and sustainability AI assistant. 
You provide practical, actionable advice on sustainable living, environmental protection, and eco-friendly practices.
Be concise but informative, friendly but professional. Focus on actionable steps the user can take.

User question: ${prompt}

Response:`;

      const result = await model.generateContent(enhancedPrompt);
      const response = result.response;
      const text = response.text();
      
      res.json({ text });
    } else {
      // Fallback to enhanced pattern matching
      const response = generateEnhancedGeminiResponse(prompt);
      res.json({ text: response });
    }

  } catch (error) {
    console.error('Error generating Gemini response:', error);
    // Fallback to pattern matching on error
    const response = generateEnhancedGeminiResponse(prompt);
    res.json({ text: response });
  }
});

function generateEnhancedGeminiResponse(prompt) {
  // Enhanced response generation with more dynamic content
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('sustainability') || lowerPrompt.includes('environmental')) {
    return "🌱 Great question about sustainability! Here are some actionable steps: 1) Start with energy efficiency (LED lights, smart thermostats), 2) Reduce waste through composting and recycling, 3) Choose sustainable transportation options, and 4) Support eco-friendly products. Small changes make a big impact!";
  }
  
  if (lowerPrompt.includes('carbon') || lowerPrompt.includes('emissions')) {
    return "🌍 To reduce carbon emissions: Switch to renewable energy, improve home insulation, use public transport or electric vehicles, eat more plant-based meals, and support companies with strong climate commitments. Every action counts!";
  }
  
  if (lowerPrompt.includes('waste') || lowerPrompt.includes('recycling')) {
    return "♻️ Waste reduction tips: Follow the 3 R's (Reduce, Reuse, Recycle), compost organic waste, buy products with minimal packaging, repair instead of replacing, and donate items you no longer need. Aim for zero waste gradually!";
  }
  
  if (lowerPrompt.includes('energy') || lowerPrompt.includes('electricity')) {
    return "⚡ Energy efficiency ideas: Use LED bulbs, unplug devices when not in use, optimize heating/cooling settings, install smart power strips, consider solar panels, and choose energy-efficient appliances. Monitor your usage to track progress!";
  }
  
  if (lowerPrompt.includes('water') || lowerPrompt.includes('conservation')) {
    return "💧 Water conservation strategies: Fix leaks promptly, install low-flow fixtures, collect rainwater for plants, take shorter showers, run full loads in dishwashers/washing machines, and choose drought-resistant plants for landscaping.";
  }
  
  // Default response for general sustainability questions
  return "🌿 LeafX here! I'm your sustainability assistant. I can help you with eco-friendly practices, carbon reduction, waste management, energy efficiency, and sustainable living tips. What specific area would you like to explore?";
}

// AI Expert Advisor endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (genAI) {
      // Use real Gemini AI for voice chat
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const enhancedPrompt = `You are LeafX, an expert environmental and sustainability AI assistant with deep knowledge across all domains. 
When someone asks you a question, respond as their go-to expert consultant in that domain. 

Key guidelines:
- Be precise and actionable in your responses
- Focus on practical steps they can take immediately
- Keep responses conversational but informative (ideal for voice interaction)
- If it's about sustainability/environment, give specific actionable advice
- If it's about other topics, still maintain expertise but relate back to sustainability when relevant
- Keep responses under 3 sentences for voice interaction

User message: ${message}

Expert response:`;

      const result = await model.generateContent(enhancedPrompt);
      const response = result.response;
      const text = response.text();
      
      res.json({ response: text });
    } else {
      // Fallback to enhanced pattern matching
      const response = generateEnhancedExpertResponse(message);
      res.json({ response });
    }

  } catch (error) {
    console.error('Error generating AI response:', error);
    // Fallback to pattern matching on error
    const response = generateEnhancedExpertResponse(message);
    res.json({ response });
  }
});

function generateEnhancedExpertResponse(userMessage) {
  // Enhanced expert response system with more dynamic and specific advice
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
  
  // General questions about other topics - provide expert advice but relate to sustainability
  else if (lowerMessage.match(/\b(health|fitness|exercise|diet|nutrition)\b/)) {
    return `Health & sustainability: Choose local, organic produce when possible, walk or bike for exercise, grow your own herbs, reduce processed foods. Healthy for you and the planet.`;
  }
  
  else if (lowerMessage.match(/\b(technology|tech|computer|phone|device|electronic)\b/)) {
    return `Tech sustainability: Extend device lifespan with cases and maintenance, buy refurbished when possible, recycle electronics properly, use cloud storage to reduce local hardware needs.`;
  }
  
  else if (lowerMessage.match(/\b(money|finance|budget|investment|cost|save|expensive)\b/)) {
    return `Sustainable finance: Energy-efficient upgrades save money long-term, buy quality items that last, consider green investments, track utility costs to identify savings opportunities.`;
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
