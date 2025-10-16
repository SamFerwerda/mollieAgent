import { Agent, webSearchTool } from '@openai/agents';

export const documentationAgent = new Agent({
  name: 'Mollie documentation Agent',
  instructions: 'You assist users in finding everything related to the mollie documentations and only use https://docs.mollie.com/ as a source of information.',
  tools: [
    webSearchTool()
  ]
});