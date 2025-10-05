// agent/agentTuneClient.js
// Generic AgentTune API client scaffold. Assumes a REST interface.
// Env vars:
//  AGENTTUNE_BASE_URL (e.g. https://api.agenttune.example)
//  AGENTTUNE_API_KEY  (bearer token)
//  AGENTTUNE_AGENT_ID (remote tuned agent identifier)
import fetch from 'node-fetch';

const BASE = process.env.AGENTTUNE_BASE_URL;
const KEY = process.env.AGENTTUNE_API_KEY;
const AGENT_ID = process.env.AGENTTUNE_AGENT_ID;

function isConfigured() {
  return !!(BASE && KEY && AGENT_ID);
}

export async function sendAgentTuneMessage({ message, context }) {
  if (!isConfigured()) {
    return { success: false, error: 'AgentTune not configured', configured: false };
  }
  const url = `${BASE.replace(/\/$/, '')}/v1/agents/${AGENT_ID}/message`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        context,
        tools: context?.tools || undefined // optionally pass tool schema
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!resp.ok) {
      const text = await resp.text();
      return { success: false, error: `AgentTune HTTP ${resp.status}: ${text}` };
    }
    const data = await resp.json();
    return { success: true, configured: true, raw: data };
  } catch (e) {
    clearTimeout(timeout);
    return { success: false, configured: true, error: e.name === 'AbortError' ? 'AgentTune request timeout' : e.message };
  }
}

export function agentTuneConfigured() {
  return isConfigured();
}
