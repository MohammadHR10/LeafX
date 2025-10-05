// agent/tools.js
// Registry of MCP-style tools exposed to the agent layer.
import SupplyChainMCPService from '../services/supplyChainMCP.js';

const serviceSingleton = new SupplyChainMCPService();

export const toolRegistry = {
  parse_document: {
    description: 'Extract line items from uploaded procurement document',
    invoke: async ({ fileContent, filename }) => serviceSingleton.uploadPdfAndExtractLines(fileContent, filename)
  },
  extract_line_items: {
    description: 'Alias for parse_document when text already provided',
    invoke: async ({ text }) => serviceSingleton.uploadPdfAndExtractLines(text, 'inline.txt')
  },
  suggest_alternatives: {
    description: 'Return sustainable alternatives for provided line items',
    invoke: async ({ items }) => serviceSingleton.findSustainableAlternatives(items)
  },
  assess_impact: {
    description: 'Compute aggregate CO2e and cost impact of chosen alternatives',
    invoke: async ({ selections }) => serviceSingleton.assessImpact(selections)
  },
  create_bulk_order: {
    description: 'Create a bulk order (PO) from selected SKUs and quantities',
    invoke: async ({ items }) => serviceSingleton.createBulkOrder(items)
  }
};

export function listTools() {
  return Object.keys(toolRegistry).map(k => ({ name: k, description: toolRegistry[k].description }));
}
