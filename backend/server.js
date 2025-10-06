// LeafX Server - Professional Environmental AI Platform
// Modern Node.js/Express Server with Enterprise-Grade Features
import { GoogleGenerativeAI } from "@google/generative-ai";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import SupplyChainMCPService from './services/supplyChainMCP.js';

// Load environment variables
dotenv.config();

// Server Configuration
const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Services
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const mcpService = new SupplyChainMCPService();

// Professional Logging
const logger = {
  info: (message, data = {}) => console.log(`ℹ️  [${new Date().toISOString()}] ${message}`, data),
  error: (message, error = {}) => console.error(`❌ [${new Date().toISOString()}] ${message}`, error),
  warn: (message, data = {}) => console.warn(`⚠️  [${new Date().toISOString()}] ${message}`, data),
  success: (message, data = {}) => console.log(`✅ [${new Date().toISOString()}] ${message}`, data)
};

// Enterprise Middleware Stack
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression

// Rate limiting for API protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // Limit requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['https://leafx.vercel.app', 'https://your-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Marketplace routes
const products = [
  {
    id: 1,
    name: "Solar-Powered Desk Lamp",
    category: "Energy Efficiency",
    price: 39.99,
    description: "A sleek solar desk lamp that reduces electricity usage.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    name: "Recycled Office Paper Pack",
    category: "Office Supplies",
    price: 12.5,
    description: "100% post-consumer recycled A4 paper — eco-certified and chlorine-free.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    name: "Compostable Coffee Cups (Pack of 50)",
    category: "Kitchen",
    price: 18.0,
    description: "Made from corn-based bioplastic — industrially compostable and durable.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    name: "Bamboo Keyboard & Mouse Set",
    category: "Electronics",
    price: 59.99,
    description: "Sustainably sourced bamboo design for modern eco-conscious offices.",
    image: "https://images.unsplash.com/photo-1616627452901-0f2ce2bdbb2e?auto=format&fit=crop&w=500&q=80",
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:category', (req, res) => {
  const category = req.params.category;
  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category === category);
  res.json(filteredProducts);
});

app.get("/api/message", (req, res) => {
  // return `text` to match frontend's `data.text` usage
  res.json({ text: "LeafX backend is running!" });
});

// Alternative Text-to-Speech endpoint for testing (doesn't require ConvAI permissions)
app.post("/api/eleven/tts", async (req, res) => {
  const { text, voice_id = "pNInz6obpgDQGcFmaJgB" } = req.body; // Default to Adam (male) voice
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
          model_id: "eleven_turbo_v2", // Proven working Turbo v2 for pro users
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
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

// ElevenLabs Text-to-Speech endpoint (Pro features enabled)
app.post("/api/eleven/text-to-speech", async (req, res) => {
  const { text, voice_id = "pNInz6obpgDQGcFmaJgB" } = req.body; // Default to Adam (male) voice
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
          model_id: "eleven_turbo_v2", // Pro model for enhanced quality
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
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

// ElevenLabs Text-to-Speech endpoint (Pro tier enabled) - Male Voice
app.post("/api/eleven/tts", async (req, res) => {
  const { text, voice_id = "pNInz6obpgDQGcFmaJgB" } = req.body; // Default voice: Adam (male)
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
          model_id: "eleven_turbo_v2", // Pro model with premium quality
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
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
      
      const enhancedPrompt = `You are a professional environmental expert specializing in sustainable eco-friendly products and practices. 
Provide concise, actionable advice focusing on:
- Sustainable product recommendations
- Eco-friendly alternatives
- Environmental impact reduction
- Green living solutions

Keep responses brief (2-3 sentences max) and product-focused.

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
    return "🌱 I recommend these eco-friendly product swaps: LED bulbs for energy efficiency, bamboo alternatives for plastic items, and certified sustainable brands. Focus on products with minimal packaging and recyclable materials.";
  }
  
  if (lowerPrompt.includes('carbon') || lowerPrompt.includes('emissions')) {
    return "🌍 Choose renewable energy providers, energy-efficient appliances (ENERGY STAR certified), and carbon-neutral shipping options. Electric vehicles and plant-based products significantly reduce your carbon footprint.";
  }
  
  if (lowerPrompt.includes('waste') || lowerPrompt.includes('recycling')) {
    return "♻️ Use reusable products: stainless steel water bottles, glass food containers, and compostable bags. Choose brands with minimal, recyclable packaging and repair services.";
  }
  
  if (lowerPrompt.includes('energy') || lowerPrompt.includes('electricity')) {
    return "⚡ Energy efficiency ideas: Use LED bulbs, unplug devices when not in use, optimize heating/cooling settings, install smart power strips, consider solar panels, and choose energy-efficient appliances. Monitor your usage to track progress!";
  }
  
  if (lowerPrompt.includes('water') || lowerPrompt.includes('conservation')) {
    return "💧 Water conservation strategies: Fix leaks promptly, install low-flow fixtures, collect rainwater for plants, take shorter showers, run full loads in dishwashers/washing machines, and choose drought-resistant plants for landscaping.";
  }
  
  // Default response for general sustainability questions
  return "🌿 I'm your environmental product specialist. I recommend sustainable alternatives, eco-friendly brands, and green products that reduce environmental impact. What specific product or area interests you?";
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
      
      const enhancedPrompt = `You are a professional environmental expert specializing in sustainable eco-friendly products.

Guidelines:
- Focus on sustainable product recommendations and eco-friendly alternatives
- Give specific, actionable advice for environmental impact reduction
- Keep responses under 2 sentences for voice interaction
- Always recommend specific eco-friendly products or practices
- Be concise and professional

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
    return `Use glass storage containers, beeswax wraps instead of plastic, and countertop composters. Buy from zero-waste grocery stores and choose products with compostable packaging.`;
  }
  
  // Energy & Carbon
  else if (lowerMessage.match(/\b(energy|electricity|carbon|emissions|solar|renewable|heating|cooling|insulation)\b/)) {
    return `Install smart thermostats, ENERGY STAR appliances, and solar panels. Use smart power strips and choose renewable energy providers like Green Mountain Energy or Arcadia Power.`;
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

// ================== SUPPLY CHAIN MCP ROUTES ==================

// Route 1: Upload PDF and extract line items
app.post('/api/mcp/upload-pdf', async (req, res) => {
  try {
    const { fileContent, filename } = req.body;
    console.log('=== FILE UPLOAD ENDPOINT ===');
    console.log('📄 File upload received:', filename);
    console.log('📏 Content length:', fileContent ? fileContent.length : 'null');
    console.log('🔍 Content starts with:', fileContent ? fileContent.substring(0, 50) : 'null');
    console.log('📂 File type detection:', fileContent ? (fileContent.startsWith('data:application/pdf') ? 'PDF' : fileContent.startsWith('data:application/vnd.openxmlformats') ? 'DOCX' : 'Other') : 'Unknown');
    const result = await mcpService.uploadPdfAndExtractLines(fileContent, filename);
    console.log('✅ Extraction result success:', result.success);
    console.log('📋 Items extracted:', result.line_items ? result.line_items.length : 0);
    console.log('🏷️ Extracted from:', result.extracted_from);
    console.log('=== END FILE UPLOAD ===');
    res.json(result);
  } catch (error) {
    console.error('Error extracting PDF:', error);
    res.status(500).json({ error: 'Failed to extract line items from PDF' });
  }
});

// Route 2: Find sustainable alternatives
app.post('/api/mcp/find-alternatives', async (req, res) => {
  try {
    const { items } = req.body;
    console.log('=== FIND ALTERNATIVES ENDPOINT ===');
    console.log('📦 Items received:', items ? items.length : 0);
    console.log('📝 Items data:', JSON.stringify(items, null, 2));
    
    const result = mcpService.findSustainableAlternatives(items);
    
    console.log('✅ Alternatives result success:', result ? result.success : 'no result');
    console.log('🌱 Alternatives found:', result && result.items ? result.items.length : 0);
    console.log('=== END FIND ALTERNATIVES ===');
    
    res.json(result);
  } catch (error) {
    console.error('Error finding alternatives:', error);
    res.status(500).json({ error: 'Failed to find sustainable alternatives', details: error.message });
  }
});

// Route 3: Check stock and pricing
app.post('/api/mcp/check-stock', async (req, res) => {
  try {
    const { sku, qty } = req.body;
    const result = mcpService.checkStockAndPrice(sku, qty);
    res.json(result);
  } catch (error) {
    console.error('Error checking stock:', error);
    res.status(500).json({ error: 'Failed to check stock availability' });
  }
});

// Route 4: Create bulk order
app.post('/api/mcp/create-order', async (req, res) => {
  try {
    const { selectedItems } = req.body;
    const result = mcpService.createBulkOrder(selectedItems);
    res.json(result);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create bulk order' });
  }
});

// Route 5: Generate quote
app.post('/api/mcp/generate-quote', async (req, res) => {
  try {
    const { po_id, orderData } = req.body;
    const result = mcpService.emitQuote(po_id, orderData);
    res.json(result);
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Route 6: Get marketplace products (enhanced)
app.get('/api/mcp/products', async (req, res) => {
  try {
    res.json({ products: mcpService.products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0',
    environment: NODE_ENV,
    services: {
      gemini: !!genAI,
      elevenlabs: !!process.env.ELEVEN_API_KEY,
      mcp: !!mcpService
    }
  });
});

// API Documentation Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'LeafX Environmental AI API',
    version: '2.0.0',
    description: 'Professional environmental expert AI platform with voice interaction',
    endpoints: {
      'GET /health': 'Server health check',
      'GET /api/products': 'Get all sustainable products',
      'POST /api/chat': 'AI environmental expert chat',
      'POST /api/eleven/tts': 'Text-to-speech conversion',
      'GET /api/eleven/voices': 'Available voices',
      'POST /api/mcp/upload-pdf': 'Upload and extract procurement documents',
      'POST /api/mcp/find-alternatives': 'Find sustainable alternatives'
    },
    documentation: 'https://github.com/MohammadHR10/LeafX',
    support: 'Environmental sustainability AI assistance'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api', '/health', '/api/products', '/api/chat']
  });
});

// Graceful Server Startup
const server = app.listen(PORT, () => {
  logger.success(`🌿 LeafX Server started successfully!`);
  logger.info(`🚀 Environment: ${NODE_ENV}`);
  logger.info(`🌐 Server URL: http://localhost:${PORT}`);
  logger.info(`📋 Health Check: http://localhost:${PORT}/health`);
  logger.info(`📚 API Docs: http://localhost:${PORT}/api`);
  logger.info(`🔑 Gemini AI: ${genAI ? '✅ Connected' : '❌ Not configured'}`);
  logger.info(`🎤 ElevenLabs: ${process.env.ELEVEN_API_KEY ? '✅ Connected' : '❌ Not configured'}`);
  console.log('================================');
});

// Graceful Shutdown Handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    logger.success('Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Enhanced Error Handling
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception - Server will restart:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
