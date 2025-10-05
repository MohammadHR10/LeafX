// agent/agentController.js
// Lightweight orchestrator placeholder (no external AgentTune SDK yet).
import { advisorPersona } from './persona.js';
import { toolRegistry, listTools } from './tools.js';

export async function agentRespond(message, context = {}) {
  // Simple heuristic: if user asks for impact or carbon -> suggest assess_impact tool.
  const lower = message.toLowerCase();
  const tool_calls = [];
  if (lower.includes('impact') || lower.includes('carbon')) {
    tool_calls.push({ tool: 'assess_impact', args: { selections: context.selections || [] } });
  } else if (lower.includes('alternative')) {
    tool_calls.push({ tool: 'suggest_alternatives', args: { items: context.items || [] } });
  }

  return {
    persona: 'leafx_procuresense',
    persona_prompt_hash: advisorPersona.length, // trivial placeholder
    message: `Persona active. Tools available: ${listTools().map(t=>t.name).join(', ')}.`,
    tool_calls
  };
}

export async function invokeTool(name, args) {
  const def = toolRegistry[name];
  if (!def) return { success: false, error: 'Unknown tool' };
  try {
    return await def.invoke(args || {});
  } catch (e) {
    return { success: false, error: e.message };
  }
}
