// agent/agentController.js
// Lightweight orchestrator placeholder (no external AgentTune SDK yet).
import { advisorPersona } from './persona.js';
import { toolRegistry, listTools } from './tools.js';
import { sendAgentTuneMessage, agentTuneConfigured } from './agentTuneClient.js';

export async function agentRespond(message, context = {}) {
  // Try real AgentTune first if configured.
  if (agentTuneConfigured()) {
    const toolsMeta = listTools().map(t => ({ name: t.name, description: t.description }));
    const atResp = await sendAgentTuneMessage({ message, context: { ...context, tools: toolsMeta } });
    if (atResp.success && atResp.raw) {
      // Expecting shape: { response: string, tool_calls?: [{tool,args}] }
      const { response, tool_calls = [] } = atResp.raw;
      return {
        persona: 'leafx_procuresense',
        provider: 'AgentTune',
        message: response || '(empty)',
        tool_calls,
        upstream: atResp.raw
      };
    }
    // Fall through to heuristic if failure
  }

  // Heuristic fallback
  const lower = message.toLowerCase();
  const tool_calls = [];
  if (lower.includes('impact') || lower.includes('carbon')) {
    tool_calls.push({ tool: 'assess_impact', args: { selections: context.selections || [] } });
  } else if (lower.includes('alternative')) {
    tool_calls.push({ tool: 'suggest_alternatives', args: { items: context.items || [] } });
  }
  return {
    persona: 'leafx_procuresense',
    provider: agentTuneConfigured() ? 'AgentTune-fallback' : 'local-heuristic',
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
