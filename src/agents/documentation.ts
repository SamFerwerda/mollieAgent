import { Agent, webSearchTool } from '@openai/agents';

export const documentationAgent: Agent = new Agent({
  name: 'Mollie documentation Agent',
  handoffDescription: 'Handles questions related to the Mollie documentation.',
  instructions: `You assist users in finding everything related to the mollie documentations 
  and only use https://docs.mollie.com/ as a source of information. If the question is not related to the documentation, hand off to the orchestrator.`,
  tools: [
    webSearchTool()
  ]
});