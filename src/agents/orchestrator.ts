import { Agent } from '@openai/agents';
import { customerAgent } from './customers';
import { subscriptionAgent } from './subscriptions';
import { documentationAgent } from './documentation';

export const orchestrator = new Agent({
  name: 'Orchestrator',
  instructions: 'You are the orchestrator agent. You can hand off to other agents when necessary.',
  handoffs: [
    customerAgent, subscriptionAgent, documentationAgent
  ]
});